const button = document.querySelector('button');

button.addEventListener('mouseleave', () => {
    document.querySelector('#email').classList.remove('white_placeholder');
    document.querySelector('#password').classList.remove('white_placeholder');
    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });
});

document.querySelector('#loginform').addEventListener('submit', event => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;
    if (email && pass) {
        // send message to background script with email and password 
        chrome.runtime.sendMessage({message: 'login',
            payload: {email, pass}},
                function (response) {
                    console.log("response");
                    console.log(response);
                    if (response === 'success') {
                        //window.location.replace('../views/popup-signout.html');
                        document.getElementById("loader").style.display = "block";
                        document.getElementById("ar-login").style.display = "none";
                        document.getElementById("signup-form").style.display = "none";
                        document.getElementById("ar-logout").style.display = "block";
                        document.getElementById("loader").style.display = "none";
                    } else {
                        alert(response)
                    }
                }
        );

    } else {
        document.querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#email').style.backgroundColor = 'red';
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    }
});

is_user_signed_in()
        .then(res => {
            if (res.userStatus) {
                document.getElementById("ar-welcome").style.display = "none";
                document.getElementById("ar-login").style.display = "none";
                document.getElementById("loader").style.display = "block";
                document.getElementById("signup-form").style.display = "none";
                setTimeout(showPage, 100);
                function showPage() {
                    document.getElementById("ar-logout").style.display = "block";
                    document.getElementById("loader").style.display = "none";
                }
            }
        })
        .catch(err => console.log(err));

function is_user_signed_in() {
    return new Promise(resolve => {
        chrome.storage.local.get(['userStatus', 'user_info', 'accessToken'],
                function (response) {
                    if (chrome.runtime.lastError)
                        resolve({userStatus:
                                    false, user_info: {}})
                    resolve(response.userStatus === undefined ?
                            {userStatus: false, user_info: {}} :
                            {userStatus: response.userStatus, user_info:
                                        response.user_info}
                    )
                });
    });
}

/*********************************************************************/


const buttonn = document.querySelector('#wl-button');
buttonn.addEventListener('click', () => {
    chrome.runtime.sendMessage({message: 'logout'},
            function (response) {
                if (response === 'success')
                    // window.location.replace('./popup-signin.html');
                    document.getElementById("ar-welcome").style.display = "none";
                document.getElementById("ar-logout").style.display = "none";
                document.getElementById("loader").style.display = "block";
                setTimeout(showPage, 100);
                function showPage() {
                    document.getElementById("ar-login").style.display = "block";
                    document.getElementById("signup-form").style.display = "none";
                    document.getElementById("loader").style.display = "none";
                }
            }
    );
});

const buttonWlDash = document.querySelector('#wl-dash');
buttonWlDash.addEventListener('click', () => {
    chrome.runtime.sendMessage({message: 'logout'},
            function (response) {
                if (response === 'success')
                    //window.location.replace('./popup-signin.html');
                    document.getElementById("ar-welcome").style.display = "none";
                document.getElementById("ar-logout").style.display = "none";
                document.getElementById("loader").style.display = "block";
                setTimeout(showPage, 100);
                function showPage() {
                    document.getElementById("ar-login").style.display = "block";
                    document.getElementById("loader").style.display = "none";
                }

            }
    );
});

/* 
 This listener execute when dom content loaded. Here we are executing our custom function "onload" 
 */
document.addEventListener('DOMContentLoaded', function () {
    /*
     chrome.tabs.query({
     'active': true,
     'lastFocusedWindow': true
     }, function(tabs) { 
     chrome.cookies.get({
     name: cookie_name_to_use,
     url: tabs[0].url
     }, function(cookie) {
     setCookieValueOnField(cookie);
     });  
     
     });
     */
    chrome.runtime.sendMessage({message: 'page_loaded',
        payload: {"tabs_url": ''}},
            function (response) {
                setCookieValueOnField(response);
            }
    );
});

/* 
 This listener execute when any cookie values changes or removed etc, 
 but we are checking if our cookie is value changed or not.
 Based on that, we are updating our field 
 */
chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.msg === "cookieValueChanged") {
                setCookieValueOnField(request.data.value);
            }
        }
);

/*
 Here we are fetching/getting cookie value from browser and calling custom function. 
 custome function which further setting cookie value to our custom field on popup
 */
/*  
 We are setting cookie value to our field which we are showing on Popup Panel
 */
