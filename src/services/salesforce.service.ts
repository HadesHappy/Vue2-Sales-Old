import {dateHelpers, requestHelpers} from "@/helpers";
import {websiteService, adplorerService} from "@/services";
import {store} from "@/store";

export const salesforceService = {
	downloadFile,
	getAccount: (id: any) => getObject("account", id),
	getAttachments,
	getContact,
	getOpportunities,
	getRib,
	parseAttachment,
	parseFiles,
	getTicket: (id: any) => getObject("ticket", id),
	updateTicket,
	createTicket,
	getTickets,
	getTask,
	getTaskTracking,
	getBriefAppointmentInfo,
	getUser: (id: any) => getObject("user", id),
	getUserByUsername,
	updateAccount: (id: any, data: any) => updateObject("account", id, data),
	updateContact: (id: any, data: any) => updateObject("contact", id, data),
	updateOpportunity: (id: any, data: any) =>
		updateObject("opportunity", id, data),
	updateTaskTracking: (id: any, data: any) =>
		updateObject("taskTracking", id, data),
	getSignalementTypes: () => getPickList("Opportunity", "Signalement__c"),
	findCurrentOffer,
	findCurrentOpportunity,
	getOfferNameByOpportunity,
	loadProductsFromOpportunity,
	isAdsOpportunity,
};

const offersTab = {
	LocalStart: ["ABSIT31"],
	LocalWeb: [
		"ABSIT3",
		"ABSIT11",
		"ABSIT16",
		"ABSIT52",
		"ABSIT53",
		"ABSIT54",
		"ABSIT4",
		"ABSIT8",
	],
	LocalAgenda: ["ABSIT17", "ABSIT18", "ABSIT19"],
	"E-commerce Platinum": [
		"ABSIT21",
		"ABSIT23",
		"ABSIT25",
		"ABSIT46",
		"ABSIT48",
		"ABSIT50",
	],
	"E-commerce Premium": [
		"ABSIT22",
		"ABSIT24",
		"ABSIT26",
		"ABSIT47",
		"ABSIT49",
		"ABSIT51",
	],
	LocalVisibilité: ["ABSIT40", "ABSIT41", "ABSIT42"],
	LocalAudience: ["ABSIT43-PK", "ABSIT44-PK", "ABSIT45-PK"],
	LocalBoost: ["ABADW4", "ABADW6", "ABADW8", "ABADW10", "ABADW14"],
	"LocalBoost+": ["ABADW5", "ABADW7", "ABADW9", "ABADW11", "ABADW13"],
	"Campagne sur mesure": ["ABADW12", "ABADW15", "ABADW16", "ABADW17"],
	LocalPrésence: ["ABLP01", "ABLP02", "ABLP03", "ABLP04"],
	LocalResto: [
		"ABSIT73",
		"ABSIT74",
		"ABSIT75",
		"ABSIT99",
		"ABSIT100",
		"ABSIT101",
	],
	"LocalResto Boutique": ["ABSIT102", "ABSIT103", "ABSIT104"],
	LocalHôtel: ["ABSIT70", "ABSIT71", "ABSIT72"],
	LocalAuto: ["ABSIT64", "ABSIT65", "ABSIT66"],
	LocalImmo: ["ABSIT67", "ABSIT68", "ABSIT69"],
	LocalAutoPlus: ["ABSIT76", "ABSIT77", "ABSIT78"],
	LocalImmoPlus: ["ABSIT79", "ABSIT80", "ABSIT81"],
	LocalShop: ["ABSIT58", "ABSIT59", "ABSIT60"],
	"LocalShop avec migration": ["ABSIT61", "ABSIT62", "ABSIT63"],
	LocalBoutique: [
		"ABSIT84",
		"ABSIT85",
		"ABSIT86",
		"ABSIT93",
		"ABSIT94",
		"ABSIT95",
	],
	"LocalBoutique Agenda": ["ABSIT96", "ABSIT97", "ABSIT98"],
};

