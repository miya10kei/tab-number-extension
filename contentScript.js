window.addEventListener("keydown", function(e) {
  if (e.key === "Meta") chrome.runtime.sendMessage({ event: "keydown" });
});

window.addEventListener("keyup", function(e) {
  if (e.key === "Meta") chrome.runtime.sendMessage({ event: "keyup" });
});
