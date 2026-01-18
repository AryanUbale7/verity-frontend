// =========================================================
//  VERITY AI - MASTER SCRIPT (FULL & FINAL)
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("Verity AI Script Loaded..."); 

    // 1. Initialize Authentication (Login Check)
    checkLoginStatus();

    // 2. Initialize Theme (Dark/Light Mode)
    initializeTheme();

    // 3. Initialize Mobile Menu (Hamburger) ✅ NEW ADDED
    initializeMobileMenu();
});

// =========================================================
//  SECTION 1: MOBILE MENU LOGIC (NEW)
// =========================================================
function initializeMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            // Toggle 'active' class on click
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// =========================================================
//  SECTION 2: AUTHENTICATION & NAVBAR LOGIC
// =========================================================

function checkLoginStatus() {
    const token = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");
    const userPic = localStorage.getItem("userPic");

    const loggedOutView = document.getElementById("logged-out-view");
    const loggedInView = document.getElementById("logged-in-view");
    const navUserName = document.getElementById("nav-user-name");
    const navUserImg = document.getElementById("nav-user-img");

    if (loggedInView && loggedOutView) {
        if (token) {
            // === USER LOGGED IN ===
            loggedOutView.style.display = "none";
            loggedInView.style.display = "flex";
            
            if (navUserName && userName) navUserName.textContent = userName;
            if (navUserImg && userPic) navUserImg.src = userPic;
        } else {
            // === USER LOGGED OUT ===
            loggedOutView.style.display = "flex";
            loggedInView.style.display = "none";
        }
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

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
//  SECTION 3: THEME TOGGLE (DARK / LIGHT MODE)
// =========================================================

function initializeTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (toggleBtn) {
        toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        toggleBtn.onclick = () => {
            const current = htmlElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        };
    }
}

// =========================================================
//  SECTION 4: AI EVALUATION ENGINE
// =========================================================

async function runEvaluation() {
    const promptInput = document.getElementById("prompt");
    const responseInput = document.getElementById("response");
    const resultDiv = document.getElementById("result");

    if (!promptInput || !responseInput || !resultDiv) return;

    const prompt = promptInput.value;
    const responseText = responseInput.value;

    resultDiv.innerHTML = "⏳ Evaluating... Please wait.";
    resultDiv.style.borderLeft = "none";
    resultDiv.style.backgroundColor = "transparent";

    try {
        const response = await fetch("https://verity-backend.onrender.com/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt, response: responseText })
        });

        const data = await response.json();
        
        resultDiv.innerHTML = `
            <h3>Analysis Result</h3>
            <p><b>GEN SCORE:</b> ${data.gen_score}</p>
            <p><b>DECISION:</b> ${data.decision}</p>
            <p><b>RISK LEVEL:</b> ${data.risk_level}</p>
            <p><b>ACCURACY:</b> ${data.accuracy}</p>
            <hr style="opacity:0.2; margin: 10px 0;">
            <p class="explanation"><b>EXPLANATION:</b> ${data.short_explanation}</p>
        `;

        if (data.decision === "BLOCK") {
            resultDiv.style.borderLeft = "6px solid #ef4444";
            resultDiv.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        } else if (data.decision === "REVIEW") {
            resultDiv.style.borderLeft = "6px solid #f59e0b";
            resultDiv.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
        } else {
            resultDiv.style.borderLeft = "6px solid #10b981";
            resultDiv.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
        }

    } catch (error) {
        console.error("API Error:", error);
        resultDiv.innerHTML = "❌ Error connecting to server.";
    }
}
