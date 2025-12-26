// ================================
// SAFETY CHECKS
// ================================

if (!window.APP_CONFIG) {
  throw new Error("APP_CONFIG not loaded. Check script order.");
}

if (typeof supabase === "undefined") {
  throw new Error("Supabase SDK not loaded.");
}

// ================================
// SUPABASE CLIENT
// ================================

const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG;

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ================================
// GLOBAL API FUNCTIONS
// ================================

window.apiPost = async function (payload) {
  switch (payload.action) {
    case "register":
      return registerUser(payload.data);

    case "verifyPayment":
      return verifyPayment(payload.transactionId, payload.regNo);

    case "verifyEntry":
      return verifyEntry(payload.regNo);

    case "verifyFood":
      return verifyFood(payload.regNo);

    default:
      return { status: "error", message: "Invalid action" };
  }
};

window.apiGet = async function (params) {
  switch (params.action) {
    case "getPass":
      return getRegistration(params.regNo);

    case "stats":
      return getDashboardStats();

    default:
      return { status: "error", message: "Invalid action" };
  }
};

// ================================
// DATABASE FUNCTIONS
// ================================

async function registerUser(data) {
  const { error } = await supabaseClient
    .from("registrations")
    .insert({
      name: data.name,
      reg_no: data.regNo,
      branch: data.branch,
      section: data.section,
      type: data.type,
      food: data.food,
      email: data.email,
      status: data.type === "Junior" ? "Approved" : "Pending",
      payment_status: data.type === "Junior" ? "Paid" : "Unpaid",
      entry_scanned: false,
      food_scanned: false
    });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "This registration number is already registered."
      };
    }
    console.error(error);
    return { status: "error", message: "Registration failed" };
  }

  return { status: "ok" };
}

async function getRegistration(regNo) {
  const { data, error } = await supabaseClient
    .from("registrations")
    .select("*")
    .eq("reg_no", regNo)
    .single();

  if (error) {
    return { status: "error", message: "Pass not found" };
  }

  return { status: "ok", data };
}

async function verifyPayment(txId, regNo) {
  const { error } = await supabaseClient
    .from("registrations")
    .update({
      payment_status: "Paid",
      status: "Approved",
      transaction_id: txId
    })
    .eq("reg_no", regNo);

  if (error) return { status: "error", message: error.message };
  return { status: "ok" };
}

async function verifyEntry(regNo) {
  const { error } = await supabaseClient
    .from("registrations")
    .update({ entry_scanned: true })
    .eq("reg_no", regNo);

  if (error) return { status: "error", message: error.message };
  return { status: "ok" };
}

async function verifyFood(regNo) {
  const { error } = await supabaseClient
    .from("registrations")
    .update({ food_scanned: true })
    .eq("reg_no", regNo);

  if (error) return { status: "error", message: error.message };
  return { status: "ok" };
}

// ================================
// DASHBOARD STATS (FULL & FIXED)
// ================================

async function getDashboardStats() {
  const { data, error } = await supabaseClient
    .from("registrations")
    .select("type, payment_status, food, entry_scanned");

  if (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }

  const stats = {
    total: data.length,
    freshers: 0,
    seniors: 0,
    paid: 0,
    pending: 0,
    veg: 0,
    nonVeg: 0,
    entryConfirmed: 0
  };

  data.forEach(r => {
    if (r.type === "Junior") stats.freshers++;
    if (r.type === "Senior") stats.seniors++;

    if (r.payment_status === "Paid") stats.paid++;
    if (r.payment_status === "Unpaid") stats.pending++;

    if (r.food === "Veg") stats.veg++;
    if (r.food === "NonVeg") stats.nonVeg++;

    if (r.entry_scanned === true) stats.entryConfirmed++;
  });

  return { status: "ok", data: stats };
}
