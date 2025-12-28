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
// API WRAPPERS (GLOBAL)
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
  const { error } = await supabaseClient.from("registrations").insert({
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
    if (error.code === "23505") {
      return { status: "error", message: "Registration number already exists" };
    }
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
    return { status: "error", message: "Registration not found" };
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
  // 1. Fetch user
  const { data, error } = await supabaseClient
    .from("registrations")
    .select("*")
    .eq("reg_no", regNo)
    .single();

  if (error || !data) {
    return { status: "error", message: "Invalid QR Code" };
  }

  // 2. Already scanned
  if (data.entry_scanned) {
    return {
      status: "used",
      message: "Entry already used",
      data: {
        name: data.name,
        type: data.type,
        time: data.entry_time
      }
    };
  }

  // 3. First time scan → allow entry
  await supabaseClient
    .from("registrations")
    .update({
      entry_scanned: true,
      entry_time: new Date()
    })
    .eq("reg_no", regNo);

  return {
    status: "allowed",
    message: "Entry Allowed",
    data: {
      name: data.name,
      type: data.type
    }
  };
}


async function verifyFood(regNo) {
  const { data, error } = await supabaseClient
    .from("registrations")
    .select("*")
    .eq("reg_no", regNo)
    .single();

  if (error || !data) {
    return { status: "error", message: "Invalid QR Code" };
  }

  if (data.food_scanned) {
    return {
      status: "used",
      message: "Food already collected",
      data: {
        name: data.name,
        food: data.food,
        time: data.food_time
      }
    };
  }

  await supabaseClient
    .from("registrations")
    .update({
      food_scanned: true,
      food_time: new Date()
    })
    .eq("reg_no", regNo);

  return {
    status: "allowed",
    message: "Food Collected",
    data: {
      name: data.name,
      food: data.food
    }
  };
}