const isLocalResto = ["LocalResto", "LocalResto Boutique"];
const visibilityOffers = [
	"LocalVisibilité",
	"LocalAgenda",
	"LocalAudience",
	"LocalPrésence",
	"LocalResto",
	"LocalHôtel",
	"E-commerce Platinum",
	"E-commerce Premium",
	"LocalAuto",
	"LocalImmo",
	"LocalAutoPlus",
	"LocalImmoPlus",
	"LocalShop",
	"LocalShop avec migration",
	"LocalBoutique",
	"LocalBoutique Agenda",
	...isLocalResto,
];
const isWebtoolOffers = [
	"LocalVisibilité",
	"LocalAgenda",
	"LocalAudience",
	"LocalWeb",
	"LocalStart",
	"LocalBoutique Agenda",
	"LocalBoutique",
];
const localBoostOffers = ["LocalBoost", "LocalBoost+", "Campagne sur mesure"];
const webtoolOffersWithNoVisibility = [
	"LocalWeb",
	"LocalStart",
	...localBoostOffers,
];
const isToolboxOffers = [
	"LocalHôtel",
	"LocalAuto",
	"LocalImmo",
	"LocalAutoPlus",
	"LocalImmoPlus",
	"LocalBoutique",
	...isLocalResto,
];
const isLocalHotel = ["LocalHôtel"];
const isLocalShop = ["LocalShop", "LocalShop avec migration"];
const isLocalShopWithMigration = ["LocalShop avec migration"];
const isUbiflowOffers = [
	"LocalAuto",
	"LocalImmo",
	"LocalAutoPlus",
	"LocalImmoPlus",
];
const isLocalAuto = ["LocalAuto"];
const isLocalAutoPlus = ["LocalAutoPlus"];
const isLocalImmo = ["LocalImmo"];
const isLocalImmoPlus = ["LocalImmoPlus"];
const isLocalBoutique = [
	"LocalBoutique",
	"LocalBoutique Agenda",
	"LocalResto Boutique",
];
const logoCreation = "LOG01";
const photosReport10 = "RPHOT01";
const photosReport20 = "RMET01";
const virtualVisit = "RVID01";
const photosVideoReport10 = "RVID02";
const adwordCampaign = "ABADW";

const TYPE_OFFER = "offer";
const TYPE_OPTION = "option";

function getObject(entity: string, objectId: any) {
	return requestHelpers.securedAxiosInstance.get(
		`${
			import.meta.env.VITE_LOCALETMOI_BASE_URL
		}/api/salesforce/${entity}/${objectId}`
	);
}

function getAttachments(accountId: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/account/${accountId}/attachments`;
	return requestHelpers.securedAxiosInstance
		.get(url)
		.then((data) => data.records);
}

async function parseAttachment(attachmentId: any, type: any, date: string) {
	const document = await getContentDocumentId(attachmentId);
	if (document.length > 0) {
		const result = document[0];
		if (result) {
			let documentName = await getVersionData(result.ContentDocumentId);
			const versionData = documentName[0].VersionData;
			documentName = documentName[0].PathOnClient;
			return {
				documentName,
				type,
				versionData,
				date: dateHelpers.format(date),
			};
		}
	}
}

async function getContentDocumentId(documentId: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/document/${documentId}/content`;
	return requestHelpers.securedAxiosInstance.get(url).then((data) => {
		return data.records;
	});
}

async function getVersionData(contentDocumentId: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/content/${contentDocumentId}/version`;
	return requestHelpers.securedAxiosInstance.get(url).then((data) => {
		return data.records;
	});
}

async function getFilesInfo(documentIds: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/content`;
	if (!documentIds) {
		return Promise.resolve([]);
	}
	return requestHelpers.securedAxiosInstance
		.post(url, {
			documentIds: documentIds,
		})
		.then((data) => {
			return data.records;
		});
}

async function parseFiles(fileIds: any) {
	const filesInfo = await getFilesInfo(fileIds);
	const files: {
		documentName: any;
		type: string;
		versionData: any;
		date: string;
	}[] = [];

	await Promise.all(
		filesInfo.map(
			async (file: { CreatedDate: string; Title: any; Id: any }) => {
				const date = dateHelpers.format(file.CreatedDate);
				let documentName = file.Title;
				if (
					documentName.includes("Facture") ||
					documentName.includes("Avoir")
				) {
					const result = await getVersionData(file.Id);
					documentName = result[0].PathOnClient;
					const versionData = result[0].VersionData;
					files.push({
						documentName,
						type: "Facture / Avoir",
						versionData,
						date,
					});
				}
			}
		)
	);

	return files;
}

