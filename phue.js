const ACCESS_TOKEN = 

function requestHueAuthorization() {
    let body = {};
    body.linkbutton=true;

    callHueApi("PUT", "https://api.meethue.com/bridge/0/config", body, handleHueAuthorizationResponse());
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