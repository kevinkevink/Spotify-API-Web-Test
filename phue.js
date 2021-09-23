const AUTHORIZE = "https://api.meethue.com/v2/oauth2/token";
const DEVICE_ID = "";
const ADD_NAME = "remotecontrol";
const DEVICE_ID = "";

var access_token = "";
var client_id = "nP0PEnKQ7AqmznIy24o6HfbUK1zn0CGu";
var client_secret = "iACzvnGJ2BhaAACU";

function requestHueAuthorization() {
    let body = {};
    body.linkbutton=true;

}

function HueAuthorization(){
  let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(REDIRECTURI);
    url += "&deviceid=" + DEVICE_ID;
    url += "&devicename=" + APP_NAME;
    window.location.href = url;
}

function callHueApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
  }

function handleHueAuthorizationResponse(){

}