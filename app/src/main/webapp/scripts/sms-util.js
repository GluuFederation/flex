//This is called when the send button is pushed
function tempDisable(id, timeout, next){
    button = zk.Widget.$("$" + id);
    button.setDisabled(true);
    setTimeout(enable, timeout, button);
    zk.Widget.$("$" + next).focus(0);
}

function enable(button){
    button.setDisabled(false);
}
