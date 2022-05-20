function selfFunction(hostIp) {
    if (!hostIp) {
        return;
    }

    const hostUrl = `http://${hostIp}:64356`;

    let socket;

    socket && socket.disconnect();

    socket = io(hostUrl);

    socket.on("connect", () => {
        socket.on("reloadUrls", ({ urls }) => {
            if (!checkUrl(urls)) {
                socket.disconnect();
            } else {
                socket.emit("browserConnected", {
                    browser: browserText(),
                    host: hostUrl.slice(7, -6),
                });
            }
        });
    });

    socket.on("disconnect", () => {});

    socket.on("reload", () => {
        reloadFunction();
    });
}

function checkUrl(urls) {
    const currentUrl = window.location.href;
    const urlList = urls || [];
    const filterArr = urlList.filter((v) => currentUrl.includes(v));
    if (filterArr.length > 0) {
        return true;
    } else {
        return false;
    }
}

function reloadFunction() {
    window.location.reload();
}

function browserText() {
    const Android = /(android)/i.test(navigator.userAgent);
    return `${detectBrowser()}${Android ? " Android" : ""}`;
}

function detectBrowser() {
    if (
        (navigator.userAgent.indexOf("Opera") ||
            navigator.userAgent.indexOf("OPR")) != -1
    ) {
        return "Opera";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
        return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        return "Firefox";
    } else if (
        navigator.userAgent.indexOf("MSIE") != -1 ||
        !!document.documentMode == true
    ) {
        return "IE"; //crap
    } else {
        return "Unknown";
    }
}

chrome.storage.local.get("hostIp", ({ hostIp }) => {
    selfFunction(hostIp);
});

chrome.runtime.onMessage.addListener((data) => {
    if (data.hostIp) {
        selfFunction(data.hostIp);
    }
    return true;
});
