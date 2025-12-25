// js/utils-supabase.js
const SUPABASE_URL = "https://nwrqnsxfzhfcjrqsfopu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cnFuc3hmemhmY2pycXNmb3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NTgwMTMsImV4cCI6MjA4MjIzNDAxM30.vDyr86W0aiRJNecdy1LpBrIfKxxVh_XDdI_lgJehXn0";

// Initialize Supabase
const supabase = window.supabase || {};
const supabaseClient = supabase.createClient ? 
    supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

console.log('✅ Supabase initialized:', !!supabaseClient);

// ==================== API FUNCTIONS ====================
async function apiPost(data) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return { status: 'error', message: 'Client not initialized' };
    }

    try {
        console.log('📤 API Post:', data.action);
        
        switch(data.action) {
            case 'register':
                return await registerUser(data.data);
            case 'verifyPayment':
                return await verifyPayment(data.transactionId, data.regNo);
            case 'verifyEntry':
                return await verifyEntry(data.qrCode || data.regNo);
            case 'verifyFood':
                return await verifyFood(data.qrCode || data.regNo);
            case 'adminLogin':
                return await adminLogin(data.username, data.password);
            default:
                return { status: 'error', message: 'Invalid action' };
        }
    } catch (error) {
        console.error('❌ API Post Error:', error);
        return { status: 'error', message: error.message || 'Network error' };
    }
}

async function apiGet(params) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return { status: 'error', message: 'Client not initialized' };
    }

    try {
        console.log('📥 API Get:', params.action);
        
        switch(params.action) {
            case 'getPass':
                return await getRegistration(params.regNo);
            case 'stats':
            case 'getStats':
                return await getDashboardStats();
            default:
                return { status: 'error', message: 'Invalid action' };
        }
    } catch (error) {
        console.error('❌ API Get Error:', error);
        return { status: 'error', message: error.message || 'Network error' };
    }
}

// ==================== HELPER FUNCTIONS ====================
async function registerUser(userData) {
    try {
        console.log('👤 Registering:', userData.regNo);
        
        // Check if registration exists
        const { data: existing, error: checkError } = await supabaseClient
            .from('registrations')
            .select('reg_no')
            .eq('reg_no', userData.regNo)
            .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Check existing error:', checkError);
        }

        if (existing) {
            return { status: 'error', message: 'Registration number already exists' };
        }

        // Insert new registration
        const { data, error } = await supabaseClient
            .from('registrations')
            .insert({
                name: userData.name,
                reg_no: userData.regNo,
                branch: userData.branch,
                section: userData.section,
                type: userData.type,
                food: userData.food,
                email: userData.email,
                status: userData.type === 'Junior' ? 'Approved' : 'Pending',
                payment_status: userData.type === 'Junior' ? 'Paid' : 'Unpaid'
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Insert error:', error);
            throw error;
        }

        console.log('✅ Registration successful:', data.reg_no);
        
        return { 
            status: 'ok', 
            message: 'Registration successful',
            data: formatRegistrationData(data)
        };
    } catch (error) {
        console.error('❌ Registration Error:', error);
        return { status: 'error', message: error.message || 'Registration failed' };
    }
}

