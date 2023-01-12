import {requestHelpers} from "@/helpers";

export const atInternetService = {
	connect,
	getVisits,
	getSourceVisits,
};

function connect() {
	return requestHelpers.securedAxiosInstance.post(
		`${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/atinternet/connect`
	);
}

function getVisits(atInternetId, dateRange = null) {
	return requestHelpers.securedAxiosInstance.post(
		`${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/atinternet/visits`,
		{
			atInternetId,
			dateRange,
		}
	);
}

function getSourceVisits(atInternetId, dateRange = null) {
	return requestHelpers.securedAxiosInstance.post(
		`${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/atinternet/source`,
		{
			atInternetId,
			dateRange,
		}
	);
}
