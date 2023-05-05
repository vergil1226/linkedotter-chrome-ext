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

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;
 
    if (email && pass) {
        // send message to background script with email and password 
        
        chrome.runtime.sendMessage({ message: 'login', 
        payload: { email,    pass }},
        function (response) {
            console.log("response");
            console.log(response);
                if (response === 'success'){
                    //window.location.replace('../views/popup-signout.html');
                    document.getElementById("loader").style.display = "block";
                    document.getElementById("ar-login").style.display = "none";
                    document.getElementById("ar-welcome").style.display = "block";
                    document.getElementById("loader").style.display = "none";
                }else{
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
            //window.location.replace('../views/popup-welcome-back.html');
           // window.location.replace('../views/popup-welcome-back.html');

                document.getElementById("ar-welcome").style.display = "none";
                document.getElementById("ar-login").style.display = "none";
                document.getElementById("loader").style.display = "block";

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
        chrome.storage.local.get(['userStatus', 'user_info','accessToken'],
            function (response) {
                if (chrome.runtime.lastError) resolve({ userStatus: 
                    false, user_info: {} })
            resolve(response.userStatus === undefined ?
                    { userStatus: false, user_info: {} } :
                    { userStatus: response.userStatus, user_info: 
                    response.user_info }
                    )
            });
    });
}




/*********************************************************************/


const buttonn = document.querySelector('#wl-button');

buttonn.addEventListener('mouseover', () => {
//     // button.style.backgroundColor = 'black';
//     // button.style.color = 'white';
//     // button.style.transform = 'scale(1.3)';

//     // document.querySelector('div').style.backgroundColor = '#ee2f64';

     document.getElementById('message').innerText = "Come Back Soon,";
});

buttonn.addEventListener('mouseleave', () => {
//     // button.style.backgroundColor = '#f5c2e0';
//     // button.style.color = 'black';
//     // button.style.transform = 'scale(1)';

//     // document.querySelector('div').style.backgroundColor = '#fcee54';

    document.getElementById('message').innerText = "Welcome Back,";
 });


buttonn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'logout' },
        function (response) {
            if (response === 'success')
               // window.location.replace('./popup-signin.html');
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



const buttonl = document.querySelector('#wl-dash');
buttonl.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'logout' },
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

 document.addEventListener('DOMContentLoaded', function() { 
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
		
		
			chrome.runtime.sendMessage({ message: 'page_loaded', 
				payload: { "tabs_url":'' }},
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
		function(request, sender, sendResponse) {
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
			if(!!cookie && !!cookie){
				document.querySelector("#cookie_value_li_at").value=cookie; 
			}else{
				document.querySelector("#cookie_value_li_at").value=""; 
			}
				
	}



