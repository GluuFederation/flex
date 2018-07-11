//Sends some browser metadata
function sendBrowserData() {

    if (platform) {
        widget =  zk.Widget.$('$message');
        platform['ua'] = null;
        platform['offset'] = -60 * new Date().getTimezoneOffset();
        platform['screenWidth'] = screen.width;
        zAu.send(new zk.Event(widget, "onData", platform, {toServer:true}));
    }

}

//Computes the strength of password entered in the widget passed and sends the score back to server
function updateStrength(widget){
    var strength=zxcvbn(widget.getValue());
    zAu.send(new zk.Event(widget, "onData", strength.score, {toServer:true}));
}
