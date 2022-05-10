Browser().runtime.onInstalled.addListener((details) => {
    Browser().storage.local.set({ hostIp: "localhost" });
});

function Browser() {
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
        return chrome;
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        return browser;
    } else {
        return chrome;
    }
}
