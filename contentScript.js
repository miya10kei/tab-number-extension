// hrefに"data" URL scheme を設定している場合、
// loadを待たないと値が取得できなかったの loadのタイミングで実行する
window.addEventListener("load", () => {
  let isShowing = false;
  const isMac = navigator.userAgent.indexOf("Mac OS X") != -1;

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
    if (isClickedCtrl(event)) sendChangeMsg();
    else sendRevertMsg();
  });
  document.addEventListener("keyup", () => {
    sendRevertMsg();
  });

  window.addEventListener("unload", sendRevertMsg);
  window.addEventListener("blur", sendRevertMsg);

  chrome.runtime.onMessage.addListener(message => {
    if (message.type === "change") {
      changeFavicon(message.index);
    } else {
      revertFavicon();
    }
  });

  // ----------------
  // --- function ---
  // ----------------
  function isClickedCtrl(event) {
    // windows 対応
    return isMac && event.key === "Meta";
  }

  function sendChangeMsg() {
    if (!isShowing) chrome.runtime.sendMessage({ event: "change" });
  }

  function sendRevertMsg() {
    if (isShowing) chrome.runtime.sendMessage({ event: "revert" });
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
    isShowing = true;
  }

  function revertFavicon() {
    links.forEach((link, i) => link.setAttribute("href", originalUrl[i]));
    isShowing = false;
  }
});
