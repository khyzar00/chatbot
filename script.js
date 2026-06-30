function saveApiKey() {
    const keyInput = document.getElementById("apiKeyInput");
    const key = keyInput.value.trim();
    if (!key) {
        alert("Please enter a valid API key.");
        return;
    }
    sessionStorage.setItem("openrouter_api_key", key);
    keyInput.value = "";
    alert("API key saved for this session.");
}

function getApiKey() {
    return sessionStorage.getItem("openrouter_api_key");
}

async function sendMessage() {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert("Please enter and save your API key first.");
        return;
    }

    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const userText = input.value.trim();

    if (!userText) return;

    chatBox.innerHTML += `<div class="message user-message">${userText}</div>`;
    input.value = "";

    chatBox.innerHTML += `<div class="message bot-message" id="thinking">Thinking...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "openrouter/free",
                max_tokens: 1000,
                messages: [{ role: "user", content: userText }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content || "No response received.";

        document.getElementById("thinking").remove();
        chatBox.innerHTML += `<div class="message bot-message">${botReply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        document.getElementById("thinking").remove();
        chatBox.innerHTML += `<div class="message bot-message">Something went wrong. Please try again.</div>`;
        console.error(error);
    }
}

document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});
