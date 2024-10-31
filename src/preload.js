const { ipcRenderer } = require("electron");

// ipcRenderer.on("sending", () => {
//   console.log("working");
// });

window.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    const text = document.querySelector("input").value;
    ipcRenderer.invoke("data", text);
  });
});
