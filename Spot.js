const AUTHORIZE = "https://accounts.spotify.com/authorize";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const TOKEN = "https://accounts.spotify.com/api/token";
const REDIRECTURI = "https://kevinkevink.github.io/SpotTest/Home";
const PLAYER = "https://api.spotify.com/v1/me/player";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const ECHO_ID = "21f5e777fb80b905f0c70caf97896723427f33be";


var client_id = "abb0f2503c27448b9c53f509d4112949";
var client_secret = "742582b3ead642e0b2ccd825fda0fe44";


var access_token = null;
var currentPlaylist = "";
var playlistNum = 0;


function onPageLoad(){
  if ( window.location.search.length > 0 ){
    handleRedirect();
  }else{
    access_token = localStorage.getItem("access_token");
    if ( access_token == null ){
      // we don't have an access token so present token section
      //MSUT REMOTVE MEOTU MUST REMOVE MUST REMOVE MUST REMOVE MUST REMOVE MUST REMOVE
      handlePlaylistsResponse();
    }else{
      // we have an access token so present device section
      refreshPlaylists();
    }
    transferToSpeaker();
  }
}

function handleRedirect(){
  let code = getCode();
  fetchAccessToken(code);
  window.history.pushState("", "", REDIRECTURI); // remove param from url
}

function refreshPlaylists(){
  callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function requestAuthorization(){
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
  let code = null;
  const queryString = window.location.search;
  if ( queryString.length > 0 ){
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code')
  }
  return code;
}

function fetchAccessToken( code ){
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
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      if ( data.access_token != undefined ){
          access_token = data.access_token;
          localStorage.setItem("access_token", access_token);
          console.log("Success!")
      }
      onPageLoad();
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function callApi(method, url, body, callback){
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.send(body);
  xhr.onload = callback;
}

function handlePlaylistsResponse(){
  
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      playlistNum = data.limit;
      console.log(playlistNum);
      console.log(data);
      console.log(data.items[0].images[0].url);
      $("#scrollableDiv").css("height:", (playlistNum * 80).toString() + "px");
      $("#scrollableDiv").css("grid-template-rows:", "repeat(" + playlistNum - 1 + ", 1fr)");
      for (let i = 0; i < playlistNum; i++) { 
        $("#scrollableDiv").append("<div id='albumFrame" + i + "' class='albumFrame'><\div>");
        //title
        //JSON.items.0.images.0.url

        $("#albumFrame" + i).append("<div id='titleBox" + i + "' class='titleBox' ><\div>");
        $("#titleBox" + i).empty();
        $("#titleBox" + i).append("<h id='albumWords" + i + "' class='albumWords' > " + data.items[i].name + "<\h>");
        resizeText("titleBox" + i,"albumWords" + i);
        //album picture
        $("#albumFrame" + i).append("<div id='albumBox" + i + "' class='albumBox' ><\div>");
        $("#albumBox" + i).append("<img class='playImage' src='" + data.items[i].images[0].url + "'></img>");
        //play button
        $("#albumFrame" + i).append("<div id='playBox" + i + "' class='playBox' ><\div>");
        $("#playBox" + i).append("<img id='playButton" + i + "' class='playImage' src='playbutton.png'></img>");
        $("#playButton" + i).click(buttonAction(data.items[i].id));
      }
  }
  else if ( this.status == 401 ){
      //refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function resizeText(largerFrame, text){
  var llength = $("#" + largerFrame).width();
  var slength = $("#" + text).width();
  console.log(llength);
  console.log(slength);
  var fontSize = 5;
  $("#" + text).css("font-size", fontSize + "vw");
  while(llength < slength){
    fontSize = fontSize - 0.2;
    $("#" + text).css("font-size", fontSize + "vw");
    llength = $("#" + largerFrame).width();
    slength = $("#" + text).width();
  }
}

function transferToSpeaker(){
//print device info
    //https://developer.spotify.com/console/get-user-player/
    callApi( "GET", DEVICES, null, handleDevicesResponse);
  //transfer playback to speaker
    //https://developer.spotify.com/console/put-user-player/

    let body = {};
    body.device_ids = [];
    body.device_ids.push(ECHO_ID);
    callApi( "PUT", PLAYER, JSON.stringify(body), handleApiResponse );
}

function handleDevicesResponse(){
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
  }
  else if ( this.status == 401 ){
     // refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function buttonAction(pid){
  
  //play playlist
  let body = {};
  body.context_uri = "spotify:playlist:" + pid;
  body.offset = {};
  body.offset.position = 0;
  body.offset.position_ms = 0;
  callApi( "PUT", PLAY + "?device_id=" + ECHO_ID, JSON.stringify(body), handleApiResponse );
}

function handleApiResponse(){
  if ( this.status == 200){
      console.log(this.responseText);
  }
  else if ( this.status == 401 ){
      //refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }    
}
//function addPlaylist(item){
//add one div under scrollableDiv
//set its height to 80px, width 100%, display grid with 3 columns 10 80 10
//3 divs inside, one in each column


  //HTML TO ADD PLAYLIST TO PAGE
  //let node = document.createElement("option");
  //node.value = item.id;
  //node.innerHTML = item.name + " (" + item.tracks.total + ")";
  //document.getElementById("playlists").appendChild(node); 
//}
//https://github.com/makeratplay/SpotifyWebAPI/blob/main/app.js

//https://developer.spotify.com/documentation/general/guides/authorization-guide/
//https://developer.spotify.com/documentation/web-api/quick-start/
