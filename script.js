async function runEvaluation() {
  const prompt = document.getElementById("prompt").value;
  const responseText = document.getElementById("response").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "⏳ Evaluating...";

  try {
    const response = await fetch("http://127.0.0.1:8000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        response: responseText
      })
    });

    // ✅ data yahin pe define hota hai
    const data = await response.json();

    console.log("Evaluation result:", data);

    // ✅ data ke baad hi use karo
    resultDiv.innerHTML = `
      <h3>Result</h3>
      <p><b>GEN SCORE:</b> ${data.gen_score}</p>
      <p><b>DECISION:</b> ${data.decision}</p>
      <p><b>RISK LEVEL:</b> ${data.risk_level}</p>
      <p><b>ACCURACY:</b> ${data.accuracy}</p>
      <p><b>EXPLANATION:</b> ${data.short_explanation}</p>
    `;

    // 🎨 Color coding
    if (data.decision === "BLOCK") {
      resultDiv.style.borderLeft = "6px solid red";
    } else if (data.decision === "REVIEW") {
      resultDiv.style.borderLeft = "6px solid orange";
    } else {
      resultDiv.style.borderLeft = "6px solid green";
    }

  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "❌ Error evaluating response";
  }
}
const toggle = document.getElementById("themeToggle");
const body = document.body;

toggle.onclick = () => {
  const theme = body.getAttribute("data-theme");
  body.setAttribute(
    "data-theme",
    theme === "dark" ? "light" : "dark"
  );
  toggle.textContent = theme === "dark" ? "🌙" : "☀️";
};
// 1. Elements ko pakdo
const toggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// 2. Check karo ki user ne pehle kya save kiya tha
const savedTheme = localStorage.getItem('theme');

// 3. Agar saved hai toh wo lagao, nahi toh Light mode default
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
} else {
    htmlElement.setAttribute('data-theme', 'light');
}

// 4. Button click hone par kya hoga
toggleBtn.addEventListener('click', () => {
    // Current theme check karo
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    // Switch karo (Light -> Dark, Dark -> Light)
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Naya theme lagao
    htmlElement.setAttribute('data-theme', newTheme);
    
    // Browser ki memory (LocalStorage) mein save karo
    localStorage.setItem('theme', newTheme);
});
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.premium-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
// 1. Page load hote hi check karein ki pehle se koi theme save hai ya nahi

document.documentElement.setAttribute('data-theme', savedTheme);

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 2. Nayi theme set karein
    html.setAttribute('data-theme', newTheme);
    
    // 3. Local Storage mein save karein taaki dusre pages ko pata chal sake
    localStorage.setItem('theme', newTheme);
}
// Decision Card Animation
setTimeout(() => {
    document.querySelector('.decision-loader').style.display = 'none';
    document.querySelector('.allow-stamp').classList.remove('hidden');
}, 2000);