var messages = '';

chrome.browserAction.onClicked.addListener(function () {

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

		if (tabs[0].url.indexOf('krakensoftware.net') >= 0) {
			tabId = tabs[0].id;
			chrome.tabs.sendMessage(tabId, {
				from: "background",
				action: 'toggle'
			});
			init();

			// setInterval(function () {

			// 	console.log("interval checking")
			// 	init();
			// }, 10000)

			function init() {
				chrome.identity.getAuthToken({
					interactive: true
				}, function (token) {
					if (chrome.runtime.lastError) {
						alert(chrome.runtime.lastError.message);
						return;
					}
					var x = new XMLHttpRequest();
					x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
					x.onload = function () {
						var response = JSON.parse(x.response);
						var email = response.email;
						var first_name = response.given_name;
						var last_name = response.family_name;
						var username = response.name

						$.ajax({
							type: 'POST',
							url: 'https://krakensoftware.net/api/index.php',
							data: {
								email: email,
								first_name: first_name,
								last_name: last_name,
								username: username
							},
							success: function (response) {
								response = JSON.parse(response);
								console.log("response: ", response)

								switch (response.subscription) {
									case true:
										if (response.content.product_id === '6605') {
											messages = "Premier Membership's Content...";
										} else if (response.content.product_id === '6606') {
											messages = "Agency Membership's Content...";
										} else if (response.content.product_id === '6647') {
											messages = "Primary Membership's Content...";
										}
										chrome.runtime.sendMessage({
											from: 'background',
											username: username,
											product_id: response.content.product_id,
											product_name: response.content.order_item_name,
											messages: messages
										});
										break;
									case false:
										messages = "No Membership's Content...";
										chrome.runtime.sendMessage({
											from: 'background',
											username: username,
											product_id: '',
											product_name: '',
											messages: messages
										});
										break;
									default:
										break;
								}

							}, error: function (e) {
								console.log(e);
							}
						});
					};
					x.send();
				});
			}

		}
	})
});
