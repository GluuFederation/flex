//Initializes the flag+phone mockery
var phComponent = $("#phone");
var widgetId = "phWidget";

phComponent.intlTelInput({
    separateDialCode: true,
    preferredCountries: [ "us" ]
});

phComponent.on("countrychange", function(e, countryData) { updatePhoneValue() });

function updatePhoneValue() {
    var widget = zk.$("$" + widgetId);
    widget.setValue($(".selected-dial-code").text() + phComponent.val());
    widget.fireOnChange({});
}

function resetPhoneValue() {
    phComponent.val("");
    updatePhoneValue();
}

//This is called when the send button is pushed
function tempDisable(id, timeout, next){
    button = zk.$("$" + id);
    button.setDisabled(true);
    setTimeout(function(w) { w.setDisabled(false) }, timeout, button);

    if (next) {
        var next = $("#" + next);
        if (next) {
            setTimeout(function(e) {
                try {
                    e.focus();
                } catch (ex) {
                }
            }, 100, next);
        }
    }

}

function prepareAlert() {
    alertRef = $('#feedback-phone-edit');
}
