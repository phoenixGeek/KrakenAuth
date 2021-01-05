chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action == "toggle") {
        toggle();
    }
})

var iframe = document.createElement('iframe');
iframe.style.background = "white";
iframe.style.border = "1px solid #E6E9ED";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.frameBorder = "none";
iframe.src = chrome.extension.getURL("popup.html")

document.body.appendChild(iframe);

function toggle() {

    var width = $(document).width();
    var sidebarWidth = 0;
    if (iframe.style.width == "0px") {
        iframe.style.width = "430px";
        sidebarWidth = 430;
    } else {
        iframe.style.width = "0px";
    }
    $("body,html").css('width', (width - sidebarWidth) + 'px');

}
