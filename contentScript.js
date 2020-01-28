// TODO  Extension context invalidated.の解決

// hrefに"data" URL scheme を設定している場合、
// loadを待たないと値が取得できなかったの loadのタイミングで実行する
window.addEventListener("load", () => {
  const links = [...document.querySelectorAll("link[rel~='icon']")];

  // faviconが未設定の場合は、デフォルトファビコンを設定する
  if (!links.length) {
    // TODO default faviconの存在確認
    const link = createLink("/favicon.ico");
    document.getElementsByTagName("head")[0].append(link);
    links.push(link);
  }
  const originalUrl = links.map(link => link.getAttribute("href"));

  // ---------------------------
  // --- event listenrの設定 ---
  // ---------------------------
  document.addEventListener("keydown", event => {
    if (event.key === "Meta") {
      // TODO keyの設定
      sendChangeMsg();
    }
  });
  document.addEventListener("keyup", event => {
    if (event.key === "Meta") {
      // TODO keyの設定
      sendRevertMsg();
    }
  });

  window.addEventListener("unload", sendChangeMsg);
  window.addEventListener("blur", sendRevertMsg);

  chrome.runtime.onMessage.addListener(message => {
    if (message.type === "changeFavicon") {
      changeFavicon(message.index);
    } else {
      revertFavicon();
    }
  });

  // ----------------
  // --- function ---
  // ----------------
  function sendChangeMsg() {
    chrome.runtime.sendMessage({ event: "change" });
  }

  function sendRevertMsg() {
    chrome.runtime.sendMessage({ event: "revert" });
  }

  function createLink(url) {
    const link = document.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute("href", url);
    return link;
  }

  function changeFavicon(index) {
    // extentionのfaviconを取得
    const url = chrome.runtime.getURL(`images/favicon-${index}.ico`);
    links.forEach(link => link.setAttribute("href", url));
  }

  function revertFavicon() {
    links.forEach((link, i) => link.setAttribute("href", originalUrl[i]));
  }
});
