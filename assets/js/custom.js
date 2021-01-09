var messages = '';

$(document).ready(function () {

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.from == "background" && request.product_id) {
            messages = request.messages;
            var html = '';
            if (request.product_id === '6605') {
                html = `<h5> Hi ${request.username}! </h5>
                    <br />
                    <h6> You are using ${request.product_name} </h6>
                    <br />
                    <label>Content</label>
                    <p> ${messages} </p>`
            } else {
                html = `<h5> Hi ${request.username}! </h5>
                    <br />
                    <h6> You are using ${request.product_name} </h6>
                    <br />
                    <label>Content</label>
                    <p> ${messages} </p>
                    <br />
                    <div id="newtab">
                        <button class="btn btn-primary">Upgrade your Membership to use features</button>
                    </div>`
            }
            $("#content").html(html);
            $('#newtab').on('click', function () {
                var newURL = "https://krakensoftware.net/";
                chrome.tabs.create({ url: newURL });
            });

        } else if (request.from == "background" && !request.product_id) {
            messages = request.messages;
            var html = `<h5> Hi ${request.username}! </h5>
                    <br />
                    <label>Content</label>
                    <p> ${messages} </p>
                    <br />
                    <div id="newtab">
                        <button class="btn btn-primary">Upgrade your Membership to use features</button>
                    </div>`
            $("#content").html(html);
            $('#newtab').on('click', function () {
                var newURL = "https://krakensoftware.net/";
                chrome.tabs.create({ url: newURL });
            });
        }
    });

});
