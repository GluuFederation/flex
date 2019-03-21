package org.gluu.casa.plugins.authnmethod.rs.status;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;

import java.util.List;

import static javax.ws.rs.core.Response.Status.*;
import static org.gluu.casa.plugins.authnmethod.rs.status.SecondFactorUserData.StatusCode.*;

/**
 * @author jgomer
 */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SecondFactorUserData {

    public enum StatusCode {
        NO_USER_ID,
        UNKNOWN_USER_ID,
        SUCCESS,
        FAILED;
    }

    private StatusCode status;

    //Allows this field being ignored if null (ie not set)
    @JsonProperty("turned_on")
    private Boolean turnedOn;

    @JsonProperty("enrolled_methods")
    private List<String> enrolledMethods;

    public StatusCode getStatus() {
        return status;
    }

    public Boolean getTurnedOn() {
        return turnedOn;
    }

    public List<String> getEnrolledMethods() {
        return enrolledMethods;
    }

    public void setStatus(StatusCode status) {
        this.status = status;
    }

    public void setTurnedOn(boolean turnedOn) {
        this.turnedOn = turnedOn;
    }

    public void setEnrolledMethods(List<String> enrolledMethods) {
        this.enrolledMethods = enrolledMethods;
    }

    //Prevents a loop in serialization process
    @JsonIgnore
    public Response getResponse() {

        Response.Status httpStatus;

        if (status.equals(SUCCESS)) {
            httpStatus = OK;
        }
        else if (status.equals(UNKNOWN_USER_ID)) {
            httpStatus = NOT_FOUND;
        } else {
            httpStatus = status.equals(FAILED) ? INTERNAL_SERVER_ERROR : BAD_REQUEST;
        }
        return Response.status(httpStatus).entity(Utils.jsonFromObject(this)).build();

    }

}
