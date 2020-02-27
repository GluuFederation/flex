from java.util import Arrays
from java.net import URLEncoder
from org.gluu.jsf2.message import FacesMessages

from org.gluu.oxauth.security import Identity
from org.gluu.oxauth.service import AuthenticationService, UserService, EncryptionService
from org.gluu.jsf2.service import FacesService
from org.gluu.model.custom.script.type.auth import PersonAuthenticationType
from org.gluu.service.cdi.util import CdiUtil

from javax.faces.context import FacesContext
from javax.faces.application import FacesMessage

import uuid
import sys
import java

class PersonAuthentication(PersonAuthenticationType):
    def __init__(self, currentTimeMillis):
        self.currentTimeMillis = currentTimeMillis

    def init(self, configurationAttributes):
        print "Cert. Initialization"
        return True

    def destroy(self, configurationAttributes):
        print "Cert. Destroy"
        return True

    def getApiVersion(self):
        return 1

    def isValidAuthenticationMethod(self, usageType, configurationAttributes):
        return True

    def getAlternativeAuthenticationMethod(self, usageType, configurationAttributes):
        return None

    def authenticate(self, configurationAttributes, requestParameters, step):
        print "Cert. Authenticate for step %d" % step
        authenticationService = CdiUtil.bean(AuthenticationService)
        user = authenticationService.getAuthenticatedUser()
        identity = CdiUtil.bean(Identity)

        if step == 1:
            if user != None:
                return True

            credentials = identity.getCredentials()
            user_name = credentials.getUsername()
            user_password = credentials.getPassword()

            userService = CdiUtil.bean(UserService)
            return authenticationService.authenticate(user_name, user_password)

        elif step == 2 and user != None:
            try:
                cookies = CdiUtil.bean(FacesContext).getExternalContext().getRequest().getCookies()

                cookie = None
                for c in cookies:
                    if c.getName() == "casa-cert-authn":
                        cookie = c
                        break

                if cookie == None:
                    print "Cert. Expected cookie not found"
                else:
                    key = identity.getSessionId().getSessionAttributes().get("rndkey")

                    cookie = CdiUtil.bean(EncryptionService).decrypt(cookie.getValue())
                    tokens = cookie.split(";")

                    if tokens[0] == key:
                        # See enumeration org.gluu.casa.plugins.cert.service.UserCertificateMatch
                        result = tokens[1]

                        print "Cert. Authentication result was %s" % result
                        #Set error messages to show
                        if result == 'SUCCESS':
                            return True

                        self.setMessageError(FacesMessage.SEVERITY_ERROR, result)
                    else:
                        print "Cert. Inconsistent cookie value"
            except:
                print "Cert. Exception: ", sys.exc_info()[1]

        return False


    def prepareForStep(self, configurationAttributes, requestParameters, step):
        print "Cert. Prepare for step %d" % step
        if step == 2:
            authenticationService = CdiUtil.bean(AuthenticationService)
            usrId = authenticationService.getAuthenticatedUser().getAttribute("inum", False, False)

            rndKey = uuid.uuid4().hex
            CdiUtil.bean(Identity).setWorkingParameter("rndkey", rndKey)

            url = CdiUtil.bean(FacesContext).getExternalContext().getRequest().getServerName()
            url = "https://%s/casa/pl/cert-authn/index.zul" % url

            encr = CdiUtil.bean(EncryptionService).encrypt(rndKey + ";" + usrId)
            encr = URLEncoder.encode(encr, "UTF-8")

            url = "%s?key=%s" % (url, encr)
            CdiUtil.bean(FacesService).redirectToExternalURL(url)
        return True

    def getExtraParametersForStep(self, configurationAttributes, step):
        if step == 2:
            return Arrays.asList("rndkey")
        return None

    def getCountAuthenticationSteps(self, configurationAttributes):
        return 2

    def getPageForStep(self, configurationAttributes, step):
        if step == 2:
            return "/casa/cert-prompt.xhtml"
        return ""

    def logout(self, configurationAttributes, requestParameters):
        return True

    def hasEnrollments(self, configurationAttributes, user):

        hasEnrollments = False
        values = user.getAttributeValues("oxExternalUid")

        if values != None:
            for extUid in values:
                if not hasEnrollments:
                    hasEnrollments = extUid.find("cert:") != -1

        return hasEnrollments

    def setMessageError(self, severity, result):

        if result == "CERT_ENROLLED_OTHER_USER":
            msg = "The certificate presented is registered to a different account"
        elif result == "CERT_NOT_RECOGNIZED":
            msg = "The certificate presented has not been enrolled yet in Casa"
        elif result == "UNKNOWN_USER":
            msg = "Inexisting user"
        # elif result = "UNKNOWN_ERROR":

        facesMessages = CdiUtil.bean(FacesMessages)
        facesMessages.setKeepMessages()
        facesMessages.clear()
        facesMessages.add(severity, msg)
