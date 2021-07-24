const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const REDIRECTURI = "https://kevinkevink.github.io/SpotTest/Home"

function onPageLoad(){
  access_token = localStorage.getItem("access_token");
  if ( access_token == null ){
  // we don't have an access token so present token section
    document.getElementsByClassName("BLI").style.display = 'block'; 
    document.getElementsByClassName("ALI").style.display = 'none'; 
  }
  else {
  // we have an access token so present device section
    document.getElementsByClassName("BLI").style.display = 'none'; 
    document.getElementsByClassName("ALI").style.display = 'block'; 
  }
}



function requestAuthorization(){
  client_id = "abb0f2503c27448b9c53f509d4112949";
  client_secret = "742582b3ead642e0b2ccd825fda0fe44";

  let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(REDIRECTURI);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
    console.log("YUH");
}
//GETS CODE FROM QUERY STRING
function getCode(){
  let code = null;
  const queryString = window.location.search;
  if ( queryString.length > 0 ){
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code')
  }
  return code;
}

//Refreshes token
function refreshAccessToken(){
  refresh_token = localStorage.getItem("refresh_token");
  let body = "grant_type=refresh_token";
  body += "&refresh_token=" + refresh_token;
  body += "&client_id=" + client_id;
  callAuthorizationApi(body);
}

//sends in tokens so u can make calls
function callAuthorizationApi(body){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", TOKEN, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}
//reads token response
function handleAuthorizationResponse(){
  console.log("YUH");
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
      var data = JSON.parse(this.responseText);
      if ( data.access_token != undefined ){
          access_token = data.access_token;
          console.log("Success!")
      }
      if ( data.refresh_token  != undefined ){
          refresh_token = data.refresh_token;
          localStorage.setItem("refresh_token", refresh_token);
      }
      onPageLoad();
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}


//https://github.com/makeratplay/SpotifyWebAPI/blob/main/app.js

//https://developer.spotify.com/documentation/general/guides/authorization-guide/
//https://developer.spotify.com/documentation/web-api/quick-start/
