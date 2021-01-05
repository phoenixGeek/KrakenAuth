var AUTH_TOKEN;
var messages = [];
var userId = 0;

$(document).ready(function () {

    dashboard()

    $("#login").on('click', function () {
        $('#dashboard').hide();
        $('#tab1').show();
    });

    $("#dashboardback").on('click', function () {
        $('#dashboard').show();
        $('#tab1').hide();
    });

    $('#login_form').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {

            email: {
                required: "Email can not be empty",
                email: "Please enter valid email"
            },
            password: {
                required: "Password can not be empty"
            }
        },
        submitHandler: function () {
            login();
            return false;
        }
    });

    $("#google_login_btn").on('click', function () {
        $("#google_login_btn").attr('disabled', true).text('Processing...');
        chrome.identity.getAuthToken({
            interactive: true
        }, function (token) {
            AUTH_TOKEN = token;
            chrome.identity.getProfileUserInfo(function (user) {
                loginWithGoogle(user.email);
            });
        })
    });

    $(".logout-link").on('click', function () {
        chrome.storage.local.set({ 'user': '' });
        dashboard();
    });
});

function login() {
    var data = {};
    data.email = $("#email").val();
    data.password = $("#password").val();
    console.log(data);
    $("#login_form button").attr('disabled', true).text('Processing...');
    $.ajax({
        type: 'POST',
        url: _config.apiBaseUrl + '/login',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            $("#login_form button").removeAttr('disabled').text('Login');
            userId = response.user.id;
            chrome.storage.local.set({ 'user': response.user });
            $('.msg').text("You have logged in successfully");
            $("#login_form")[0].reset();
            dashboard();

        }, error: function (jqXHR, textStatus) {
            alert(textStatus);
        },
    });
}

function loginWithGoogle(email) {
    var data = {
        email: email
    };
    $.ajax({
        type: 'POST',
        url: _config.apiBaseUrl + '/googlelogin',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (response) {
            $("#google_login_btn").removeAttr('disabled').text('Login');
            userId = response.user.id;
            chrome.storage.local.set({ 'user': response.user });
            $('.msg').text("You have logged in successfully");
            $("#login_form")[0].reset();
            dashboard();
        }, error: function (jqXHR, textStatus) {
            console.log(textStatus);
            $("#google_login_btn").removeAttr('disabled').text('Login');
        },
    });
}

function dashboard() {
    chrome.storage.local.get(["user"], function (result) {
        if (typeof result.user != typeof undefined && result.user != '') {
            $("#user-name").text(result.user.email);
            userId = result.user.id;
            $('.tabs').hide();
            $('#tab2').show();
            chrome.runtime.sendMessage({ from: 'custom', action: 'getMessages' });
        } else {
            $('.tabs').hide();
            $('#dashboard').show();
            chrome.runtime.sendMessage({ from: 'custom', action: 'getMessages' });
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.from == "background" && request.action == "MessageShow") {
        messages = request.messages;
        console.log(messages);
        html = '';
        if (userId > 0) {
            messages.forEach(function (result, i) {
                labelId = result.message.labelIds.join('<br>');
                html += `<tr>
						<td>`+ result.id + `</td>
						<td>`+ labelId + `</td>
						<td>`+ result.message.snippet + `</td>
						</tr>`;
            });
            $("#tableRow2").html(html);
        } else {
            messages.forEach(function (result, i) {
                labelId = result.message.labelIds.join('<br>');
                html += `<tr>
						<td>`+ result.id + `</td>
						<td>`+ labelId + `</td>
						</tr>`;
            });
            $("#tableRow").html(html);
        }

        $('.bs4-loader').hide();
    }
});