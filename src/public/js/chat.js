const socket = io();

let user = "";

async function UserChat() {
  const { value: email } = await Swal.fire({
    title: "Enter your Email",
    input: "text",
    inputLabel: "Email",
    inputValue: "",
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return "Must enter a valid email adress";
      }
    },
  });

  if (email) {
    user = email;
    Swal.fire(`Your username is: ${user}`);
  } else {
    Swal.fire(`Didnt enter email`);
  }
}

UserChat();

const chatBox = document.getElementById("chatbox");
const messageLogs = document.getElementById("messageLogs");

chatBox.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    const message = chatBox.value;
    if (message.trim() !== "") {
      const mess = { msg: message, user: user };
      socket.emit("message", mess);
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (messages) => {
  let messagesHTML = "";

  messages.forEach((message) => {
    messagesHTML += `
      <div class="message">
        <b>${message.user}:</b><br>${message.msg}<br>
      </div>`;
  });

  messageLogs.innerHTML = messagesHTML;
});
