chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msgType === 'tabId') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.pageCapture.saveAsMHTML({ tabId: tabs[0].id }, async (blob) => {
                const content = await blob.text();
                console.log(content);
                const url = "data:application/x-mimearchive;base64," + btoa(content);
                chrome.downloads.download({
                    url,
                    filename: 'filename.mhtml'
                });
            });

            sendResponse({tabId: tabs[0].id});
        });
    }
    return true;
});