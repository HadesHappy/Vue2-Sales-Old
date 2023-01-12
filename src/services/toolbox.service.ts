import {requestHelpers} from "@/helpers";

export const toolboxService = {
	getAutologin,
};

function getAutologin(customerCode) {
	return requestHelpers.securedAxiosInstance.get(
		`${
			import.meta.env.VITE_LOCALETMOI_BASE_URL
		}/api/toolbox/autologin?customerCode=${customerCode}`
	);
}
