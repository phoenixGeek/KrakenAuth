var TOKEN;
var threads = [];
var messages = [];
var activeIndex = 0;
// var processFlag = false;

chrome.browserAction.onClicked.addListener(function () {

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

		if (tabs[0].url.indexOf('krakensoftware.net') >= 0) {
			tabId = tabs[0].id;
			chrome.tabs.sendMessage(tabId, {
				from: "background",
				action: 'toggle'
			});

			// if (!processFlag) {

			chrome.identity.getAuthToken({
				interactive: true
			}, function (token) {
				if (token) {
					console.log("here token: ", token)
					TOKEN = token;
				}
			});

			chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
				if (request.from == "custom" && request.action == "getMessages") {
					showMessages(TOKEN);
				}
			});

			// }

			// processFlag = true;

		}
	})
});

function showMessages(token, userId = "me") {
	var url = "https://www.googleapis.com/gmail/v1/users/" + userId + "/messages?maxResults=5";
	fetch(url, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	}).then((res) => {
		return res.json();
	}).then(function (obj) {
		console.log("result");
		console.log(obj);
		threads = obj.messages;
		getMessageData(token);
		chrome.runtime.sendMessage({
			from: "background",
			data: obj,
			action: 'list'
		});
	});
}

function getMessageData(token, userId = "me") {
	console.log(threads);
	var url = "https://www.googleapis.com/gmail/v1/users/" + userId + "/messages/" + threads[activeIndex].id + "?format=metadata";
	fetch(url, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	}).then((res) => {
		return res.json();
	}).then(function (obj) {
		console.log("here comes obj of messages...", obj);
		if (activeIndex == (threads.length - 1)) {
			messages.push({ id: threads[activeIndex].id, message: obj })
			activeIndex = 0;
			console.log("END ");
			chrome.runtime.sendMessage({ from: 'background', action: 'MessageShow', 'messages': messages });
		} else {
			messages.push({ id: threads[activeIndex].id, message: obj })
			activeIndex = activeIndex + 1;
			getMessageData(token);
		}
	});
}