function getRib(accountId: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/account/${accountId}/rib`;
	return requestHelpers.securedAxiosInstance.get(url).then((data) => {
		if (data.totalSize > 0) {
			return data.records[0];
		}
		return null;
	});
}

function getContact(accountId: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/account/${accountId}/contacts`;
	return requestHelpers.securedAxiosInstance.get(url).then((data) => {
		if (data.totalSize > 0) {
			return (
				data.records.find(
					(contact: { Contact_Principal__c: any }) =>
						contact.Contact_Principal__c
				) || data.records[0]
			);
		}
		return null;
	});
}

function getTask(accountId: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/account/${accountId}/task`;
	return requestHelpers.securedAxiosInstance
		.get(url)
		.then((data) => (data.totalSize > 0 ? data.records[0] : null));
}

function getTaskTracking(opportunityId: any) {
	return requestHelpers.securedAxiosInstance.get(
		`${
			import.meta.env.VITE_LOCALETMOI_BASE_URL
		}/api/salesforce/opportunity/${opportunityId}/taskTracking`
	);
}

function getOpportunities(accountId: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/account/${accountId}/opportunities`;
	return requestHelpers.securedAxiosInstance.get(url).then(async (response) => {
		const opportunities = response.records;
		if (!opportunities || !opportunities.length) {
			return [];
		}

		store.dispatch(
			"globalStore/setOpportunities",
			opportunities.sort(
				(
					a: { Date_signature2__c: number },
					b: { Date_signature2__c: number }
				) => (a.Date_signature2__c > b.Date_signature2__c ? 1 : -1)
			),
			{root: true}
		);

		// Load offers
		getOfferOpportunities(opportunities).forEach(
			(opportunity: {
				OpportunityLineItems: { records: any[] };
				Name: any;
				Date_signature2__c: any;
			}) => {
				if (
					!opportunity.OpportunityLineItems ||
					!opportunity.OpportunityLineItems.records
				) {
					return;
				}

				opportunity.OpportunityLineItems.records.forEach(
					(opportunityLineItem: {
						PricebookEntry: { Product2: { ProductCode: any } };
						Id: any;
						CreatedDate: any;
						API_CMS__c: any;
					}) => {
						const productCode =
							opportunityLineItem.PricebookEntry.Product2.ProductCode;
						const offerName = getOfferName(productCode);
						if (offerName) {
							addOffer({
								id: opportunityLineItem.Id,
								name: offerName,
								contractNumber: opportunity.Name,
								date: opportunityLineItem.CreatedDate,
								cms: opportunityLineItem.API_CMS__c,
								productCode: productCode,
								signatureDate: opportunity.Date_signature2__c,
							});
						}
					}
				);
			}
		);

		return opportunities;
	});
}

