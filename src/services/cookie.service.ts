export const cookieService = {
	setCookie,
	getCookies,
	deleteCookie,
};

function setCookie(cookieName: string, value: any, expiredAfter = "3M") {
	const expiryDate = new Date();
	if (expiredAfter) {
		let matches = expiredAfter.match(/^(\d+)([yMdhms])$/);
		if (!matches) {
			matches = ["3M", 3, "M"];
		}
		const unit = {
			y: "FullYear",
			M: "Month",
			d: "Date",
			h: "Hours",
			m: "Minutes",
			s: "Seconds",
		}[matches[2]];
		expiryDate["set" + unit](expiryDate["get" + unit]() + parseInt(matches[1]));
	}
	document.cookie =
		cookieName + "=" + value + ";path=/;expires=" + expiryDate.toGMTString();
}

function getCookies() {
	const cookiesList = document.cookie.split(";");
	const cookies = {};
	if (!cookiesList.length) {
		return cookies;
	}

	cookiesList.forEach((cookie) => {
		if (!cookie) {
			return;
		}

		let [cookieName, cookieValue] = cookie.trim().split("=");
		switch (true) {
			case /\d+/.test(cookieValue):
				cookieValue = parseInt(cookieValue);
				break;
			case /^(true|false)$/i.test(cookieValue):
				cookieValue = JSON.parse(cookieValue);
				break;
			case "" === cookieValue:
				cookieValue = null;
				break;
		}
		cookies[cookieName] = cookieValue;
	});

	return cookies;
}

export function deleteCookie(cookieName: string) {
	document.cookie =
		cookieName + "=; Path=/; Domain=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
