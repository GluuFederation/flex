const NOT_ALLOWED = ["http://", "ftp://", "file://", "telnet://", "smb://", "ssh://", "ldap://", "https://192.168", "https://127.0", "https://172", "https://localhost"]
export const isValid = (url) => {
    if (url === undefined || url === null) {
        return false;
    } else {
        return isAllowed(url)
    }
}

const isAllowed = (url) => {
    let result = true;
    for (let extention in NOT_ALLOWED) {
        if (url.startsWith(NOT_ALLOWED[extention])) {
            result = false;
            break;
        }
    }
    return result;
}