async function loadProductsFromOpportunity(
	opportunity: {
		OpportunityLineItems: { records: string | any[] };
		Date_signature2__c: any;
	},
	opportunityType = null
) {
	console.log('loadProductsFromOpportunity');
	if (!opportunity) {
		return;
	}

	if (
		!opportunity.OpportunityLineItems ||
		!opportunity.OpportunityLineItems.records ||
		!opportunity.OpportunityLineItems.records.length
	) {
		return;
	}

	if (opportunity.Date_signature2__c) {
		const calculatedSignatureDate = momentBusinessDays(
			opportunity.Date_signature2__c,
			"YYYY-MM-DD"
		).businessAdd(8);
		const currentDate = momentBusinessDays();
		store.dispatch(
			"globalStore/setHasSharedSpaceAccess",
			(calculatedSignatureDate && currentDate <= calculatedSignatureDate) ||
			!calculatedSignatureDate
		);
	}

	store.dispatch("globalStore/setOpportunityDetails", opportunity, {
		root: true,
	});


	for (const opportunityLineItem of opportunity.OpportunityLineItems.records) {
		let productCode = opportunityLineItem.PricebookEntry.Product2.ProductCode;
		switch (true) {
			case productCode === logoCreation:
				store.commit("globalStore/toggleHasLogoCreation", true);
				break;
			case productCode === photosReport10:
				store.commit("globalStore/toggleHasPhotosReport10", true);
				break;
			case productCode === photosReport20:
				store.commit("globalStore/toggleHasPhotosReport20", true);
				break;
			case productCode === virtualVisit:
				store.commit("globalStore/toggleHasVirtualVisit", true);
				break;
			case productCode === photosVideoReport10:
				store.commit("globalStore/toggleHasPhotosVideoReport10", true);
				break;
		}

		if ("R" === productCode[0]) {
			productCode = productCode.substr(1);
		}
		const offerName = getOfferName(productCode);

		if (!offerName) {
			continue;
		}

		const isOldLocalBoutique = ["ABSIT84", "ABSIT85", "ABSIT86"].includes(
			productCode
		);
		const isNewLocalBoutique = [
			"ABSIT93",
			"ABSIT94",
			"ABSIT95",
			"ABSIT96",
			"ABSIT97",
			"ABSIT98",
		].includes(productCode);

		const isNewLocalResto = ["ABSIT99", "ABSIT100", "ABSIT101"].includes(
			productCode
		);
		const isLocalRestoBoutique = ["ABSIT102", "ABSIT103", "ABSIT104"].includes(
			productCode
		);

		if (!store.state.globalStore.partner.hasVisibility) {
			store.dispatch(
				"globalStore/toggleHasVisibility",
				!webtoolOffersWithNoVisibility.includes(offerName)
			);
		}

		if (-1 !== visibilityOffers.indexOf(offerName)) {
			store.dispatch("globalStore/toggleHasVisibility", true);
			if (-1 !== isToolboxOffers.indexOf(offerName)) {
				store.dispatch(
					"globalStore/toggleIsToolbox",
					isOldLocalBoutique || isNewLocalResto || isLocalRestoBoutique
				);
				store.dispatch(
					"globalStore/toggleIsWebtool",
					isNewLocalBoutique || isNewLocalResto || isLocalRestoBoutique
				);
				if (-1 !== isLocalHotel.indexOf(offerName)) {
					store.dispatch("globalStore/toggleIsLocalHotel", true);
				}
				if (-1 !== isLocalResto.indexOf(offerName)) {
					store.dispatch("globalStore/toggleIsLocalResto", true);
					store.dispatch("globalStore/toggleIsNewLocalResto", isNewLocalResto);
					store.dispatch(
						"globalStore/toggleIsLocalRestoBoutique",
						isLocalRestoBoutique
					);
				}
				if (-1 !== isUbiflowOffers.indexOf(offerName)) {
					store.dispatch("globalStore/toggleIsUbiflow", true);
					store.dispatch(
						"globalStore/setUbiflowLink",
						websiteService.getUbiflowUrl()
					);
					if (-1 !== isLocalAuto.indexOf(offerName)) {
						store.dispatch("globalStore/toggleIsLocalAuto", true);
					}
					if (-1 !== isLocalAutoPlus.indexOf(offerName)) {
						store.dispatch("globalStore/toggleIsLocalAutoPlus", true);
					}
					if (-1 !== isLocalImmo.indexOf(offerName)) {
						store.dispatch("globalStore/toggleIsLocalImmo", true);
					}
					if (-1 !== isLocalImmoPlus.indexOf(offerName)) {
						store.dispatch("globalStore/toggleIsLocalImmoPlus", true);
					}
				}
			}
			if ("LocalPrésence" === offerName) {
				store.dispatch("globalStore/toggleIsWebtool", false);
				store.dispatch("globalStore/toggleIsLocalPresence", true);
			}
			if (-1 !== isLocalShop.indexOf(offerName)) {
				store.dispatch("globalStore/toggleIsWebtool", false);
				store.dispatch("globalStore/toggleIsToolbox", false);
				store.dispatch("globalStore/toggleIsLocalShop", true);
			}
			if (-1 !== isLocalShopWithMigration.indexOf(offerName)) {
				store.dispatch("globalStore/toggleIsLocalShopWithMigration", true);
			}
			if (-1 !== isLocalBoutique.indexOf(offerName)) {
				store.dispatch("globalStore/toggleIsLocalShop", false);
				store.dispatch("globalStore/toggleIsLocalBoutique", true);
				store.dispatch(
					"globalStore/toggleIsNewLocalBoutique",
					isNewLocalBoutique
				);
				store.dispatch(
					"globalStore/toggleIsOldLocalBoutique",
					isOldLocalBoutique
				);
			}
		}

		if (-1 !== isWebtoolOffers.indexOf(offerName)) {
			store.dispatch("globalStore/toggleIsWebtool", true);
			if ("LocalAgenda" === offerName || "LocalBoutique Agenda" === offerName) {
				store.dispatch("globalStore/toggleIsLocalAgenda", true);
			} else if ("LocalStart" === offerName) {
				store.dispatch("globalStore/toggleIsLocalStart", true);
			} else if ("LocalWeb" === offerName) {
				store.dispatch("globalStore/toggleIsLocalWeb", true);
			}
		}

		if (
			!store.state.globalStore.status.hasAdwordsCampaign &&
			/ABADW\d+(-PK)?/.test(productCode)
		) {
			store.commit("globalStore/toggleHasAdwordsCampaign", true);
		}

		if (
			TYPE_OFFER === opportunityType &&
			-1 !== localBoostOffers.indexOf(offerName)
		) {
			store.dispatch("globalStore/toggleIsLocalBoost", true);
		}

		if (
			store.state.globalStore.status.isLocalBoost ||
			store.state.globalStore.status.hasAdwordsCampaign
		) {
			store.dispatch(
				"globalStore/setAdplorerInformation",
				await adplorerService.getCustomerInformation(
					store.state.account.currentPartner.customerCode,
					store.state.globalStore.salesforce.account.Agence__c
				),
				{root: true}
			);
		}
	}
}

