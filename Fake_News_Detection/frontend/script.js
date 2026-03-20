function checkNews() {
    const text = document.getElementById("newsText").value;

    if (text.trim() === "") {
        showError("Please enter some text to analyze.");
        return;
    }

    setLoading(true);

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
    })
    .then(response => {
        if (!response.ok) throw new Error("Server error: " + response.status);
        return response.json();
    })
    .then(data => {
        const result = document.getElementById("result");
        const isReal = data.prediction.toLowerCase() === "real";
        const confidence = (data.confidence * 100).toFixed(1);

        result.innerHTML = `
            ${isReal ? "✅ Likely Authentic" : "🚨 Likely Disinformation"}
            <br>
            <span style="font-size:0.9rem; font-family:'DM Sans',sans-serif; font-weight:400; opacity:0.8;">
                Confidence: ${confidence}%
            </span>
        `;
        result.className = isReal ? "real" : "fake";
    })
    .catch(error => {
        console.error("Error:", error);
        showError("Could not connect to the backend. Is your server running?");
    })
    .finally(() => {
        setLoading(false);
    });
}

function setLoading(isLoading) {
    const btn = document.querySelector("button");
    btn.disabled = isLoading;
    btn.textContent = isLoading ? "Analyzing…" : "Analyze for Disinformation";
}

function showError(msg) {
    const result = document.getElementById("result");
    result.innerHTML = msg;
    result.className = "";
    result.style.cssText = `
        color: #f87171;
        background: rgba(248,113,113,0.08);
        border: 1px solid rgba(248,113,113,0.2);
        border-radius: 10px;
        padding: 14px 20px;
        margin-top: 24px;
    `;
}

// Clear result when user edits input
document.getElementById("newsText").addEventListener("input", () => {
    const result = document.getElementById("result");
    result.innerHTML = "";
    result.className = "";
    result.style.cssText = "";
});