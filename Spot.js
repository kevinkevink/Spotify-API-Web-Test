const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const REDIRECTURI = "https://kevinkevink.github.io/SpotTest/Home";
const client_id = "abb0f2503c27448b9c53f509d4112949";
const client_secret = "742582b3ead642e0b2ccd825fda0fe44";


var access_token = null;
var currentPlaylist = "";


function onPageLoad(){
  if ( window.location.search.length > 0 ){
    handleRedirect();
    $("#lightstitle").append(" <b>TEST1</b>.");
  }else{
    access_token = localStorage.getItem("access_token");
    if ( access_token == null ){
      // we don't have an access token so present token section
      $("#lightstitle").append(" <b>Fail</b>.");
    }else{
      // we have an access token so present device section
      $("#lightstitle").append(" <b>Success</b>.");
      refreshPlaylists();
  }
  }
}

function handleRedirect(){
  $("#lightstitle").append(" <b>TEST2</b>.");
  let code = getCode();
  fetchAccessToken(code);
  window.history.pushState("", "", REDIRECTURI); // remove param from url
}

function refreshPlaylists(){
  callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
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
}
//GETS CODE FROM QUERY STRING
function getCode(){
  $("#lightstitle").append(" <b>TEST3</b>.");
  let code = null;
  const queryString = window.location.search;
  if ( queryString.length > 0 ){
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code')
  }
  return code;
}

function fetchAccessToken( code ){
  $("#lightstitle").append(" <b>TEST4</b>.");
  let body = "grant_type=authorization_code";
  body += "&code=" + code; 
  body += "&redirect_uri=" + encodeURI(REDIRECTURI);
  body += "&client_id=" + client_id;
  body += "&client_secret=" + client_secret;
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
  $("#lightstitle").append(" <b>TEST5</b>.");
  if ( this.status == 200 ){
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

function handlePlaylistsResponse(){
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      data.items.forEach(item => addPlaylist(item));
  }
  else if ( this.status == 401 ){
      //refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function addPlaylist(item){
  //HTML TO ADD PLAYLIST TO PAGE
  //let node = document.createElement("option");
  //node.value = item.id;
  //node.innerHTML = item.name + " (" + item.tracks.total + ")";
  //document.getElementById("playlists").appendChild(node); 
}
//https://github.com/makeratplay/SpotifyWebAPI/blob/main/app.js

//https://developer.spotify.com/documentation/general/guides/authorization-guide/
//https://developer.spotify.com/documentation/web-api/quick-start/