function getOfferName(productCode: string) {
	for (const offerName in offersTab) {
		if (
			offersTab[offerName].find((item: any) =>
				new RegExp(`^R?${item}(-PK)?$`).test(productCode)
			)
		) {
			return offerName;
		}
	}

	return null;
}

function getOfferNameByOpportunity(opportunity: {
	OpportunityLineItems: { records: any[] };
}) {
	let matchedOfferName = null;
	opportunity.OpportunityLineItems.records.forEach(
		(opportunityLineItem: {
			PricebookEntry: { Product2: { ProductCode: any } };
		}) => {
			const productCode =
				opportunityLineItem.PricebookEntry.Product2.ProductCode;
			for (const offerName in offersTab) {
				if (
					offersTab[offerName].find((item: any) =>
						new RegExp(`^R?${item}(-PK)?$`).test(productCode)
					)
				) {
					if (
						opportunity.OpportunityLineItems.records.length > 1 &&
						/^R?ABADW/.test(productCode)
					) {
						continue;
					}
					matchedOfferName = offerName;
				}
			}
		}
	);

	return matchedOfferName;
}

function addOffer(offer: {
	id: any;
	name?: string;
	contractNumber?: any;
	date?: any;
	cms?: any;
	productCode?: any;
	signatureDate?: any;
}) {
	const found = getOffer(offer.id);
	if (!found) {
		store.commit("globalStore/addOffer", offer);
	}
}

function getOffer(id: any) {
	const offers = getOffers();
	for (const key in offers) {
		if (id === offers[key].id) {
			return offers[key];
		}
	}

	return null;
}

function getOffers() {
	return store.state.globalStore.offers;
}

function setOffers(offers: any) {
	return store.dispatch("globalStore/setOffers", {offers});
}

function findCurrentOffer() {
	const offers = getOffers();
	if (offers && offers.length) {
		const avalaibleOffers = offers.filter(
			(offer: { productCode: string; contractNumber: string }) => {
				if (/^R?ABADW/.test(offer.productCode)) {
					// Look for original contrat that is related to this Ads offer
					const matches = offer.contractNumber.match(/^((E-)?\d+)-ads$/);
					if (matches) {
						// If this ads offer is linked to an original contract, skip it
						if (
							offers.find((item: { name: any }) => item.name === matches[1])
						) {
							return null;
						}
					}
				}

				return offer;
			}
		);
		if (avalaibleOffers.length) {
			console.log('[[SERVICE] findCurrentOffer()]: ',avalaibleOffers[0] )
			return avalaibleOffers[0];
		}
	}

	return null;
}

/**
 * Returns the most recent opportunity
 *
 * @param opportunities
 * @returns {null|*}
 */
