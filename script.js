
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
            emailRedirectTo: "https://mahbodghatee.github.io/AtomiX-Corp-Website/signin.html"
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
// AUTHENTICATION STATE & PROFILE BUTTON
// ==========================================

function updateProfileButton(user) {
    const profileButtons = document.querySelectorAll(".profile-button");

    profileButtons.forEach(button => {
        const initial = button.querySelector(".profile-initial");

        if (!initial) return;

        initial.textContent = user?.email
            ? user.email.charAt(0).toUpperCase()
            : "?";
    });
}


// Check the current login status when the page loads
getCurrentUser().then(user => {
    updateProfileButton(user);
});


// Listen for login and logout events
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("AtomiX Auth Event:", event);

    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        updateProfileButton(session?.user ?? null);
    }

    if (event === "SIGNED_OUT") {
        updateProfileButton(null);
    }
});


// ==========================================
// SIGN IN FORM
// ==========================================

const signInForm = document.getElementById("signin-form");

if (signInForm) {
    signInForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("signin-email").value.trim();
        const password = document.getElementById("signin-password").value;

        const message = document.getElementById("signin-message");
        const button = signInForm.querySelector("button[type='submit']");

        message.textContent = "";
        message.className = "auth-message";

        button.disabled = true;
        button.textContent = "Signing in...";

        try {
            await signIn(email, password);

            message.textContent = "Sign in successful! Welcome back.";
            message.classList.add("success");

            window.location.href = "index.html";

        } catch (error) {
            message.textContent = error.message;
            message.classList.add("error");

            button.disabled = false;
            button.textContent = "Sign In";
        }
    });
}


const signUpForm = document.getElementById("signup-form");

if (signUpForm) {
    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        const message = document.getElementById("signup-message");
        const button = signUpForm.querySelector("button[type='submit']");

        message.textContent = "";
        message.className = "auth-message";

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.classList.add("error");
            return;
        }

        button.disabled = true;
        button.textContent = "Creating Account...";

        try {
            await signUp(email, password);

            message.textContent =
                "Account created! Check your email to confirm your account.";

            message.classList.add("success");

            signUpForm.reset();

        } catch (error) {
            message.textContent = error.message;
            message.classList.add("error");
        } finally {
            button.disabled = false;
            button.textContent = "Create Account";
        }
    });
}
