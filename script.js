// =========================================================
//  VERITY AI - MASTER SCRIPT (CLEAN & CRASH-PROOF)
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("Verity AI Script Loaded..."); 

    // 1. Initialize Authentication (Login Check)
    checkLoginStatus();

    // 2. Initialize Theme (Dark/Light Mode)
    initializeTheme();
});

// =========================================================
//  SECTION 1: AUTHENTICATION & NAVBAR LOGIC
// =========================================================

function checkLoginStatus() {
    // LocalStorage se data uthao
    const token = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");
    const userPic = localStorage.getItem("userPic");

    // HTML Elements dhoondho
    const loggedOutView = document.getElementById("logged-out-view");
    const loggedInView = document.getElementById("logged-in-view");
    const navUserName = document.getElementById("nav-user-name");
    const navUserImg = document.getElementById("nav-user-img");

    // Safety Check: Agar Navbar elements page par hain tabhi update karo
    if (loggedInView && loggedOutView) {
        if (token) {
            // === USER LOGGED IN ===
            loggedOutView.style.display = "none";
            loggedInView.style.display = "flex";
            
            // Naam aur Photo set karo
            if (navUserName && userName) navUserName.textContent = userName;
            if (navUserImg && userPic) navUserImg.src = userPic;
        } else {
            // === USER LOGGED OUT ===
            loggedOutView.style.display = "flex";
            loggedInView.style.display = "none";
        }
    }
}

// 🔴 Logout Function
function logout() {
    localStorage.clear(); // Sab data clear
    window.location.href = "index.html"; // Home page par bhejo
}

// 🔒 Access Check (Try Verity Button ke liye)
function checkAccess() {
    const token = localStorage.getItem("authToken");
    if (token) {
        window.location.href = "try-verity.html";
    } else {
        alert("Please login first to access the tool!");
        window.location.href = "login.html";
    }
}

// =========================================================
//  SECTION 2: THEME TOGGLE (DARK / LIGHT MODE)
// =========================================================

function initializeTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // 1. Saved theme load karo (Default: Light)
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    // 2. 🛑 CRASH FIX: Button tabhi setup karo agar wo page par ho
    if (toggleBtn) {
        // Button icon update karo
        toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        // Click Event Listener
        toggleBtn.onclick = () => {
            const current = htmlElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            // Apply & Save
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Icon Update
            toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        };
    }
}

// =========================================================
//  SECTION 3: AI EVALUATION ENGINE (TRY VERITY PAGE ONLY)
// =========================================================

async function runEvaluation() {
    // Elements dhoondho
    const promptInput = document.getElementById("prompt");
    const responseInput = document.getElementById("response");
    const resultDiv = document.getElementById("result");

    // 🛑 Safety Check: Agar ye elements nahi hain (Home Page par), toh mat chalo
    if (!promptInput || !responseInput || !resultDiv) return;

    const prompt = promptInput.value;
    const responseText = responseInput.value;

    // UI Update: Loading State
    resultDiv.innerHTML = "⏳ Evaluating... Please wait.";
    resultDiv.style.borderLeft = "none";
    resultDiv.style.backgroundColor = "transparent";

    try {
        // Backend API Call (Render URL)
        const response = await fetch("https://verity-backend.onrender.com/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt,
                response: responseText
            })
        });

        const data = await response.json();
        console.log("Evaluation result:", data);

        // Result Show Karo
        resultDiv.innerHTML = `
            <h3>Analysis Result</h3>
            <p><b>GEN SCORE:</b> ${data.gen_score}</p>
            <p><b>DECISION:</b> ${data.decision}</p>
            <p><b>RISK LEVEL:</b> ${data.risk_level}</p>
            <p><b>ACCURACY:</b> ${data.accuracy}</p>
            <hr style="opacity:0.2; margin: 10px 0;">
            <p class="explanation"><b>EXPLANATION:</b> ${data.short_explanation}</p>
        `;

        // 🎨 Color Coding (Visual Feedback)
        if (data.decision === "BLOCK") {
            resultDiv.style.borderLeft = "6px solid #ef4444"; // Red
            resultDiv.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        } else if (data.decision === "REVIEW") {
            resultDiv.style.borderLeft = "6px solid #f59e0b"; // Orange
            resultDiv.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
        } else {
            resultDiv.style.borderLeft = "6px solid #10b981"; // Green
            resultDiv.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
        }

    } catch (error) {
        console.error("API Error:", error);
        resultDiv.innerHTML = "❌ Error connecting to server. Please try again.";
    }
}