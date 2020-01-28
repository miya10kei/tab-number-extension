const FAVICON_ID = "tab-bar-extention";
const INVALID_PREFIX = ["chrome://", "chrome-search://"];
const EN_NUM = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine"
];

chrome.runtime.onMessage.addListener(msg => {
  if (msg.event === "keydown") {
    operationTabs(showNumber);
  } else if (msg.event === "keyup") {
    operationTabs(hiddenNumber);
  }
});

function operationTabs(callback) {
  chrome.tabs.query({ currentWindow: true }, tabs => {
    tabs
      .filter(tab => isValid(tab.url))
      .forEach(tab => {
        const code = callback(tab.index);
        if (code) {
          chrome.tabs.executeScript(tab.id, { code: code }, () => {
            const err = chrome.runtime.lastError;
            if (err && err.message) {
              if (!err.message.startsWith("Cannot access contents of")) {
                console.error(JSON.stringify(err));
              }
            }
          });
        }
      });
  });
}

function isValid(url) {
  for (let i = 0; i < INVALID_PREFIX.length; i++) {
    if (!url || url.startsWith(INVALID_PREFIX[i])) {
      return false;
    }
  }
  return true;
}

function getUrl(index) {
  if (index >= 1 && index <= 9) {
    return `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/keycap-digit-${EN_NUM[index]}_3${index}-fe0f-20e3.png`;
  }
  return null;
}

function showNumber(index) {
  const url = getUrl(index);
  if (!url) return null;

  return `
    (function() {
      const favicon = document.getElementById("${FAVICON_ID}")
      if (favicon) favicon.remove()

      const link = document.createElement("link");
      link.id = "${FAVICON_ID}";
      link.setAttribute("rel", "shortcut icon");
      link.setAttribute("href", "${url}");
      document.getElementsByTagName("head")[0].appendChild(link);
    }())
  `;
}

function hiddenNumber() {
  return `
  (function() {
    const favicon = document.getElementById("${FAVICON_ID}")
    if (favicon) favicon.remove()
  }())
  `;
}
