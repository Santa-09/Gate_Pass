// utils-supabase.js
// Supabase Configuration
const SUPABASE_URL = "https://nwrqnsxfzhfcjrqsfopu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cnFuc3hmemhmY2pycXNmb3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NTgwMTMsImV4cCI6MjA4MjIzNDAxM30.vDyr86W0aiRJNecdy1LpBrIfKxxVh_XDdI_lgJehXn0";

// Initialize Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Enhanced API functions for Supabase
async function apiPost(data) {
    try {
        switch(data.action) {
            case 'register':
                return await registerUser(data.data);
            case 'verifyPayment':
                return await verifyPayment(data.transactionId, data.regNo);
            case 'verifyEntry':
                return await verifyEntry(data.regNo);
            case 'verifyFood':
                return await verifyFood(data.regNo);
            default:
                return { status: 'error', message: 'Invalid action' };
        }
    } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: error.message };
    }
}

async function apiGet(params) {
    try {
        switch(params.action) {
            case 'getPass':
                return await getRegistration(params.regNo);
            case 'stats':
                return await getDashboardStats();
            case 'getStats':
                return await getDashboardStats();
            default:
                return { status: 'error', message: 'Invalid action' };
        }
    } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: error.message };
    }
}

// Specific API Functions
async function registerUser(userData) {
    try {
        // Check if reg_no already exists
        const { data: existing, error: checkError } = await supabaseClient
            .from('registrations')
            .select('reg_no')
            .eq('reg_no', userData.regNo)
            .single();

        if (existing) {
            return { status: 'error', message: 'Registration number already exists' };
        }

        // Insert new registration
        const { data, error } = await supabaseClient
            .from('registrations')
            .insert([{
                name: userData.name,
                reg_no: userData.regNo,
                branch: userData.branch,
                section: userData.section,
                type: userData.type,
                food: userData.food,
                email: userData.email,
                status: 'Pending',
                payment_status: userData.type === 'Senior' ? 'Unpaid' : 'Approved'
            }])
            .select()
            .single();

        if (error) throw error;

        return { 
            status: 'ok', 
            message: 'Registration successful',
            data: data
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function getRegistration(regNo) {
    try {
        const { data, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .eq('reg_no', regNo)
            .single();

        if (error) throw error;

        // Format data for frontend
        const formattedData = {
            Name: data.name,
            RegNo: data.reg_no,
            Branch: data.branch,
            Section: data.section,
            Type: data.type,
            Food: data.food,
            Status: data.status,
            payment_status: data.payment_status,
            entry_scanned: data.entry_scanned,
            food_scanned: data.food_scanned
        };

        return { status: 'ok', data: formattedData };
    } catch (error) {
        return { status: 'error', message: 'Registration not found' };
    }
}

async function verifyPayment(transactionId, regNo) {
    try {
        // First, check if transaction exists
        const { data: transaction, error: txError } = await supabaseClient
            .from('payment_transactions')
            .select('*')
            .eq('transaction_id', transactionId)
            .single();

        if (txError || !transaction) {
            return { status: 'error', message: 'Transaction ID not found' };
        }

        if (transaction.status === 'Success') {
            return { status: 'error', message: 'Transaction already verified' };
        }

        // Update transaction status
        const { error: updateTxError } = await supabaseClient
            .from('payment_transactions')
            .update({ 
                status: 'Success',
                verified_at: new Date().toISOString()
            })
            .eq('transaction_id', transactionId);

        if (updateTxError) throw updateTxError;

        // Update registration status
        const { error: updateRegError } = await supabaseClient
            .from('registrations')
            .update({ 
                payment_status: 'Paid',
                status: 'Approved',
                transaction_id: transactionId
            })
            .eq('reg_no', regNo);

        if (updateRegError) throw updateRegError;

        return { 
            status: 'ok', 
            message: 'Payment verified successfully' 
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function verifyEntry(regNo) {
    try {
        const { data: registration, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .eq('reg_no', regNo)
            .single();

        if (error || !registration) {
            return { status: 'error', message: 'Invalid QR code' };
        }

        if (registration.entry_scanned) {
            return { 
                status: 'warning', 
                message: 'Already scanned',
                data: {
                    scannedAt: registration.entry_time,
                    ...registration
                }
            };
        }

        if (registration.status !== 'Approved') {
            return { status: 'error', message: 'Registration not approved' };
        }

        // Update entry scan
        const { error: updateError } = await supabaseClient
            .from('registrations')
            .update({ 
                entry_scanned: true,
                entry_time: new Date().toISOString()
            })
            .eq('reg_no', regNo);

        if (updateError) throw updateError;

        return { 
            status: 'success', 
            message: 'Entry approved',
            data: registration
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function verifyFood(regNo) {
    try {
        const { data: registration, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .eq('reg_no', regNo)
            .single();

        if (error || !registration) {
            return { status: 'error', message: 'Invalid QR code' };
        }

        if (!registration.entry_scanned) {
            return { status: 'error', message: 'Entry not verified yet' };
        }

        if (registration.food_scanned) {
            return { 
                status: 'warning', 
                message: 'Food already redeemed',
                data: {
                    redeemedAt: registration.food_time,
                    ...registration
                }
            };
        }

        // Update food scan
        const { error: updateError } = await supabaseClient
            .from('registrations')
            .update({ 
                food_scanned: true,
                food_time: new Date().toISOString()
            })
            .eq('reg_no', regNo);

        if (updateError) throw updateError;

        return { 
            status: 'success', 
            message: 'Food redemption successful',
            data: registration
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

async function getDashboardStats() {
    try {
        // Get total registrations
        const { count: total, error: totalError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true });

        // Get freshers count
        const { count: freshers, error: freshersError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'Junior');

        // Get seniors count
        const { count: seniors, error: seniorsError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'Senior');

        // Get veg count
        const { count: veg, error: vegError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('food', 'Veg');

        // Get paid count
        const { count: paid, error: paidError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'Paid');

        // Get entry confirmed count
        const { count: entryConfirmed, error: entryError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('entry_scanned', true);

        // Get food confirmed count
        const { count: foodConfirmed, error: foodError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('food_scanned', true);

        // Get today's registrations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: presentToday, error: todayError } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

        // Get registration trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: trendData, error: trendError } = await supabaseClient
            .from('registrations')
            .select('created_at, type')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        // Process trend data
        const trend = {
            labels: [],
            freshers: [],
            seniors: []
        };

        if (trendData) {
            // Group by date
            const grouped = {};
            trendData.forEach(item => {
                const date = new Date(item.created_at).toLocaleDateString();
                if (!grouped[date]) {
                    grouped[date] = { freshers: 0, seniors: 0 };
                }
                if (item.type === 'Junior') {
                    grouped[date].freshers++;
                } else {
                    grouped[date].seniors++;
                }
            });

            Object.keys(grouped).forEach(date => {
                trend.labels.push(date);
                trend.freshers.push(grouped[date].freshers);
                trend.seniors.push(grouped[date].seniors);
            });
        }

        return {
            status: 'ok',
            data: {
                total: total || 0,
                freshers: freshers || 0,
                seniors: seniors || 0,
                veg: veg || 0,
                nonVeg: (total || 0) - (veg || 0),
                paid: paid || 0,
                pending: (total || 0) - (paid || 0),
                entryConfirmed: entryConfirmed || 0,
                foodConfirmed: foodConfirmed || 0,
                presentToday: presentToday || 0,
                trend: trend
            }
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

// Admin authentication
async function adminLogin(username, password) {
    try {
        // In production, use proper authentication
        // For simplicity, we'll check against the database
        const { data, error } = await supabaseClient
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) {
            return { status: 'error', message: 'Invalid credentials' };
        }

        // Note: In production, use proper password hashing comparison
        // For now, we'll use a simple check
        if (username === 'Santa' && password === 'santa@2414') {
            return { status: 'ok', message: 'Login successful' };
        }

        return { status: 'error', message: 'Invalid credentials' };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

// Export functions
window.freshersApp = {
    supabase: supabaseClient,
    apiPost,
    apiGet,
    adminLogin,
    getDashboardStats,
    getRegistration,
    verifyPayment,
    verifyEntry,
    verifyFood
};

console.log('✅ Supabase utils loaded successfully');