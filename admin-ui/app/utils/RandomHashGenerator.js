export class RandomHashGenerator {
    constructor(randomHashGenerator) {
        this.randomHashGenerator = randomHashGenerator
    }
    static async generateRandomChallengePair(algo) {
        const secret = await RandomHashGenerator.generateRandomString();
        const encryt = await RandomHashGenerator.encrypt(secret, algo); //'SHA-256'
        const hashed = RandomHashGenerator.base64URLEncode(encryt);
        return { codeVerifier: secret, codeChallenge: hashed };
    }

    static base64URLEncode(a) {
        let str = "";
        let bytes = new Uint8Array(a);
        const len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            str += String.fromCharCode(bytes[i]);
        }

        return btoa(str)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

    }

    static dec2hex(dec) {
        return ('0' + dec.toString(16)).substr(-2)
    }

    static generateRandomString() {
        let array = new Uint32Array(56 / 2);
        window.crypto.getRandomValues(array);
        return Array.from(array, RandomHashGenerator.dec2hex).join('');
    }

    static async encrypt(plain, algo) { // returns promise ArrayBuffer
        const encoder = new TextEncoder();
        const data = await encoder.encode(plain);
        return window.crypto.subtle.digest(algo, data);
    }
}