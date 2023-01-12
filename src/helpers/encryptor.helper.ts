import jsrsasign from "jsrsasign";
import jwt_decode from "jwt-decode";
import base64url from "base64url";

class InvalidTokenClaimException {
	message: string;
	name: string;

	constructor(message: string) {
		this.message = message;
		this.name = "InvalidTokenClaimException";
	}
}

class InvalidTokenFormatException {
	message: string;
	name: string;

	constructor() {
		this.message = "Invalid token format";
		this.name = "InvalidTokenFormatException";
	}
}

class InvalidTokenSignatureException {
	message: string;
	name: string;

	constructor() {
		this.message = "Invalid token signature";
		this.name = "InvalidTokenSignatureException";
	}
}

class TokenExpiredException {
	message: string;
	name: string;

	constructor() {
		this.message = "Token has expired";
		this.name = "TokenExpiredException";
	}
}

class RefreshTokenExpiredException {
	message: string;
	name: string;

	constructor() {
		this.message = "Refresh token has expired";
		this.name = "RefreshTokenExpiredException";
	}
}

function bin2hex(s: string) {
	let i,
		l,
		o = "",
		n;
	s += "";
	for (i = 0, l = s.length; i < l; i++) {
		n = s.charCodeAt(i).toString(16);
		o += n.length < 2 ? "0" + n : n;
	}

	return o;
}

function decodeToken(token: string) {
	return jwt_decode(token);
}

function expiredToken(token) {
	if (!token.hasOwnProperty("exp")) {
		throw new InvalidTokenClaimException('Token claim missing: "exp"');
	}
	if (Math.floor(Date.now() / 1000) > token.exp) {
		throw new TokenExpiredException();
	}
}

function verifyToken(token) {
	verifyTokenSignature(token);

	const decodedToken = decodeToken(token);
	if (!decodedToken.hasOwnProperty("sub")) {
		throw new InvalidTokenClaimException('Token claim missing: "sub"');
	}
	expiredToken(decodedToken);

	return decodedToken;
}

function verifyTokenSignature(token) {
	const key = jsrsasign.KEYUTIL.getKey(
		import.meta.env.VITE_LOCALFR_API_OAUTH2_PUBLIC_KEY
	);
	const tokenParts = token.split(".");

	if (tokenParts.length < 3) {
		throw new InvalidTokenFormatException();
	}

	const payloadHash = jsrsasign.KJUR.crypto.Util.sha256(
		tokenParts[0] + "." + tokenParts[1]
	);
	console.log(tokenParts[2]);
	const hexSig = bin2hex(base64url.decode(tokenParts[2])); // err
	if (key.verifyWithMessageHash(payloadHash, hexSig)) {
		return hexSig;
	}

	throw new InvalidTokenSignatureException();
}

export const encryptorHelpers = {
	bin2hex,
	decodeToken,
	verifyToken,
	TokenExpiredException,
	RefreshTokenExpiredException,
};
