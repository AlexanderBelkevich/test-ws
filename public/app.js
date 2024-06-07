const socket = io("https://test-ws-hmw3.onrender.com");

const activity = document.querySelector(".activity");
const msgInput = document.querySelector("input");

const sendMessage = (e) => {
  e.preventDefault();
  if (msgInput.value) {
    socket.emit("message", msgInput.value);
    msgInput.value = "";
  }
  msgInput.focus();
};

document.querySelector("form").addEventListener("submit", sendMessage);

// Listen for messages

socket.on("message", (data) => {
  activity.textContent = "";
  const div = document.createElement("div");
  div.textContent = data;
  div.classList.add("msg-bubble");
  document.querySelector(".msger-chat").appendChild(div);
});

msgInput.addEventListener("keypress", () => {
  socket.emit("activity", socket.id.substring(0, 5));
});

socket.on("activity", (name) => {
  activity.textContent = `User ${name} is typing...`;
});
