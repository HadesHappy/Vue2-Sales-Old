import {store} from "@/store";

export const readyState = {
	getSalesforceState,
	getCurrentPartnerState,
	isAllowedToEditToDisplayColorSection,
};

function getSalesforceState() {
	if (!isSalesforceDataLoading()) {
		return Promise.resolve(store.state.globalStore.salesforce);
	}

	return new Promise((resolve) => {
		const interval = setInterval(() => {
			if (isSalesforceDataLoading()) {
				return;
			}
			window.clearInterval(interval);
			resolve(store.state.globalStore.salesforce);
		}, 50);
	});
}

function getCurrentPartnerState() {
	if (
		store.state.account.currentPartner &&
		store.state.account.currentPartner.id
	) {
		return Promise.resolve(store.state.account.currentPartner);
	}

	return new Promise((resolve) => {
		const interval = setInterval(() => {
			if (
				!store.state.account.currentPartner ||
				!store.state.account.currentPartner.id
			) {
				return;
			}
			window.clearInterval(interval);
			resolve(store.state.account.currentPartner);
		}, 50);
	});
}

function isAllowedToEditToDisplayColorSection() {
	return getCurrentPartnerState().then(() => {
		if (store.state.account.identity) {
			return store.state.account.identity.allowedToEdit;
		}

		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (!store.state.account.identity) {
					return;
				}
				window.clearInterval(interval);
				resolve(store.state.account.identity.allowedToEdit);
			}, 50);
		});
	});
}

function isSalesforceDataLoading() {
	return (
		store.state.globalStore.status.isSalesforceAccountLoading ||
		store.state.globalStore.status.isSalesforceOpportunitiesLoading
	);
}
