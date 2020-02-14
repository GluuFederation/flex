var register_request = null;
var register_timeout;

//Special widget to send data to server directly
var widget;

//This is called when the ready button is pushed
function initialize(wgt){
    if (!widget)
        widget=wgt;
}

//Triggers the u2f once some time has passed (allowing users to plug the security key to the USB port)
function triggerU2fRegistration(req, timeout){
    register_request=req;
    register_timeout=timeout;
    //Wait half a second to start registration
    setTimeout(startRegistration, 500);
}

//Performs u2f registration
function startRegistration() {
    //The key should start blinking upon this call. In FF this is not always true ... I've faced cases where
    //30 seconds elapse :(
    u2fApi.register(register_request.registerRequests, Math.floor(register_timeout/1000))    //expects seconds
            .then(function (data) {
                sendBack(data);
            })
            .catch(function (err) {
                sendBack({ errorCode: err.metaData.code });
            })
}

//Captures the response of the registration start and sends it to backend as is
function sendBack(obj){
    zAu.send(new zk.Event(widget, "onData", obj, {toServer:true}));
}

function prepareAlert() {
    alertRef = $('#feedback-key-edit');
}
