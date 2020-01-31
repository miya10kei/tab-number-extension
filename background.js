// ---------------------------
// --- event listenrの設定 ---
// ---------------------------
chrome.runtime.onMessage.addListener(msg => {
  if (msg.event === "change") {
    operateTabs(sendChangeFaviconEvent);
  } else {
    operateTabs(sendRevertFaviconEvent);
  }
});

// ----------------
// --- function ---
// ----------------
function sendChangeFaviconEvent(tabId, tabIndex) {
  chrome.tabs.sendMessage(tabId, { type: "change", index: tabIndex });
}

function sendRevertFaviconEvent(tabId) {
  chrome.tabs.sendMessage(tabId, { type: "revert" });
}

function operateTabs(callback) {
  chrome.tabs.query({ currentWindow: true }, tabs => {
    tabs
      // 10以上はショートカットでの移動ができないためfaviconを変えない
      .filter(tab => tab.index < 10)
      .forEach(tab => {
        callback(tab.id, tab.index + 1);
      });
  });
}