async function getRegistration(regNo) {
    try {
        console.log('🔍 Getting registration:', regNo);
        
        const { data, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .eq('reg_no', regNo)
            .maybeSingle();

        if (error) {
            console.error('Get registration error:', error);
            throw error;
        }

        if (!data) {
            return { status: 'error', message: 'Registration not found' };
        }

        return { 
            status: 'ok', 
            data: formatRegistrationData(data)
        };
    } catch (error) {
        console.error('❌ Get registration Error:', error);
        return { status: 'error', message: 'Registration not found' };
    }
}

function formatRegistrationData(data) {
    return {
        Name: data.name || '',
        RegNo: data.reg_no || '',
        Branch: data.branch || '',
        Section: data.section || '',
        Type: data.type || '',
        Food: data.food || '',
        Status: data.status || '',
        payment_status: data.payment_status || '',
        entry_scanned: data.entry_scanned || false,
        food_scanned: data.food_scanned || false,
        transaction_id: data.transaction_id || '',
        email: data.email || ''
    };
}

async function verifyPayment(transactionId, regNo) {
    try {
        console.log('💰 Verifying payment:', transactionId, regNo);
        
        // First, update the registration
        const { data: updatedData, error: regError } = await supabaseClient
            .from('registrations')
            .update({ 
                payment_status: 'Paid',
                status: 'Approved',
                transaction_id: transactionId
            })
            .eq('reg_no', regNo)
            .select()
            .single();

        if (regError) {
            console.error('❌ Update registration error:', regError);
            throw regError;
        }

        // Then, create payment transaction record
        const { error: txError } = await supabaseClient
            .from('payment_transactions')
            .insert({
                reg_no: regNo,
                transaction_id: transactionId,
                amount: 500.00,
                status: 'Success',
                verified_at: new Date().toISOString()
            });

        if (txError) {
            console.error('❌ Create payment error:', txError);
            throw txError;
        }

        console.log('✅ Payment verified successfully');
        return { 
            status: 'ok', 
            message: 'Payment verified successfully' 
        };
    } catch (error) {
        console.error('❌ Verify payment error:', error);
        return { status: 'error', message: error.message || 'Payment verification failed' };
    }
}

async function verifyEntry(qrCode) {
    try {
        // Extract regNo from QR code
        const regMatch = qrCode.match(/\|REG:([^|]+)/);
        const regNo = regMatch ? regMatch[1] : qrCode;
        
        console.log('🚪 Verifying entry for:', regNo);
        
        const { data: registration, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .eq('reg_no', regNo)
            .maybeSingle();

        if (error) {
            console.error('Verify entry fetch error:', error);
            throw error;
        }

        if (!registration) {
            return { status: 'error', message: 'Invalid QR code' };
        }

        if (registration.entry_scanned) {
            return { 
                status: 'warning', 
                message: 'Already scanned',
                data: formatRegistrationData(registration)
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

        if (updateError) {
            console.error('Update entry error:', updateError);
            throw updateError;
        }

        console.log('✅ Entry approved:', regNo);
        return { 
            status: 'success', 
            message: 'Entry approved',
            data: formatRegistrationData(registration)
        };
    } catch (error) {
        console.error('❌ Verify entry error:', error);
        return { status: 'error', message: error.message || 'Entry verification failed' };
    }
}

async function verifyFood(qrCode) {
    try {
        // Extract regNo from QR code
        const regMatch = qrCode.match(/\|REG:([^|]+)/);
        const regNo = regMatch ? regMatch[1] : qrCode;
        
        console.log('🍽️ Verifying food for:', regNo);
        
        const { data: registration, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .eq('reg_no', regNo)
            .maybeSingle();

        if (error) {
            console.error('Verify food fetch error:', error);
            throw error;
        }

        if (!registration) {
            return { status: 'error', message: 'Invalid QR code' };
        }

        if (!registration.entry_scanned) {
            return { status: 'error', message: 'Entry not verified yet' };
        }

        if (registration.food_scanned) {
            return { 
                status: 'warning', 
                message: 'Food already redeemed',
                data: formatRegistrationData(registration)
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

        if (updateError) {
            console.error('Update food error:', updateError);
            throw updateError;
        }

        console.log('✅ Food redeemed:', regNo);
        return { 
            status: 'success', 
            message: 'Food redemption successful',
            data: formatRegistrationData(registration)
        };
    } catch (error) {
        console.error('❌ Verify food error:', error);
        return { status: 'error', message: error.message || 'Food verification failed' };
    }
}

async function getDashboardStats() {
    try {
        console.log('📊 Getting dashboard stats');
        
        // Get total registrations
        const { count: total } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true });

        // Get freshers count
        const { count: freshers } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'Junior');

        // Get seniors count
        const { count: seniors } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'Senior');

        // Get veg count
        const { count: veg } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('food', 'Veg');

        // Get paid count
        const { count: paid } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'Paid');

        // Get entry confirmed count
        const { count: entryConfirmed } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('entry_scanned', true);

        // Get food confirmed count
        const { count: foodConfirmed } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('food_scanned', true);

        // Get today's registrations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: presentToday } = await supabaseClient
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

        // Get registration trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: trendData } = await supabaseClient
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

        if (trendData && trendData.length > 0) {
            const grouped = {};
            trendData.forEach(item => {
                const date = new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                });
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
        console.error('❌ Stats Error:', error);
        return { 
            status: 'ok', 
            data: {
                total: 0,
                freshers: 0,
                seniors: 0,
                veg: 0,
                nonVeg: 0,
                paid: 0,
                pending: 0,
                entryConfirmed: 0,
                foodConfirmed: 0,
                presentToday: 0,
                trend: { labels: [], freshers: [], seniors: [] }
            }
        };
    }
}

async function adminLogin(username, password) {
    // Simple admin check
    if (username === 'Santa' && password === 'santa@2414') {
        console.log('🔑 Admin login successful');
        return { status: 'ok', message: 'Login successful' };
    }
    console.log('❌ Admin login failed');
    return { status: 'error', message: 'Invalid credentials' };
}

// ==================== EXPORT FUNCTIONS ====================
window.freshersApp = {
    supabase: supabaseClient,
    apiPost,
    apiGet,
    adminLogin,
    getDashboardStats,
    getRegistration,
    verifyPayment,
    verifyEntry,
    verifyFood,
    formatRegistrationData
};

console.log('🚀 Freshers App loaded with Supabase backend');
