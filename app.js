const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

const OPENAI_API_KEY = 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
async function fetchGPTResponse(message) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "I couldn't understand that.";
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  addMessage("bot", "Typing...");
  const replies = await fetchGPTResponse(message);
  chatBox.lastChild.innerText = replies;
});
function createExportButtons(codeText) {
  const wrapper = document.createElement("div");
  wrapper.style.marginTop = "10px";

  // 🌐 Preview
  const previewBtn = document.createElement("button");
  previewBtn.textContent = "🌐 Preview";
  previewBtn.onclick = () => {
    const blob = new Blob([codeText], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };
  wrapper.appendChild(previewBtn);

  // ⬇️ Download
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "⬇️ Download";
  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([codeText]));
    a.download = "shichat_output.html";
    a.click();
  };
  wrapper.appendChild(downloadBtn);

  return wrapper;
}