function findCurrentOpportunity(opportunities: string | any[]) {
	if (opportunities && opportunities.length) {
		// sort from newest to oldest
		const offerOpportunities = getOfferOpportunities(opportunities).sort(
			(a: { Date_signature2__c: number }, b: { Date_signature2__c: number }) =>
				a.Date_signature2__c > b.Date_signature2__c ? -1 : 1
		);
		if (offerOpportunities.length) {
			return offerOpportunities[0];
		}
	}

	return null;
}

function getOfferOpportunities(opportunities: any[]) {
	return opportunities.filter((opportunity: { Name: string }) => {
		// Look for original contrat that is related to this Ads opportunity
		const matches = opportunity.Name.match(/^((E-)?\d+)-ads$/);
		// If this ads opportunity is linked to an original contract, skip it
		return matches &&
		opportunities.find((item: { Name: any }) => item.Name === matches[1])
			? null
			: opportunity;
	});
}

function downloadFile(file: { versionData: string }) {
	const filePathParts = file.versionData.split("/");
	const versionId = filePathParts[filePathParts.length - 2];
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/content/version/${versionId}`;
	return requestHelpers.securedAxiosInstance({
		url: url,
		method: "GET",
		responseType: "blob",
	});
}

function getTickets(accountId: any) {
	return requestHelpers.securedAxiosInstance
		.get(
			`${
				import.meta.env.VITE_LOCALETMOI_BASE_URL
			}/api/salesforce/account/${accountId}/tickets`
		)
		.then((data) => {
			return data.records;
		});
}

function getPickList(apiObjectName: string, fieldName: string) {
	return requestHelpers.securedAxiosInstance
		.get(
			`${
				import.meta.env.VITE_LOCALETMOI_BASE_URL
			}/api/salesforce/picklist/${apiObjectName}/${fieldName}`
		)
		.then((data) => data.values.map((item: { value: any }) => item.value));
}

function updateTicket(ticketId: any, payload: any) {
	return requestHelpers.securedAxiosInstance.patch(
		`${
			import.meta.env.VITE_LOCALETMOI_BASE_URL
		}/api/salesforce/ticket/${ticketId}`,
		payload
	);
}

function createTicket(data: {
	accountId: any;
	cms: any;
	contactId: any;
	description: any;
	origin: any;
	subject: any;
	type: any;
	category: any;
	priority: any;
}) {
	return requestHelpers.securedAxiosInstance.post(
		`${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/salesforce/account/${
			data.accountId
		}/tickets`,
		{
			AccountId: data.accountId,
			CMS__c: data.cms,
			ContactId: data.contactId,
			Description: data.description,
			Origin: data.origin,
			Subject: data.subject,
			Estimation_ticket__c: data.type || undefined,
			Type_de_Ticket__c: data.category || undefined,
			Priority: data.priority,
		}
	);
}

function updateObject(endpoint: string, id: any, data: any) {
	const url = `${
		import.meta.env.VITE_LOCALETMOI_BASE_URL
	}/api/salesforce/${endpoint}/${id}`;
	return requestHelpers.securedAxiosInstance.patch(url, data);
}

function getBriefAppointmentInfo(accountId: any) {
	const recordsTypeIds = [
		import.meta.env.VUE_SALESFORCE_BRIEF_EVENT_RECORD_TYPE_ID,
		import.meta.env.VUE_SALESFORCE_CLICK_COLLECT_BRIEF_EVENT_RECORD_TYPE_ID,
	];
	return requestHelpers.securedAxiosInstance
		.get(
			`${
				import.meta.env.VITE_LOCALETMOI_BASE_URL
			}/api/salesforce/accounts/${accountId}/events`,
			{params: {recordTypeIds: recordsTypeIds.join(",")}}
		)
		.then((data) => (data.records.length ? data.records[0] : null));
}

function isAdsOpportunity(opportunity: {
	Name: string;
	OpportunityLineItems: { records: string | any[] };
}) {
	return (
		/-ads$/.test(opportunity.Name) ||
		(1 === opportunity.OpportunityLineItems.records.length &&
			/^R?ABADW\d+$/.test(
				opportunity.OpportunityLineItems.records[0].PricebookEntry.Product2
					.ProductCode
			))
	);
}

function getUserByUsername(username: any) {
	return requestHelpers.securedAxiosInstance.get(
		`${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/salesforce/user`,
		{
			params: {
				username,
			},
		}
	);
}
