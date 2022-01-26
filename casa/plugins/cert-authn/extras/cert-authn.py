from org.gluu.jsf2.message import FacesMessages
from org.gluu.oxauth.security import Identity
from org.gluu.oxauth.service import AuthenticationService, UserService
from org.gluu.oxauth.service.common import EncryptionService
from org.gluu.jsf2.service import FacesService
from org.gluu.model.custom.script.type.auth import PersonAuthenticationType
from org.gluu.service.cdi.util import CdiUtil

from java.net import URLEncoder
from java.util import Arrays

from javax.faces.context import FacesContext
from javax.faces.application import FacesMessage

import uuid
import sys
import java

try:
    import json
except ImportError:
    import simplejson as json

class PersonAuthentication(PersonAuthenticationType):
    def __init__(self, currentTimeMillis):
        self.currentTimeMillis = currentTimeMillis

    def init(self, customScript, configurationAttributes):
        print "Cert. Initialization"
        return True

    def destroy(self, configurationAttributes):
        print "Cert. Destroy"
        return True

    def getApiVersion(self):
        return 11

    def getAuthenticationMethodClaims(self, requestParameters):
        return None
        
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
                    cookie = json.loads(cookie)

                    if cookie["key"] != key:
                        print "Cert. Inconsistent cookie value"
                    else:
                        result = cookie["status"]

                        if result == 3:
                            # See enumeration org.gluu.casa.plugins.cert.service.UserCertificateMatch
                            result = cookie["match"]
                        elif result == 2:
                            result = "NOT_VALID"
                        elif result == 1:
                            result = "UNPARSABLE"
                        elif result == 0:
                            result = "NOT_SELECTED"

                        print "Cert. Authentication result was %s" % result
                        #Set error messages to show
                        if result == 'SUCCESS':
                            return True

                        self.setMessageError(FacesMessage.SEVERITY_ERROR, result)
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
            return "/casa/cert.xhtml"
        return ""

    def logout(self, configurationAttributes, requestParameters):
        return True
        
    def getNextStep(self, configurationAttributes, requestParameters, step):
        return -1

    def getLogoutExternalUrl(self, configurationAttributes, requestParameters):
        print "Get external logout URL call"
        return None

    def hasEnrollments(self, configurationAttributes, user):

        hasEnrollments = False
        values = user.getAttributeValues("oxExternalUid")

        if values != None:
            for extUid in values:
                if not hasEnrollments:
                    hasEnrollments = extUid.find("cert:") != -1

        return hasEnrollments

    def setMessageError(self, severity, result):

        if result != "UNKNOWN_ERROR":
            # Posible values are NOT_VALID, UNPARSABLE, NOT_SELECTED, CERT_ENROLLED_OTHER_USER, CERT_NOT_RECOGNIZED, UNKNOWN_USER
            msgId = "casa.cert.error." + result.lower()

            facesMessages = CdiUtil.bean(FacesMessages)
            facesMessages.setKeepMessages()
            facesMessages.clear()
            facesMessages.add(severity, "#{msgs['" + msgId + "']}")