function setCookieValueOnField(cookie) {
    if (!!cookie && !!cookie) {
        document.querySelector("#cookie_value_li_at").value = cookie;
    } else {
        document.querySelector("#cookie_value_li_at").value = "";
    }
}

/*****************Sign Up / login Hide Show ****************/

const buttonlog = document.querySelector('#login-signup');
const buttonsign = document.querySelector('#back-to-login');
const passkeyup = document.querySelector('#user_con_pass');


buttonlog.addEventListener('click', () => {
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("ar-login").style.display = "none";
});



buttonsign.addEventListener('click', () => {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("ar-login").style.display = "block";
    event.preventDefault();
});

document.querySelector('#signupform').addEventListener('submit', event => {
    event.preventDefault();
    const user_name = document.querySelector('#user_name').value;
    const user_email = document.querySelector('#user_email').value;
    const user_pass = document.querySelector('#user_pass').value;
    const team_name = document.querySelector('#team_name').value;
    const team_number = document.querySelector('#team_number').value;

    if (user_name && user_email && user_pass && team_name && team_number) {

        // send message to background script with email and password 
        document.getElementById("loader").style.display = "block";
        chrome.runtime.sendMessage({message: 'signup',
            payload: {user_name, user_email, user_pass, team_name, team_number}},
                function (response) {

                    if (response === 'success') {
                        document.getElementById("loader").style.display = "none";
                        //window.location.replace('../views/popup-signout.html');
                        document.getElementById("loader").style.display = "block";
                        document.getElementById("ar-login").style.display = "none";
                        document.getElementById("signup-form").style.display = "none";
                        document.getElementById("ar-logout").style.display = "block";
                        document.getElementById("loader").style.display = "none";
                    } else {
                        document.getElementById("loader").style.display = "none";
                        alert(response)
                    }
                }
        );

    } else {
        document.getElementById("loader").style.display = "none";
        document.querySelector('#user_email').placeholder = "Enter an email.";
        document.querySelector('#user_pass').placeholder = "Enter a password.";
        document.querySelector('#user_name').placeholder = "Enter a Username.";

        document.querySelector('#user_email').style.backgroundColor = 'red';
        document.querySelector('#user_pass').style.backgroundColor = 'red';
        document.querySelector('#user_name').style.backgroundColor = 'red';

        document.querySelector('#user_email').classList.add('white_placeholder');
        document.querySelector('#user_pass').classList.add('white_placeholder');
        document.querySelector('#user_name').classList.add('white_placeholder');
    }
});


passkeyup.addEventListener('keyup', () => {
    var pass = document.getElementById('user_pass').value;
    var confirm_pass = document.getElementById('user_con_pass').value;
    if (pass != confirm_pass) {
        document.getElementById('wrong_pass_alert').style.color = 'red';
        document.getElementById('wrong_pass_alert').innerHTML = '☒ Use same password';
        //document.getElementById('create').disabled = true;
        //document.getElementById('create').style.opacity = (0.4);
    } else {
        document.getElementById('wrong_pass_alert').style.color = 'green';
        document.getElementById('wrong_pass_alert').innerHTML = '🗹 Password Matched';
        // document.getElementById('create').disabled = false;
        // document.getElementById('create').style.opacity = (1);
    }
});

/********* Clip board Js Code**********/

const buttonclipboard = document.querySelector('#clipboard');

buttonclipboard.addEventListener('click',() => {
    copyCookie()
});

const buttonCopyClipboard = document.querySelector('#copyClipboard');

buttonCopyClipboard.addEventListener('click',() => {
    copyCookie();
}); 
 

function copyCookie(){
    var copyText = document.getElementById("cookie_value_li_at");
    copyText.select();
    copyText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(copyText.value); 
    
    document.getElementById('messageData').innerHTML = 'Cookie Value Successfully Copied';
    document.getElementById("messageData").style.display = "block"; 
    
    //alternative to use settimeout as timeout is not recommneded to use
    if(document.getElementById("messageData").classList.contains("hideMeAfterSeconds")){
       document.getElementById("messageData").classList.remove("hideMeAfterSeconds");
        document.getElementById("messageData").classList.add("hideMeAfterSecondsAlt");
    }else{
        document.getElementById("messageData").classList.remove("hideMeAfterSecondsAlt");
        document.getElementById("messageData").classList.add("hideMeAfterSeconds");
    }

    
} 