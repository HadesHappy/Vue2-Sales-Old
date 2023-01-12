import {requestHelpers} from "@/helpers";

export const localfrApiService = {
	getPartner,
	getPaymentModes: () =>
		getEntityList("payment_modes", {
			"fields[]": "name",
		}),
	getLanguages: () => getEntityList("languages"),
	getPortals: () => getEntityList("portals"),
	updatePartner: (id: any, data: any) => updateEntity("partners", id, data),
	updatePartnerFolder: (id: any, data: any) =>
		updateEntity("partner_folders", id, data),
	updatePartnerAutoImmo: (id: any, data: any) =>
		updateEntity("partner_auto_immos", id, data),
	updatePartnerHotelResto: (id: any, data: any) =>
		updateEntity("partner_hotel_restos", id, data),
	updatePartnerBoutique: (id: any, data: any) =>
		updateEntity("partner_boutiques", id, data),
	updatePartnerShop: (id: any, data: any) =>
		updateEntity("partner_shops", id, data),
	updateSite: (id: any, data: any) => updateEntity("sites", id, data),
	updateBookEngine: (id: any, data: any) =>
		updateEntity("book_engines", id, data),
	updateBanner: (id: any, data: any) => updateEntity("banners", id, data),
	updateSiteTree: (id: any, data: any) => updateEntity("site_trees", id, data),
	updateFeeDetail: (id: any, data: any) =>
		updateEntity("fee_details", id, data),
	updateFootage: (id: any, data: any) => updateEntity("footages", id, data),
	updateSocialNetwork: (id: any, data: any) =>
		updateEntity("social_networks", id, data),
	updateCampaignOption: (id: any, data: any) =>
		updateEntity("campaign_options", id, data),
	updateDeliveryMode: (id: any, data: any) =>
		updateEntity("delivery_modes", id, data),
	updateOpeningRange: (id: any, data: any) =>
		updateEntity("opening_ranges", id, data),
	updateAgenda: (id: any, data: any) => updateEntity("agendas", id, data),
	updateAgendaService: (id: any, data: any) =>
		updateEntity("agenda_services", id, data),
	updateAgendaResource: (id: any, data: any) =>
		updateEntity("agenda_resources", id, data),
	updateAgendaMember: (id: any, data: any) =>
		updateEntity("agenda_members", id, data),
	updateAgendaVisio: (id: any, data: any) =>
		updateEntity("agenda_visios", id, data),
	updatePartnerHistory: (id: any, data: any) =>
		updateEntity("partner_histories", id, data),
	updateNote: (id: any, data: any) => updateEntity("notes", id, data),
	updateBookingService: (id: any, data: any) =>
		updateEntity("booking_services", id, data),
	updateBookingTimeRange: (id: any, data: any) =>
		updateEntity("booking_time_ranges", id, data),

	createCampaignOption: (data: any) => createEntity("campaign_options", data),
	createPartnerShop: (data: any) => createEntity("partner_shops", data),
	createPartnerAutoImmo: (data: any) =>
		createEntity("partner_auto_immos", data),
	createPartnerHotelResto: (data: any) =>
		createEntity("partner_hotel_restos", data),
	createPartnerBoutique: (data: any) => createEntity("partner_boutiques", data),
	createSite: (data: any) => createEntity("sites", data),
	createSiteTree: (data: any) => createEntity("site_trees", data),
	createDeliveryMode: (data: any) => createEntity("delivery_modes", data),
	createFeeDetail: (data: any) => createEntity("fee_details", data),
	createFootage: (data: any) => createEntity("footages", data),
	createBanner: (data: any) => createEntity("banners", data),
	createOpeningRange: (data: any) => createEntity("opening_ranges", data),
	createSocialNetwork: (data: any) => createEntity("social_networks", data),
	createAgendaService: (data: any) => createEntity("agenda_services", data),
	createAgendaResource: (data: any) => createEntity("agenda_resources", data),
	createAgendaMember: (data: any) => createEntity("agenda_members", data),
	createAgendaVisio: (data: any) => createEntity("agenda_visios", data),
	createPartnerHistory: (data: any) => createEntity("partner_histories", data),
	createNote: (data: any) => createEntity("notes", data),
	createBookingService: (data: any) => createEntity("booking_services", data),
	createBookingTimeRange: (data: any) =>
		createEntity("booking_time_ranges", data),

	deleteCampaignOption: (data: any) => deleteEntity("campaign_options", data),
	deleteSiteTree: (data: any) => deleteEntity("site_trees", data),
	deleteFeeDetail: (data: any) => deleteEntity("fee_details", data),
	deleteFootage: (data: any) => deleteEntity("footages", data),
	deleteOpeningRange: (data: any) => deleteEntity("opening_ranges", data),
	deleteDeliveryMode: (data: any) => deleteEntity("delivery_modes", data),
	deleteAgendaService: (data: any) => deleteEntity("agenda_services", data),
	deleteAgendaResource: (data: any) => deleteEntity("agenda_resources", data),
	deleteAgendaMember: (data: any) => deleteEntity("agenda_members", data),
	deleteAgendaVisio: (data: any) => deleteEntity("agenda_visios", data),
	deletePartnerHistory: (data: any) => deleteEntity("partner_histories", data),
	deleteNote: (data: any) => deleteEntity("notes", data),
	deleteBookingService: (data: any) => deleteEntity("booking_services", data),
	deleteBookingTimeRange: (data: any) =>
		deleteEntity("booking_time_ranges", data),
};

function updateEntity(entityService: string, id: any, data: any) {
	return requestHelpers.securedAxiosInstance.patch(
		`${import.meta.env.VITE_API_BASE_URL}/api/${entityService}/${id}`,
		data,
		{
			headers: {
				Accept: "application/ld+json",
				"Content-Type": "application/merge-patch+json",
			},
		}
	);
}

function getPartner(customerCode: any) {
	return requestHelpers.securedAxiosInstance.get(
		`${
			import.meta.env.VITE_API_BASE_URL
		}/api/partners?customerCode=${customerCode}`,
		{
			headers: {
				Accept: "application/ld+json",
				"Content-Type": "application/ld+json",
			},
		}
	);
}

function getEntityList(entityService: string, params: [] = []) {
	return requestHelpers.securedAxiosInstance.get(
		`${import.meta.env.VITE_API_BASE_URL}/api/${entityService}`,
		{
			headers: {
				Accept: "application/ld+json",
				"Content-Type": "application/ld+json",
			},
			params,
		}
	);
}

function createEntity(entityService: string, data: any) {
	const dataToSend = Object.duplicate(data);
	Object.keys(dataToSend).forEach((key) => {
		if (
			Array.isArray(dataToSend[key]) &&
			1 === dataToSend[key].length &&
			"object" === typeof dataToSend[key][0] &&
			null !== dataToSend[key][0] &&
			!Object.keys(dataToSend[key][0]).length
		) {
			dataToSend[key] = [];
		}
	});

	return requestHelpers.securedAxiosInstance.post(
		`${import.meta.env.VITE_API_BASE_URL}/api/${entityService}`,
		dataToSend,
		{
			headers: {
				Accept: "application/ld+json",
				"Content-Type": "application/ld+json",
			},
		}
	);
}

function deleteEntity(entityService: string, id: any) {
	return requestHelpers.securedAxiosInstance.delete(
		`${import.meta.env.VITE_API_BASE_URL}/api/${entityService}/${id}`,
		{
			headers: {
				Accept: "application/ld+json",
				"Content-Type": "application/ld+json",
			},
		}
	);
}
