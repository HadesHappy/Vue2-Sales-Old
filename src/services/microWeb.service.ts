import {requestHelpers} from "@/helpers";

export const microWebService = {
	getUberallAutologin,
	getListings,
};

function getUberallAutologin(email, page) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/micro-services-api/uberall/autologin`;
	return requestHelpers.securedAxiosInstance.post(url, {
		accountEmail: email || store.state.account.identity.email,
		page: page || null,
	});
}

function getListings() {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/micro-services-api/uberall/autologin`;
	return requestHelpers.securedAxiosInstance.post(url, {
		accountEmail: store.state.account.identity.email,
	});
}
