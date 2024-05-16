const NOT_ALLOWED = ["http://", "ftp://", "file://", "telnet://", "smb://", "ssh://", "ldap://", "https://192.168", "https://127.0", "https://172", "https://localhost"]
export const isValid = (url) => {
    if (url === undefined || url === null || !isAllowed(url)) {
        return false;
    } else {
        const exp = '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$';
        const pattern = new RegExp(exp, 'i');
        return pattern.test(url)
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

