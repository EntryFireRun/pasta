chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (
        changeInfo.url?.startsWith(
            "https://playentry.org/community/entrystory/list"
        )
    )
        chrome.tabs.sendMessage(tabId, "loadEntrystory").catch(() => {});
});
