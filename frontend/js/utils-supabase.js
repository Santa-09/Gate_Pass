const SUPABASE_URL =
  window.SUPABASE_URL ||
  import.meta?.env?.VITE_SUPABASE_URL ||
  "";

const SUPABASE_ANON_KEY =
  window.SUPABASE_ANON_KEY ||
  import.meta?.env?.VITE_SUPABASE_ANON_KEY ||
  "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase env variables not found");
}

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ================================
// API WRAPPERS
// ================================

async function apiPost(payload) {
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
}

async function apiGet(params) {
  switch (params.action) {
    case "getPass":
      return getRegistration(params.regNo);

    case "stats":
      return getDashboardStats();

    default:
      return { status: "error", message: "Invalid action" };
  }
}

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
      payment_status: data.type === "Junior" ? "Paid" : "Unpaid"
    });

  if (error) {
    console.error("Registration error:", error);
    return { status: "error", message: error.message };
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
    console.error("Fetch registration error:", error);
    return { status: "error", message: "Not found" };
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

  if (error) {
    console.error("Payment verify error:", error);
    return { status: "error", message: error.message };
  }

  return { status: "ok" };
}

async function verifyEntry(regNo) {
  const { error } = await supabaseClient
    .from("registrations")
    .update({ entry_scanned: true })
    .eq("reg_no", regNo);

  if (error) {
    console.error("Entry verify error:", error);
    return { status: "error", message: error.message };
  }

  return { status: "ok" };
}

async function verifyFood(regNo) {
  const { error } = await supabaseClient
    .from("registrations")
    .update({ food_scanned: true })
    .eq("reg_no", regNo);

  if (error) {
    console.error("Food verify error:", error);
    return { status: "error", message: error.message };
  }

  return { status: "ok" };
}

async function getDashboardStats() {
  const { count: total, error } = await supabaseClient
    .from("registrations")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Dashboard stats error:", error);
    return { status: "error", message: error.message };
  }

  return {
    status: "ok",
    data: { total }
  };
}
