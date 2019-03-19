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
function triggerU2fRegistration(req, timeout, u2fv1_1){
    register_request=req;
    register_timeout=timeout;
    //Wait half a second to start registration
    setTimeout(startRegistration, 500, u2fv1_1);
}

//Performs u2f registration: uses the google u2f object to do all registering stuff
function startRegistration(u2fv1_1) {
    if (u2fv1_1) {  //When it takes this branch, it will only work if the domain is protected by a prod SSL cert
        //u2f v1.1 differs from u2f v1.0 in u2f.register and sign signatures
        //see https://fidoalliance.org/specs/fido-u2f-v1.2-ps-20170411/fido-u2f-javascript-api-v1.1-v1.2-ps-20170411.html
        var appId = register_request.registerRequests[0].appId;
        var reqq = { challenge: register_request.registerRequests[0].challenge, version: register_request.registerRequests[0].version};
        u2f.register(appId, [reqq], [],
                function (data) {
                    sendBack(data);
                }, Math.floor(register_timeout/1000)    //expects seconds
        );
    } else {
        u2f.register(register_request.registerRequests, register_request.authenticateRequests,
                function (data) {
                    sendBack(data);
                }, Math.floor(register_timeout/1000)    //expects seconds
        );
    }
}

//Captures the response of the registration start and sends it to backend as is
function sendBack(obj){
    zAu.send(new zk.Event(widget, "onData", obj, {toServer:true}));
}

function prepareAlert() {
    alertRef = $('#feedback-key-edit');
}
