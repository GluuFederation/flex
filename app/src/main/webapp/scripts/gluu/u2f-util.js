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
function triggerU2fRegistration(req, timeout, wait_start){
    register_request=req;
    register_timeout=timeout;
    //Wait ~1 second to start registration
    setTimeout(startRegistration, wait_start);
}

//Performs u2f registration: uses the google u2f object to do all registering stuff
function startRegistration() {
    u2f.register(register_request.registerRequests, register_request.authenticateRequests,
            function (data) {
                sendBack(data);
            }, Math.floor(register_timeout/1000)    //expects seconds
    );
}

//Captures the response of the registration start and sends it to backend as is
function sendBack(obj){
    zAu.send(new zk.Event(widget, "onData", obj, {toServer:true}));
}