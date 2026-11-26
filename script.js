
// ==========================================
// AtomiX Corp — Authentication System
// ==========================================

// Supabase configuration
const SUPABASE_URL = "https://wcqldiflesfuqjpugelp.supabase.co";

const SUPABASE_KEY = "sb_publishable_R4yvoBbqAjvgCcrEe09QJw_b-QUGVzI";

// Initialize Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// SIGN UP
// ==========================================

async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: window.location.origin + "/signin.html"
        }
    });

    if (error) {
        throw error;
    }

    return data;
}


// ==========================================
// SIGN IN
// ==========================================

async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        throw error;
    }

    return data;
}


// ==========================================
// SIGN OUT
// ==========================================

async function signOut() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        throw error;
    }
}


// ==========================================
// GET CURRENT USER
// ==========================================

async function getCurrentUser() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
        return null;
    }

    return data.user;
}


// ==========================================
// PASSWORD RECOVERY
// ==========================================

async function resetPassword(email) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
            redirectTo: window.location.origin + "/signin.html?reset=1"
        }
    );

    if (error) {
        throw error;
    }
}


// ==========================================
// UPDATE PASSWORD
// ==========================================

async function updatePassword(newPassword) {
    const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
    });

    if (error) {
        throw error;
    }
}


// ==========================================
// AUTHENTICATION STATE
// ==========================================

supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("AtomiX Auth Event:", event);

    if (event === "SIGNED_IN") {
        console.log("User signed in:", session.user.email);
    }

    if (event === "SIGNED_OUT") {
        console.log("User signed out.");
    }
});
