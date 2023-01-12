import {requestHelpers} from "@/helpers";

export const webtoolService = {
	getSubscriptions,
	getSubscription,
	updateSubscription,
	deleteSubscription,
	createSubscription,
	exportCsv,
	getNewsletterNbr,
	getContactMessages,
	getCountContactMessages,
	isWebsiteOnline,
	getWebsitePublicationDate,
};

function getContactMessages() {
	return requestHelpers.securedAxiosInstance.get(
		`${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/messages`
	);
}

function getCountContactMessages() {
	return requestHelpers.securedAxiosInstance.get(
		`${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/messages/count`
	);
}

function getSubscriptions() {
	const url = `${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/subscriptions`;
	return requestHelpers.securedAxiosInstance.get(url);
}

function getSubscription(id) {
	const url = `${
		import.meta.env.VITE_WEBTOOL_BASE_URL
	}/oauth/subscription/${id}`;
	return requestHelpers.securedAxiosInstance.get(url);
}

function updateSubscription(subscription) {
	const url = `${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/subscription/${
		subscription.id
	}`;
	return requestHelpers.securedAxiosInstance.post(url, subscription);
}

function createSubscription(subscription) {
	const url = `${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/subscription`;
	return requestHelpers.securedAxiosInstance.post(url, subscription);
}

function deleteSubscription(id) {
	const url = `${
		import.meta.env.VITE_WEBTOOL_BASE_URL
	}/oauth/subscription/${id}`;
	return requestHelpers.securedAxiosInstance.delete(url);
}

function exportCsv(domainName) {
	const url = `${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/subscriptions/csv`;
	return requestHelpers.securedAxiosInstance.get(url, {
		params: {
			domainName: domainName,
		},
	});
}

function getNewsletterNbr() {
	/*const url = `${
		import.meta.env.VITE_WEBTOOL_BASE_URL
	}/oauth/subscriptions/count`;*/
	const url = `${import.meta.env.VITE_WEBTOOL_BASE_URL}/oauth/subscriptions`;

	return requestHelpers.securedAxiosInstance.get(url);
}

function isWebsiteOnline(domainName) {
	const url = `${
		import.meta.env.VITE_WEBTOOL_BASE_URL
	}/oauth/domainName/isOnline`;
	return requestHelpers.securedAxiosInstance.get(url, {
		params: {
			domainName: domainName,
		},
	});
}

function getWebsitePublicationDate(domainName) {
	const url = `${
		import.meta.env.VITE_WEBTOOL_BASE_URL
	}/oauth/domainName/publicationDate`;
	return requestHelpers.securedAxiosInstance
		.get(url, {
			params: {
				domainName: domainName,
			},
		})
		.then((response) => (response ? response.date : null));
}
