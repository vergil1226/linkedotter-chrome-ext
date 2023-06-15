var cookie_name_to_use='li_at';//declare which cookie name you want to use
var serverEndPointUrl="https://linkedin-user-auth-chrome-ext.herokuapp.com";
if (!chrome.cookies) {
	chrome.cookies = chrome.experimental.cookies;
}  
 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        
        flip_user_status(true, request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    } else if (request.message === 'logout') {
        flip_user_status(false, null)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    }else if (request.message === 'signup') {
        user_signup_api(request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    }else if (request.message === 'page_loaded') { 
		getCookies("https://www.linkedin.com",cookie_name_to_use, function (value) { 
			sendResponse(value) 
		});
		
        return true;
    }else if (request.message === 'userStatus') {
    is_user_signed_in()
        .then(res => {
            sendResponse({ 
                message: 'success', 
                userStatus: res.user_info.email 
            });
        })
        .catch(err => console.log(err));
        return true;
    }


});

 
 //on start up
	chrome.runtime.onStartup.addListener(function () {
	  onCookieChange();
	});
	
	// on tabs updated
	chrome.tabs.onUpdated.addListener(function (id, changeInfo, tab) {
	  
	  if (tab.url && changeInfo.status === "complete") {
		getCookies("https://www.linkedin.com",cookie_name_to_use, function (value) {
			console.log("on tab cookie value  ");
			console.log(value);
		});
	  }
	});


	/* 
		This listener execute when any cookie values changes or removed etc, 
		but we are checking if our cookie is value changed or not. 
	 */
	function onCookieChange() {
	  chrome.cookies.onChanged.addListener(function (changeInfo) {
		if (changeInfo.cookie.name == cookie_name_to_use) {
			
		  let cookieValue='';
		  if (!changeInfo.removed) { 
			  cookieValue=changeInfo.cookie.value; 
		  } else { 
			  cookieValue=""; 
		  }
		  sendCookiToPopup(cookieValue)
			

		}
	  });
	}

	//Send cookie value to Popup so that we can show to field
	function sendCookiToPopup(cookieValue){
		chrome.runtime.sendMessage({
				msg: "cookieValueChanged", 
				data: { 
					value: cookieValue
				}
			});
	}



 function getCookies(domain, name, callback) {
  chrome.cookies.get({ url: domain, name: name }, function (cookie) {
    if (callback) {
      if (cookie !== null) {
        callback(cookie.value);
      } else {
        callback(null);
      }
    }
  });
} 

 
chrome.runtime.onInstalled.addListener(() => { 
	onCookieChange(); 
  // create alarm after extension is installed / upgraded
  chrome.alarms.create("startRequest", { periodInMinutes: 10 });
  startRequest();
});

 
chrome.alarms.onAlarm.addListener((alarm) => {
  startRequest();
});

async function startRequest() { 

            chrome.storage.local.get(['userStatus', 'user_info','accessToken'], function (response) {
               
                if (chrome.runtime.lastError) return;
                if (response.accessToken === undefined || response.accessToken === null || response.accessToken === "") return;
                
                getCookies("https://www.linkedin.com",cookie_name_to_use, function (value) { 
                    var raw = JSON.stringify({
                       "cookie_value": value 
                     }); 


                    fetch(serverEndPointUrl+'/api/set/cookie', {
                        method: 'POST',
                        headers: {
                            'x-access-token': response.accessToken,
                            "Content-Type": "application/json"
                        },
                        body: raw
                    })
                        .then(res => { 
//                            if (res.status !== 200){
//                                resolve('fail');
//                            }else{  
//                                chrome.storage.local.set({ userStatus: signIn, accessToken:null, user_info: {} }, function (response) {
//                                    user_signed_in = signIn;
//                                    resolve('success');
//                                });
//                            }
                        })
                        .catch(err => console.log(err));
                    });
                });
 


 
}


function user_signup_api( user_info) {
    
       
        var raw = JSON.stringify({
            "username": user_info.user_name,
            "email": user_info.user_email,
            "password": user_info.user_pass
          });
          
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json"); 
        
          return fetch(serverEndPointUrl+'/api/auth/signup', {
            method: 'POST',
            headers: myHeaders,
             body: raw
        }).then((response) => { 
            return response.json().then(async (data) => { 
                if(!!data.message && (data.token===undefined || data.token===null)){
                    return data.message;
                }else{
                    chrome.storage.local.set({ userStatus: true,accessToken: data.token,user_info }, function (response) {
                        user_signed_in = true; 
                    }); 
                    await startRequest();

                    fetch('https://linkedin-messages-be.herokuapp.com/launchPhantomAgent', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: raw
                    })
                    return 'success';
                } 
            }).catch((err) => {
                console.log(err);
            }) 
        });  
}

function flip_user_status(signIn, user_info) {
    if (signIn) {
       
        var raw = JSON.stringify({
            "username": user_info.email,
            "password": user_info.pass
          });
          
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json"); 
        
          return fetch(serverEndPointUrl+'/api/auth/signin', {
            method: 'POST',
            headers: myHeaders,
             body: raw
        }).then((response) => { 
            return response.json().then((data) => { 
                if(!!data.message){
                    return data.message;
                }else{
                    chrome.storage.local.set({ userStatus: signIn,accessToken: data.accessToken,user_info }, function (response) {
                        user_signed_in = signIn; 
                    }); 
                    startRequest();
                    return 'success';
                } 
            }).catch((err) => {
                console.log(err);
            }) 
        });  
                  
         
    } else if (!signIn) {
            
      
        return new Promise(resolve => {
            chrome.storage.local.get(['userStatus', 'user_info','accessToken'], function (response) {
               
                if (chrome.runtime.lastError) resolve('fail'); 
                if (response.userStatus === undefined) resolve('fail');
    
                fetch(serverEndPointUrl+'/api/auth/signout', {
                    method: 'POST',
                    headers: {
                        'x-access-token': response.accessToken
                    }
                })
                    .then(res => { 
                        if (res.status !== 200){
                            resolve('fail');
                        }else{  
                            chrome.storage.local.set({ userStatus: signIn, accessToken:null, user_info: {} }, function (response) {
                                user_signed_in = signIn;
                                resolve('success');
                            });
                        }
                    })
                    .catch(err => console.log(err));
            });
        });
    } 

}
 