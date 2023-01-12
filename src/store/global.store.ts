import {
	amazonService,
	localfrApiService,
	mailService,
	salesforceService,
	websiteService,
	webtoolService,
	dropboxService,
	sortTabsService,
	atInternetService,
	microWebService,
} from "@/services";
import {authDpHelper} from "@/helpers";
import {account} from "./account.store";
import dayjs from "dayjs";
import type {GlobalStore, Opportunity} from "./typings/globalStore";

const getInitialStatusState = () => {
	return {
		isQrcodeEnabled: false,
		isLocalBoost: false,
		isLocalStart: false,
		isLocalWeb: false,
		isLocalPresence: false,
		isWebtool: false,
		isToolbox: false,
		isEcommerce: false,
		isLocalShop: false,
		isLocalShopWithMigration: false,
		isUbiflow: false,
		isLocalAuto: false,
		isLocalAutoPlus: false,
		isLocalImmo: false,
		isLocalImmoPlus: false,
		isLocalHotel: false,
		isLocalResto: false,
		isLocalBoutique: false,
		isLocalRestoBoutique: false,
		isNewLocalResto: false,
		isNewLocalBoutique: false,
		isOldLocalBoutique: false,
		isLocalAgenda: false,
		isVisibilityOfferBeforeUberall: false,
		hasLogoCreation: false,
		hasPhotosReport10: false,
		hasPhotosReport20: false,
		hasVirtualVisit: false,
		hasPhotosVideoReport10: false,
		hasAdwordsCampaign: false,
		reportHasBeenSent: false,
	};
};

const getInitialState = function (): GlobalStore {
	return {
		status: {
			...getInitialStatusState(),
			isPageLoading: false,
			isSalesforceAccountLoading: false,
			isSalesforceContactLoading: false,
			isSalesforceTaskLoading: false,
			isSalesforceOpportunitiesLoading: false,
			isSalesforceDocumentsLoading: false,
			isSalesforceProductionValidated: false,
			passwordResetForm: false,
			isPasswordResetting: false,
			isNewBillingInfoSending: false,
			isNewDropobNotification: false,
			isNotifyingUploadedFiles: false,
			isDropboxEmailSent: false,
			isGetRecentFolderLoading: false,
			websiteInfoDisabled: true,
			updateWebsiteDisabled: true,
			isWebsiteOnline: false,
			isUploadingDropboxFileSending: false,
			isDownloadingDropboxFileSending: false,
			isSalesforceTicketLoading: false,
			isSalesforceTicketsLoading: false,
			isSalesforceTicketCreating: false,
			isSalesforceTicketUpdating: false,
			isSalesforceTicketThreadLoading: false,
			isSalesforceTicketAttachmentSending: false,
			isS3Uploading: false,
			isRibLoading: false,
			isLoadingVisits: false,
			isLoadingSources: false,
			isSalesforceBriefAppointmentInfoLoading: false,
			isUberallAutologinLoading: false,
			isUberallAutologinFailure: false,
			isWebsiteAutologinLoading: false,
			isRetrieveListingsFailure: false,
			isRetrieveListingsLoading: false,
			isConnectingToAtInternet: false,
			isContactMessagesLoading: false,
			isCountContactMessagesLoading: false,
			isNbrSubscriberLoading: false,
			isFilesSubmitting: false,
			isPaymentModesLoading: false,
			isLanguagesLoading: false,
			isPortalsLoading: false,
			hasMostRecentFolder: false,
			hasPartnerFolderAccess: true,
			hasSharedSpaceAccess: false,
			mostRecentFolder: {
				path: "",
				multipleFolders: [],
				message: "",
			},
		},
		salesforce: {
			account: {
				Agence__c: null,
				BillingCity: null,
				BillingPostalCode: null,
				BillingStreet: null,
				Code_Ape__c: null,
				Code_Sage__c: "",
				Date_de_cr_ation__c: null,
				Id: null,
				Industry: null,
				Libell_code_APE__c: null,
				List_ContentDocumentId__c: null,
				Name: null,
				Ownership: null,
				Phone: null,
				Raison_sociale__c: null,
				Satisfaction_client__c: 0,
				Siren__c: null,
				Nic__c: null,
				Site_Local_fr__c: null,
				Website: null,
				Date_Mise_en_ligne_Site__c: null,
			},
			brief: {
				date: null,
				callResult: null,
				ownerName: null,
			},
			contact: {
				Id: null,
				Birthdate: null,
				Email: null,
				FirstName: null,
				LastName: null,
				MobilePhone: null,
				Phone: null,
			},
			opportunity: {
				Signalement__c: null,
				Signalement_Commentaire__c: null,
				Cr_ation_logo__c: null,
			},
			taskTracking: {
				NDD_transf_rer__c: null,
				Registrar__c: null,
				Adresses_Mail_liees_coche__c: null,
				Adresses_Mail_liees__c: null,
				Offres_sp_cifiques_exchange__c: null,
			},
			dpValidated: {
				canEdit: null,
				validatedDpDate: null,
			},
			agenda: {
				crm: null,
				visio: null,
				online: null,
			},
			opportunities: null,
		},
		adplorer: {
			companyId: null,
			orderId: null,
		},
		ubiflowLink: null,
		websiteLink: null,
		websitePublicationDate: null,
		partner: {
			hasVisibility: false,
			url: null,
			hasRib: false,
			boutiqueUrl: null,
			isLoading: false,
			loaded: null,
			toolBoxUrl: null,
		},
		uberall: {
			listingsTab: null,
			listingsLength: null,
		},
		atInternetInformation: null,
		filterAudienceRange: null,
		atInternetVisitsData: null,
		atInternetSourceData: null,
		webtool: {
			newsletter: {
				userList: [],
				nbrUser: 0,
			},
		},
		offers: [],
		paymentModes: [],
		languages: [],
		portals: [],
		documents: [],
		salesforceTickets: [],
		salesforceTicketThread: [],
	};
};

const state : any = getInitialState();

const actions = {

	setOpportunity({commit} : any, opportunity: Opportunity) {
		commit("setOpportunity", {opportunity});
	},

	setOpportunities({commit} : any, opportunities: Opportunity[]) {
		commit("setOpportunities", opportunities);
	},

	async getNewsletterNbr({dispatch, commit} : any) {
		commit("getNumberOfSubscriberRequest");
		return webtoolService.getNewsletterNbr().then(
			(response) => {
				dispatch("setNumberOfUser", response);
				commit("getNumberOfSubscriberSuccess");
			},
			(error) => {
				console.error(error);
				commit("getNumberOfSubscriberFailure");
				dispatch(
					"alert/error",
					{
						group: "no-ticket",
						title: "Service indisponible",
						type: "error",
						show: true,
						text: "Impossible d'afficher le nombre d'inscrits à votre newsletter",
					},
					{root: true}
				);
			}
		);
	},
	// webtool newsletter

	setNumberOfUser({commit}: any, listOfSites: string | any) {
		if (listOfSites.length !== 0) {
			const subscribers: any[] = [];
			for (const site in listOfSites) {
				listOfSites[site].forEach(function (item: { email: any }) {
					subscribers.push(item.email);
				});
			}
			commit("setSubscribers", subscribers);
			commit("setNumberOfSubscribers", subscribers.length);
		} else {
			commit("setNumberOfSubscribers", 0);
		}
	},

	setIsOldOpportunityBeforeUberall({commit, state} : any) {
		if (state.salesforce && state.salesforce.opportunity) {
			const signatureDate = dayjs(
				state.salesforce.opportunity.Date_signature2__c,
				"YYYY-MM-DD"
			);
			const uberallOffersStartDate = dayjs("2018-10-01", "YYYY-MM-DD");
			commit(
				"setIsVisibilityOfferBeforeUberall",
				signatureDate < uberallOffersStartDate
			);
		}
	},

	getUberallListings({dispatch, commit} : any) {
		dispatch("setIsOldOpportunityBeforeUberall");
		if (!state.partner.hasVisibility) {
			return dispatch(
				"alert/warn",
				{
					group: "general-error",
					message:
						"Pour souscrire à ce service, contactez votre commercial ou assistante d’agence.",
					show: true,
					title: "Service visibilité non souscrit",
					type: "error",
				},
				{root: true}
			);
		}

		if (state.status.isVisibilityOfferBeforeUberall) {
			return;
		}
		commit("getRetrieveListingsRequest");

		return microWebService.getListings().then(
			(response: any) => {
				dispatch("setListingsTabs", response.listings);
			},
			(error) => {
				console.error(error);
				commit("getRetrieveListingsFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible d'accéder à votre bilan de visibilité.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	// uberall listings
	setListingsTabs({commit}: any, listings: any[]) {
		listings.sort(sortTabsService.sortTabs("type", "asc"));
		for (let i = 0; i < listings.length; i++) {
			listings[i].urlImage =
				import.meta.env.UBERALL_PUBLIC_IMAGES + listings[i].type + ".png";
		}
		commit("setUberallListing", listings);
		commit("getRetrieveListingsSuccess");
	},
	getUberallAutologin({dispatch, commit} : any, {email, page} : any) {
		dispatch("setIsOldOpportunityBeforeUberall");
		if (!state.partner.hasVisibility) {
			return dispatch(
				"alert/warn",
				{
					group: "general-error",
					message:
						"Pour souscrire à ce service, contactez votre commercial ou assistante d’agence.",
					show: true,
					title: "Service visibilité non souscrit",
					type: "error",
				},
				{root: true}
			);
		}

		if (state.status.isVisibilityOfferBeforeUberall) {
			return;
		}
		commit("getUberallAutologinRequest");

		return microWebService.getUberallAutologin(email, page).then(
			(response: any) => {
				commit("getUberallAutologinSuccess");
				dispatch("openUberallAutologinLink", response.autologinLink);
			},
			(error) => {
				commit("getUberallAutologinFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible d'accéder à ce compte visibilité.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	openUberallAutologinLink({}: any, link: string | URL | undefined) {
		window.open(link);
	},
	getSalesforceTicket({dispatch, commit} : any, {ticketId} : any) {
		commit("getSalesforceTicketRequest");

		return salesforceService.getTicket(ticketId).then(
			(response) => {
				commit("getSalesforceTicketSuccess");

				return response;
			},
			(error) => {
				console.error(error);
				commit("getSalesforceTicketFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible créer le ticket de support.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	createSalesforceTicket({dispatch, commit} : any, {data} : any) {
		commit("createSalesforceTicketRequest");

		return salesforceService.createTicket(data).then(
			(response) => {
				commit("createSalesforceTicketSuccess");

				return response;
			},
			(error) => {
				console.error(error);
				commit("createSalesforceTicketFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible créer le ticket de support.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	updateSalesforceTicket({dispatch, commit} : any, {ticketId, data} : any) {
		commit("updateSalesforceTicketRequest");

		return salesforceService.updateTicket(ticketId, data).then(
			(response) => {
				commit("updateSalesforceTicketSuccess");

				return response;
			},
			(error) => {
				console.error(error);
				commit("updateSalesforceTicketFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible créer le ticket de support.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	uploadDropboxFile(
		{dispatch, commit} : any,
		{folderName, subFolder, file, message} : any
	) {
		commit("uploadDropboxFileRequest");
		commit("isFilesSubmitting", true);

		return dropboxService
			.uploadFile(folderName, subFolder, file, message)
			.then((response) => {
				commit("uploadDropboxFileSuccess");
				commit("isFilesSubmitting", false);
				dispatch(
					"alert/success",
					{
						group: "success",
						message: "Vos fichiers ont bien été envoyés !",
						show: true,
						title: "Envoyé !",
						type: "success",
					},
					{root: true}
				);
				return response;
			})
			.catch((error) => {
				console.error(error);
				commit("uploadDropboxFileFailure");
				commit("isFilesSubmitting", false);
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible d'envoyer le fichier.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);

				return {
					error: error,
				};
			});
	},
	getMostRecentFolder(
		{dispatch, commit} : any,
		{customerCode, companyName, subFolder} : any
	) {
		commit("getMostRecentFolderPathRequest");

		return dropboxService
			.getFolder(customerCode, companyName, subFolder, true)
			.then((response : any) => {
				commit("getMostRecentFolderPathSuccess");
				commit("mostRecentFolderPath", {
					path: response,
					multipleFolders: response.multipleFolders,
					hasMostRecentFolder: true,
					message: response.message,
				});

				return response;
			})
			.catch((error) => {
				console.error(error);
				commit("getMostRecentFolderPathFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récuperer le dossier le plus récent.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			});
	},
	async downloadDropboxFile(
		{dispatch, commit} : any,
		{folderName, subFolder, file} : any
	) {
		commit("downloadDropboxFileRequest");

		return dropboxService.downloadFile(folderName, subFolder, file).then(
			(response) => {
				commit("downloadDropboxFileSuccess");
				return response;
			},
			(error) => {
				console.error(error);
				commit("downloadDropboxFileFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible d'ajouter les fichiers au ticket de support.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	async s3Upload({dispatch, commit} : any, {sageCode, file} : any) {
		commit("s3UploadRequest");

		return amazonService.s3UploadFile(sageCode, file).then(
			(link) => {
				commit("s3UploadSuccess");
				return link;
			},
			(error) => {
				console.error(error);
				commit("s3UploadFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible d'ajouter les fichiers au ticket de support.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	getTickets({dispatch, commit} : any, {accountId} : any) {
		commit("getSalesforceTicketsRequest");

		return salesforceService.getTickets(accountId).then(
			(response) => {
				const tickets = response.map(
					(ticket: {
						id: any;
						Subject: any;
						Status: any;
						Description: any;
						createdAt: any;
						CreatedById: any;
						CreatedDate: string | number | Date;
						ClosedDate: string | number | Date;
					}) => ({
						id: ticket.id,
						subject: ticket.Subject,
						status: ticket.Status,
						description: ticket.Description,
						date: ticket.createdAt,
						createdBy: ticket.CreatedById,
						createdDate: ticket.CreatedDate
							? new Date(ticket.CreatedDate).toLocaleString()
							: null,
						closedDate: ticket.ClosedDate
							? new Date(ticket.ClosedDate).toLocaleString()
							: null,
					})
				);
				commit("getSalesforceTicketsSuccess", {tickets});

				return tickets;
			},
			(error) => {
				console.error(error);
				commit("getSalesforceTicketsFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible d'accéder à vos demandes pour le moment.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},

	sendNewBillingInfoMail({dispatch, commit} : any, {data} : any) {
		commit("sendNewBillingInfoMailRequest");

		return mailService.sendNewBillingInfoMail(data).then(
			() => {
				commit("sendNewBillingInfoMailSuccess");
				dispatch(
					"alert/success",
					{
						group: "mail-sent",
						message:
							"Vos nouvelles coordonnées ont été transmises et seront prises en compte sous 48h.",
						show: true,
						title: "Merci !",
						type: "success",
					},
					{root: true}
				);
			},
			() => {
				commit("sendNewBillingInfoMailFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "L'envoi du mail a échoué.",
						show: true,
						title: "Envoi impossible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},

	sendDropboxNotification(
		{dispatch, commit} : any,
		{customerCode, source, folders} : any
	) {
		commit("sendDropboxNotificationRequest");

		return mailService
			.sendDropboxNotification(customerCode, source, folders)
			.then(
				() => {
					commit("sendDropboxNotificationSuccess");
					commit("isDropboxEmailSent", true);
				},
				() => {
					commit("sendDropboxNotificationFailure");
					dispatch(
						"alert/error",
						{
							group: "general-error",
							message: "L'envoi du mail a échoué.",
							show: true,
							title: "Envoi impossible",
							type: "error",
						},
						{root: true}
					);
				}
			);
	},

	notifyUploadedFiles(
		{dispatch, commit} : any,
		{customerCode, source, files, folderName} : any
	) {
		commit("notifyUploadedFilesRequest");

		return mailService
			.notifyUploadedFiles(customerCode, source, files, folderName)
			.then(
				() => {
					commit("notifyUploadedFilesSuccess");
				},
				() => {
					commit("notifyUploadedFilesFailure");
					dispatch(
						"alert/error",
						{
							group: "general-error",
							message: "L'envoi du mail a échoué.",
							show: true,
							title: "Envoi impossible",
							type: "error",
						},
						{root: true}
					);
				}
			);
	},

	sendResetPasswordMail({dispatch, commit} : any, {data} : any) {
		commit("sendResetPasswordMailRequest");

		return mailService.sendResetPasswordMail(data).then(
			() => {
				commit("sendResetPasswordMailSuccess");
				dispatch(
					"alert/success",
					{
						group: "mail-sent",
						message: "Le message a bien été envoyé !",
						show: true,
						title: "Merci !",
						type: "success",
					},
					{root: true}
				);
				commit("togglePasswordResetForm", false);
			},
			(error) => {
				let message = "L'envoi du mail a échoué.";
				if (400 === error.response.status) {
					message = "Adresse email incorrect.";
				}
				commit("sendResetPasswordMailFailure");
				dispatch(
					"alert/error",
					{
						group: "auth-error",
						message: message,
						show: true,
						title: "Envoi impossible",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},

	getSalesforceAccount({dispatch, commit, state} : any, {accountId} : any) {
		let accountPromise;
		if (
			state.status.isSalesforceAccountLoading ||
			(state.salesforce.account && state.salesforce.account.Id)
		) {
			accountPromise = new Promise((resolve, reject) => {
				const timeout = setInterval(() => {
					if (
						!state.status.isSalesforceAccountLoading ||
						(state.salesforce.account && state.salesforce.account.Id)
					) {
						clearInterval(timeout);
						if (state.salesforce.account.Id) {
							resolve(state.salesforce.account);
						} else {
							reject();
						}
					}
				}, 50);
			});
		} else {
			accountPromise = salesforceService.getAccount(accountId);
		}
		commit("getSalesforceAccountRequest");

		return accountPromise.then(
			async (account) => {
				commit("getSalesforceAccountSuccess", {account});
				await dispatch(
					"setLatestAppointmentBriefInfo",
					state.salesforce.account.Id
				);
				return account;
			},
			(error) => {
				commit("getSalesforceAccountFailure");
				console.error(error);
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message:
							"Impossible de récupérer les informations de votre compte.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},

	async getSalesforceTask({dispatch, commit} : any, {accountId} : any) {
		commit("getSalesforceTaskRequest");

		return salesforceService.getTask(accountId).then(
			(task) => {
				if (null === task) {
					console.warn("Task into Salesforce not created");
				} else {
					console.info("Task created into Salesforce");
					commit("getSalesforceTaskSuccess");
					commit(
						"setHasPartnerFolderAccess",
						authDpHelper.checkPartnerFolderAccess(task, account.state.identity)
					);
				}
			},
			(error) => {
				commit("getSalesforceTaskFailure");
				console.error(error);
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message:
							"Impossible de récupérer les informations des tâches en cours.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},

	async setLatestAppointmentBriefInfo({commit, state}: any, accountId: any) {
		if (state.status.isSalesforceBriefAppointmentInfoLoading) {
			return;
		}
		commit("setSalesforceBriefAppointmentInfoLoadingRequest");
		return await salesforceService
			.getBriefAppointmentInfo(accountId)
			.then((response) => {
				commit("setSalesforceBriefAppointmentInfoLoadingSuccess");
				commit("setLatestAppointmentBriefInfo", response || null);
				return response;
			})
			.catch(() => commit("setSalesforceBriefAppointmentInfoLoadingFailure"));
	},

	async getSalesforceContact({dispatch, commit} : any, {accountId} : any) {
		let contactPromise;

		if (
			state.status.isSalesforceContactLoading ||
			(state.salesforce.contact && state.salesforce.contact.Id)
		) {
			contactPromise = new Promise((resolve, reject) => {
				const timeout = setInterval(() => {
					if (
						!state.status.isSalesforceContactLoading ||
						(state.salesforce.contact && state.salesforce.contact.Id)
					) {
						clearInterval(timeout);
						if (state.salesforce.contact && state.salesforce.contact.Id) {
							resolve(state.salesforce.contact);
						} else {
							reject();
						}
					}
				}, 50);
			});
		} else {
			contactPromise = salesforceService.getContact(accountId);
		}

		commit("getSalesforceContactRequest");
		const onFailure = (error: any) => {
			commit("getSalesforceContactFailure");
			console.error(error);
			dispatch(
				"alert/error",
				{
					group: "general-error",
					message: "Impossible de récupérer les informations du contact.",
					show: true,
					title: "Erreur",
					type: "error",
				},
				{root: true}
			);
		};

		return contactPromise
			.then((contact) => {
				if (contact) {
					commit("getSalesforceContactSuccess", {contact});

					return contact;
				}

				throw `No contact found for account ${accountId}`;
			}, onFailure)
			.catch(onFailure);
	},

	setOpportunityDetails(
		{dispatch, commit}: any,
		opportunity: {
			Id: any;
			Date_passage_DP_Valide__c: any;
			QR_Code__c: any;
			Deviseur_Visio__c: any;
			Deviseur_CRM__c: any;
			Deviseur_Agenda_en_ligne__c: any;
			StageName: string;
			Signalement__c: null;
			Signalement_Commentaire__c: null;
		}
	) {
		console.log('GLOBAL STORE set opportunity details');
		if (!opportunity) {
			return [];
		}

		salesforceService.getTaskTracking(opportunity.Id).then((taskTracking) => {
			commit("setTaskTracking", {taskTracking});
		});

		dispatch(
			"setDpValidated",
			authDpHelper.canEditPartnerFolder(
				opportunity.Date_passage_DP_Valide__c,
				account.state.identity
			)
		);

		if (opportunity.QR_Code__c) {
			dispatch("isQrcodeEnabled", true);
		}
		if (opportunity.Deviseur_Visio__c) {
			dispatch("setAgendaVisio", true);
		}
		if (opportunity.Deviseur_CRM__c) {
			dispatch("setAgendaCrm", true);
		}
		if (opportunity.Deviseur_Agenda_en_ligne__c) {
			dispatch("setAgendaOnline", true);
		}

		if ("Production Validée" === opportunity.StageName) {
			dispatch("isProductionValidated", true);
		}

		if (
			!opportunity.Signalement__c ||
			!opportunity.Signalement_Commentaire__c
		) {
			dispatch("setReportHasBeenSent", false);
		}

		if (
			null !== opportunity.Signalement__c &&
			null !== opportunity.Signalement_Commentaire__c
		) {
			dispatch("setReport", {
				Signalement__c: opportunity.Signalement__c,
				Signalement_Commentaire__c: opportunity.Signalement_Commentaire__c,
			});
			dispatch("setReportHasBeenSent", true);
		}
	},

	async getSalesforceOpportunities({dispatch, commit} :any , {accountId} : any) {
		console.log('GLOBAL STORE: getSalesforceOpportunities fn')
		if (
			state.status.isSalesforceOpportunitiesLoading ||
			null !== state.salesforce.opportunities
		) {
			return new Promise((resolve, reject) => {
				const timeout = setInterval(() => {
					if (state.status.isSalesforceOpportunitiesLoading) {
						return;
					}
					clearInterval(timeout);
					if (null !== state.salesforce.opportunities) {
						resolve(state.salesforce.opportunities);
					} else {
						reject();
					}
				}, 50);
			});
		}
		commit("getSalesforceOpportunitiesRequest");

		return salesforceService
			.getOpportunities(accountId)
			.then(
				(opportunities) => {
					const opportunity = salesforceService.findCurrentOpportunity(opportunities);

					console.log('[GLOBAL STORE] getOpportunités result',opportunities)
					commit("getSalesforceOpportunitiesSuccess", opportunities);

					console.log('[GLOBAL STORE] get tracking',opportunities);
					salesforceService.getTaskTracking(opportunity.Id).then(taskTracking => {
						commit('setTaskTracking', { taskTracking });
					});

					console.log('[STORE_GLOBAL] set dp validated',opportunities);
					dispatch('setDpValidated', authDpHelper.canEditPartnerFolder(
						opportunity.Date_passage_DP_Valide__c,
						account.state.identity
					));

					if (opportunity.QR_Code__c) {
						dispatch('isQrcodeEnabled', true);
					}
					if (opportunity.Deviseur_Visio__c) {
						dispatch('setAgendaVisio', true);
					}
					if (opportunity.Deviseur_CRM__c) {
						dispatch('setAgendaCrm', true);
					}
					if (opportunity.Deviseur_Agenda_en_ligne__c) {
						dispatch('setAgendaOnline', true);
					}

					if ('Production Validée' === opportunity.StageName) {
						dispatch('isProductionValidated', true);
					}

					if (!opportunity.Signalement__c || !opportunity.Signalement_Commentaire__c) {
						dispatch('setReportHasBeenSent', false);
					}

					if (null !== opportunity.Signalement__c && null !== opportunity.Signalement_Commentaire__c) {
						dispatch('setReport', {
							Signalement__c: opportunity.Signalement__c,
							Signalement_Commentaire__c: opportunity.Signalement_Commentaire__c
						});
						dispatch('setReportHasBeenSent', true);
					}


					return opportunities;
				},
				(error) => {
					commit("getSalesforceOpportunitiesFailure");
					console.error(error);
					dispatch(
						"alert/error",
						{
							group: "general-error",
							message: "Impossible de récupérer les informations de contrat.",
							show: true,
							title: "Erreur",
							type: "error",
						},
						{root: true}
					);
				}
			)
			.catch((error) => {
				console.error(error);
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer les informations de produit(s).",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			});
	},

	async getSalesforceDocuments({dispatch, commit} : any, {accountId} : any) {
		commit("getSalesforceDocumentsRequest");

		// Documents
		const documents: {
			documentName: any;
			type: any;
			versionData: any;
			date: string;
		}[] = [];

		const attachments = await salesforceService
			.getAttachments(accountId)
			.catch((error) => {
				commit("getSalesforceDocumentsFailure");
				console.error(error);
				return dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer les fichiers.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			});

		await attachments
			.filter((attachment: { Statut__c: string }) =>
				/^(joint|validé)e?$/i.test(attachment.Statut__c)
			)
			.map(
				async (attachment: {
					Id: any;
					Type_de_piece__c: any;
					CreatedDate: string;
				}) => {
					const items = await salesforceService.parseAttachment(
						attachment.Id,
						attachment.Type_de_piece__c,
						attachment.CreatedDate
					);
					if (items) {
						documents.push(items);
					}
				}
			);

		const files = await salesforceService
			.parseFiles(
				JSON.parse(state.salesforce.account.List_ContentDocumentId__c)
			)
			.catch((error) => {
				commit("getSalesforceDocumentsFailure");
				console.error(error);
				return dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer les fichiers.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			});

		files.forEach((file: { versionData: any }) => {
			if (!documents.find((item) => item.versionData === file.versionData)) {
				documents.push(file);
			}
		});

		commit("getSalesforceDocumentsSuccess", {documents});
	},

	getPartner({commit, state}: any, customerCode: any) {
		let partnerPromise;
		if (state.partner.isPartnerLoading) {
			partnerPromise = new Promise((resolve) => {
				const timeout = setInterval(() => {
					if (!state.partner.loaded) {
						return;
					}
					clearInterval(timeout);
					resolve(state.partner.loaded);
				}, 50);
			});
		} else {
			partnerPromise = localfrApiService.getPartner(customerCode);
		}

		commit("getPartnerLoadingRequest");
		return partnerPromise
			.then(
				(response) => {
					commit("setPartnerLoaded", response);
					commit("getPartnerLoadingSuccess");
					return response;
				},
				(error) => {
					commit("getPartnerLoadingFailure");
					return error;
				}
			)
			.catch((error) => {
				commit("getPartnerLoadingFailure");
				return error;
			});
	},
	getPaymentModes({dispatch, commit}) {
		if (state.status.isPaymentModesLoading) {
			return;
		}

		commit("getPaymentModesRequest");

		localfrApiService
			.getPaymentModes()
			.then((response : any) => {
				const paymentModes = {};
				if (response["hydra:totalItems"] > 0) {
					response["hydra:member"].forEach(
						(paymentMode: { name: string | number }) => {
							if (undefined === paymentModes[paymentMode.name]) {
								paymentModes[paymentMode.name] = paymentMode;
							}
						}
					);
				}
				commit("setPaymentModes", paymentModes);
				commit("getPaymentModesSuccess");
			})
			.catch((error) => {
				commit("getPaymentModesFailure");
				return dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer les moyens de paiement.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			});
	},
	getLanguages({dispatch, commit} : any) {
		if (state.status.isLanguagesLoading) {
			return;
		}

		commit("getLanguagesRequest");

		localfrApiService
			.getLanguages()
			.then((response: any) => {
				const languages = {};
				if (response["hydra:totalItems"] > 0) {
					response["hydra:member"].forEach((language: { language: string }) => {
						if (
							language.language &&
							undefined === languages[language.language.toLowerCase()]
						) {
							languages[language.language.toLowerCase()] = language;
						}
					});
				}
				commit("setLanguages", languages);
				commit("getLanguagesSuccess");
			})
			.catch((error) => {
				commit("getLanguagesFailure");
				return dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer les langues.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			});
	},
	getPortals({dispatch, commit} : any) {
		if (state.status.isPortalsLoading) {
			return;
		}

		commit("getPortalsRequest");

		localfrApiService
			.getPortals()
			.then((response : any) => {
				const portals : any = {};
				if (response["hydra:totalItems"] > 0) {
					response["hydra:member"].forEach((portal: { name: string }) => {
						if (
							portal.name &&
							undefined === portals[portal.name.toLowerCase()]
						) {
							portals[portal.name.toLowerCase()] = portal;
						}
					});
				}
				commit("setPortals", portals);
				commit("getPortalsSuccess");
			})
			.catch((error) => {
				commit("getPortalsFailure");
				return dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer les portails.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			});
	},
	async loadSalesforceData(
		{dispatch, commit},
		{identity, currentPartner, loadDocuments}
	) {
		if (!currentPartner) {
			return;
		}
		console.log('[GLOBAL STORE] Loading salesforce data');

		const currentPartnerFolder =
			currentPartner.partnerFolders && currentPartner.partnerFolders.length
				? currentPartner.partnerFolders[0]
				: null;

		// Reset Documents & Zendesk states
		commit("resetState");
		commit("toggleIsPageLoading", true);

		// Update identity in account store
		dispatch("account/setIdentity", {identity}, {root: true});
		// Update currentPartner in account store
		dispatch(
			"account/setCurrentPartnerFolderSnapshot",
			Object.duplicate({
				currentPartnerFolder,
				salesforce: state.salesforce,
			}),
			{root: true}
		);
		dispatch("account/setCurrentPartner", {currentPartner}, {root: true});

		// Toggle webtool source
		commit("toggleIsWebtool", "webtool" === currentPartner.source);

		// Get Salesforce account
		await dispatch("getSalesforceAccount", {
			accountId: currentPartner.company,
		});

		if (!state.salesforce.account || !state.salesforce.account.Id) {
			commit("toggleIsPageLoading", false);
			return;
		}

		// Get Salesforce contact
		await dispatch("getSalesforceContact", {
			accountId: state.salesforce.account.Id,
		});

		// Get Salesforce opportunity
		console.log('[GLOBAL STORE] Get salesforce ooprtunity');

		await dispatch("getSalesforceOpportunities", {
			accountId: state.salesforce.account.Id,
		});

		// Get Salesforce task
		await dispatch("getSalesforceTask", {accountId: currentPartner.company});

		// enable Website Info
		commit("toggleWebsiteInfoDisabled", false);

		commit("setPartnerUrl", await websiteService.getWebsiteAutologin());

		if ("webtool" !== currentPartner.source) {
			commit("toggleUpdateWebsiteDisabled", false);
			if (state.salesforce.account.Date_Mise_en_ligne_Site__c) {
				commit("toggleIsWebsiteOnline", true);
			}
		} else {
			const domainName = state.salesforce.account.Site_Local_fr__c
				? state.salesforce.account.Site_Local_fr__c
				: state.salesforce.account.Website;
			if (!domainName) {
				commit("toggleUpdateWebsiteDisabled", true);
				commit("toggleIsWebsiteOnline", false);
			} else {
				await webtoolService
					.isWebsiteOnline(domainName)
					.then((isOnline) => {
						commit("toggleUpdateWebsiteDisabled", 0 === isOnline);
						commit("toggleIsWebsiteOnline", 1 === isOnline);
						return webtoolService
							.getWebsitePublicationDate(domainName)
							.then((publicationDate) => {
								commit(
									"setWebsitePublicationDate",
									publicationDate ? new Date(publicationDate) : null
								);
								if (1 === isOnline) {
									commit(
										"toggleUpdateWebsiteDisabled",
										!publicationDate || null === publicationDate.date
									);
								}
							})
							.catch((error) => {
								commit("toggleUpdateWebsiteDisabled", true);
								commit("setWebsitePublicationDate", null);
							});
					})
					.catch((error) => {
						commit("toggleUpdateWebsiteDisabled", true);
						commit("toggleIsWebsiteOnline", false);
					});
			}
		}

		if (loadDocuments) {
			await dispatch("getSalesforceDocuments", {
				accountId: state.salesforce.account.Id,
			});
			await dispatch("getRib", {accountId: state.salesforce.account.Id});
		}

		commit("toggleIsPageLoading", false);
	},

	async connectToAtInternet({dispatch, commit}) {
		commit("connectToAtInternetRequest");

		return atInternetService.connect().then(
			(response) => {
				commit("connectToAtInternetSuccess", response);
				return response;
			},
			(error) => {
				commit("connectToAtInternetFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible d'accéder à votre rapport d'audience.",
						show: true,
						title: "Service indisponible",
						type: "error",
					},
					{root: true}
				);
				return error;
			}
		);
	},
	async loadAtInternetData({dispatch}: any, dateRange: any) {
		await dispatch("loadAtInternetVisitsData", dateRange);
		await dispatch("loadAtInternetSourceData", dateRange);
	},
	loadAtInternetVisitsData(
		{dispatch, commit}: any,
		dateRange: null | undefined
	) {
		commit("loadAtInternetVisitsDataRequest");
		const currentSite = state.websiteLink.replace("http://", "");
		return atInternetService
			.getVisits(
				state.atInternetInformation[currentSite].atinternet_id,
				dateRange
			)
			.then((response) => commit("setAtInternetVisitsData", response))
			.finally(() => commit("loadAtInternetVisitsDataDone"));
	},
	loadAtInternetSourceData(
		{dispatch, commit}: any,
		dateRange: null | undefined
	) {
		commit("loadAtInternetSourcesDataRequest");
		const currentSite = state.websiteLink.replace("http://", "");
		return atInternetService
			.getSourceVisits(
				state.atInternetInformation[currentSite].atinternet_id,
				dateRange
			)
			.then((response) => commit("setAtInternetSourceData", response))
			.finally(() => commit("loadAtInternetSourcesDataDone"));
	},
	setHasSharedSpaceAccess({commit}: any, value: any) {
		commit("setHasSharedSpaceAccess", value);
	},
	setSalesforceInformation({commit}: any, value: any) {
		commit("setSalesforceInformation", value);
	},
	setAdplorerInformation({commit}: any, value: any) {
		commit("setAdplorerInformation", value);
	},
	toggleIsLocalBoost({commit}: any, value: any) {
		commit("toggleIsLocalBoost", value);
	},
	toggleIsLocalStart({commit}: any, value: any) {
		commit("toggleIsLocalStart", value);
	},
	toggleIsLocalWeb({commit}: any, value: any) {
		commit("toggleIsLocalWeb", value);
	},
	toggleIsLocalPresence({commit}: any, value: any) {
		commit("toggleIsLocalPresence", value);
	},
	toggleIsWebtool({commit}: any, value: any) {
		commit("toggleIsWebtool", value);
	},
	toggleIsToolbox({commit}: any, value: any) {
		commit("toggleIsToolbox", value);
	},
	toggleIsEcommerce({commit}: any, value: any) {
		commit("toggleIsEcommerce", value);
	},
	toggleIsLocalShop({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalShop", value);
		if (value) {
			dispatch("account/initializePartnerShop", {}, {root: true});
		}
	},
	toggleIsLocalShopWithMigration({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalShopWithMigration", value);
		if (value) {
			dispatch("account/initializePartnerShop", {}, {root: true});
		}
	},
	toggleIsUbiflow({commit}: any, value: any) {
		commit("toggleIsUbiflow", value);
	},
	toggleIsLocalAuto({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalAuto", value);
		if (value) {
			dispatch("account/initializePartnerAutoImmo", {}, {root: true});
		}
	},
	toggleIsLocalAutoPlus({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalAutoPlus", value);
		if (value) {
			dispatch("account/initializePartnerAutoImmo", {}, {root: true});
		}
	},
	toggleIsLocalImmo({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalImmo", value);
		if (value) {
			dispatch("account/initializePartnerAutoImmo", {}, {root: true});
		}
	},
	toggleIsLocalImmoPlus({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalImmoPlus", value);
		if (value) {
			dispatch("account/initializePartnerAutoImmo", {}, {root: true});
		}
	},
	toggleIsLocalHotel({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalHotel", value);
		if (value) {
			dispatch("account/initializePartnerHotelResto", {}, {root: true});
		}
	},
	toggleIsLocalResto({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalResto", value);
		if (value) {
			dispatch("account/initializePartnerHotelResto", {}, {root: true});
		}
	},
	toggleIsLocalRestoBoutique({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalRestoBoutique", value);
		if (value) {
			dispatch("account/initializePartnerHotelResto", {}, {root: true});
			dispatch("account/initializePartnerBoutique", {}, {root: true});
		}
	},
	toggleIsNewLocalResto({commit}: any, value: any) {
		commit("toggleIsNewLocalResto", value);
	},
	toggleHasVisibility({commit}: any, value: any) {
		commit("toggleHasVisibility", value);
	},
	toggleIsLocalBoutique({dispatch, commit}: any, value: boolean) {
		commit("toggleIsLocalBoutique", value);
		if (value) {
			dispatch("account/initializePartnerBoutique", {}, {root: true});
		}
	},
	toggleIsNewLocalBoutique({dispatch, commit}: any, value: boolean) {
		commit("toggleIsNewLocalBoutique", value);
		if (value) {
			dispatch("account/initializePartnerBoutique", {}, {root: true});
		}
	},
	toggleIsOldLocalBoutique({dispatch, commit}: any, value: boolean) {
		commit("toggleIsOldLocalBoutique", value);
		if (value) {
			dispatch("account/initializePartnerBoutique", {}, {root: true});
		}
	},
	toggleIsLocalAgenda({commit}: any, value: any) {
		commit("toggleIsLocalAgenda", value);
	},
	setUbiflowLink({commit}: any, value: any) {
		commit("setUbiflowUrl", value);
	},
	setOffers({commit}, {offers}) {
		commit("setOffers", offers);
	},
	setSalesforceTask({commit}, {overrideTask}) {
		commit("setSalesforceTask", overrideTask);
	},
	setPartnerBoutiqueUrl({commit}: any, boutiqueUrl: any) {
		commit("setPartnerBoutiqueUrl", boutiqueUrl);
	},
	setToolBoxPartnerUrl({commit}: any, toolBoxPartnerUrl: any) {
		commit("setToolBoxPartnerUrl", toolBoxPartnerUrl);
	},

	setDpValidated({commit}: any, dpValidated: any) {
		commit("setDpValidated", dpValidated);
	},
	setAgendaVisio({commit}: any, value: any) {
		commit("setAgendaVisio", value);
	},
	setAgendaCrm({commit}: any, value: any) {
		commit("setAgendaCrm", value);
	},
	setAgendaOnline({commit}: any, value: any) {
		commit("setAgendaOnline", value);
	},
	isProductionValidated({commit}: any, value: any) {
		commit("isProductionValidated", value);
	},
	isQrcodeEnabled({commit}: any, value: any) {
		commit("isQrcodeEnabled", value);
	},
	setReport({commit}: any, value: any) {
		commit("setOpportunity", {opportunity: value});
	},
	setReportHasBeenSent({commit}: any, value: any) {
		commit("setReportHasBeenSent", value);
	},
	resetPartnerOffers({commit}) {
		commit("resetPartnerOffers");
	},

	async getRib({dispatch, commit}, {accountId}) {
		commit("getRibRequest");

		return salesforceService.getRib(accountId).then(
			(rib) => {
				let hasRib = false;
				if (rib) {
					hasRib = true;
				}
				commit("getRibSuccess", {hasRib});
				return rib;
			},
			(error) => {
				commit("getRibFailure");
				console.error(error);
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer vos informations de paiement.",
						show: true,
						type: "error",
						title: "Erreur",
					},
					{root: true}
				);
			}
		);
	},

	async getContactMessages({dispatch, commit}) {
		commit("getContactMessagesRequest");

		return webtoolService.getContactMessages().then(
			(response) => {
				commit("getContactMessagesSuccess");
				return response;
			},
			(error) => {
				commit("getContactMessagesFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer vos messages.",
						show: true,
						type: "error",
						title: "Erreur",
					},
					{root: true}
				);
			}
		);
	},

	async getCountContactMessages({dispatch, commit}) {
		commit("getCountContactMessagesRequest");

		return webtoolService.getCountContactMessages().then(
			(response) => {
				commit("getCountContactMessagesSuccess");
				return response;
			},
			(error) => {
				commit("getCountContactMessagesFailure");
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer vos messages.",
						show: true,
						type: "error",
						title: "Erreur",
					},
					{root: true}
				);
			}
		);
	},
	setFilterAudienceValue(
		{commit, dispatch}: any,
		value: {
			startDate: string | number | Date | dayjs.Dayjs | null | undefined;
			endDate: string | number | Date | dayjs.Dayjs | null | undefined;
		}
	) {
		commit("setFilterAudienceValue", value);
		return dispatch("loadAtInternetData", {
			start: dayjs(value.startDate).format("YYYY-MM-DD"),
			end: dayjs(value.endDate).format("YYYY-MM-DD"),
		});
	},
	setWebsiteLink({commit}: any, value: any) {
		commit("setWebsiteLink", value);
	},
	resetState({commit}) {
		commit("resetState");
	},
	resetStatusState({commit}) {
		commit("resetStatusState");
	},
};

const mutations = {
	getNumberOfSubscriberRequest(state: {
		status: { isNbrSubscriberLoading: boolean };
	}) {
		state.status.isNbrSubscriberLoading = true;
	},
	getNumberOfSubscriberSuccess(state: {
		status: { isNbrSubscriberLoading: boolean };
	}) {
		state.status.isNbrSubscriberLoading = false;
	},
	getNumberOfSubscriberFailure(state: {
		status: { isNbrSubscriberLoading: boolean };
	}) {
		state.status.isNbrSubscriberLoading = false;
	},
	getRetrieveListingsRequest(state: {
		status: { isRetrieveListingsLoading: boolean };
	}) {
		state.status.isRetrieveListingsLoading = true;
	},
	getRetrieveListingsSuccess(state: {
		status: {
			isRetrieveListingsLoading: boolean;
			isRetrieveListingsFailure: boolean;
		};
	}) {
		state.status.isRetrieveListingsLoading = false;
		state.status.isRetrieveListingsFailure = false;
	},
	getRetrieveListingsFailure(state: {
		status: {
			isRetrieveListingsLoading: boolean;
			isRetrieveListingsFailure: boolean;
		};
	}) {
		state.status.isRetrieveListingsLoading = false;
		state.status.isRetrieveListingsFailure = true;
	},
	getUberallAutologinRequest(state: {
		status: { isUberallAutologinLoading: boolean };
	}) {
		state.status.isUberallAutologinLoading = true;
	},
	getUberallAutologinSuccess(state: {
		status: {
			isUberallAutologinLoading: boolean;
			isUberallAutologinFailure: boolean;
		};
	}) {
		state.status.isUberallAutologinLoading = false;
		state.status.isUberallAutologinFailure = false;
	},
	getUberallAutologinFailure(state: {
		status: {
			isUberallAutologinLoading: boolean;
			isUberallAutologinFailure: boolean;
		};
	}) {
		state.status.isUberallAutologinLoading = false;
		state.status.isUberallAutologinFailure = true;
	},
	setIsVisibilityOfferBeforeUberall(
		state: { status: { isVisibilityOfferBeforeUberall: any } },
		value: any
	) {
		state.status.isVisibilityOfferBeforeUberall = value;
	},
	// getSalesforceAccount
	getSalesforceAccountRequest(state: {
		status: { isSalesforceAccountLoading: boolean };
	}) {
		state.status.isSalesforceAccountLoading = true;
	},
	getSalesforceAccountSuccess(
		state: {
			salesforce: { account: { [x: string]: any } };
			websiteLink: any;
			status: { isSalesforceAccountLoading: boolean };
		},
		{account}: any
	) {
		Object.keys(state.salesforce.account).forEach((key) => {
			state.salesforce.account[key] = account[key];
		});

		let website = account.Site_Local_fr__c
			? account.Site_Local_fr__c
			: account.Website;
		if (website) {
			website = website.replace("www.", "");
			if (!website.includes("http")) {
				website = "http://" + website;
			}
		} else {
			website = null;
		}
		// change to commit
		state.websiteLink = website;
		state.status.isSalesforceAccountLoading = false;
	},
	getSalesforceAccountFailure(state: {
		status: { isSalesforceAccountLoading: boolean };
	}) {
		state.status.isSalesforceAccountLoading = false;
	},
	// getSalesforceTask
	getSalesforceTaskRequest(state: {
		status: { isSalesforceTaskLoading: boolean };
	}) {
		state.status.isSalesforceTaskLoading = true;
	},
	getSalesforceTaskSuccess(state: {
		status: { isSalesforceTaskLoading: boolean };
	}) {
		state.status.isSalesforceTaskLoading = false;
	},
	getSalesforceTaskFailure(state: {
		status: { isSalesforceTaskLoading: boolean };
	}) {
		state.status.isSalesforceTaskLoading = false;
	},
	// getSalesforceContact
	getSalesforceContactRequest(state: {
		status: { isSalesforceContactLoading: boolean };
	}) {
		state.status.isSalesforceContactLoading = true;
	},
	getSalesforceContactSuccess(
		state: {
			status: { isSalesforceContactLoading: boolean };
			salesforce: {
				contact: {
					Id: any;
					Birthdate: any;
					Email: any;
					FirstName: any;
					LastName: any;
					MobilePhone: any;
					Phone: any;
				};
			};
		},
		{contact}: any
	) {
		state.status.isSalesforceContactLoading = false;
		state.salesforce.contact = {
			Id: contact.Id,
			Birthdate: contact.Birthdate,
			Email: contact.Email,
			FirstName: contact.FirstName,
			LastName: contact.LastName,
			MobilePhone: contact.MobilePhone,
			Phone: contact.Phone,
		};
	},
	getSalesforceContactFailure(state: {
		status: { isSalesforceContactLoading: boolean };
	}) {
		state.status.isSalesforceContactLoading = false;
	},
	// getSalesforceOpportunities
	getSalesforceOpportunitiesRequest(state: {
		status: { isSalesforceOpportunitiesLoading: boolean };
	}) {
		state.status.isSalesforceOpportunitiesLoading = true;
	},
	getSalesforceOpportunitiesSuccess(state: {
		status: { isSalesforceOpportunitiesLoading: boolean };
	}) {
		state.status.isSalesforceOpportunitiesLoading = false;
	},
	getSalesforceOpportunitiesFailure(state: {
		status: { isSalesforceOpportunitiesLoading: boolean };
	}) {
		state.status.isSalesforceOpportunitiesLoading = false;
	},
	// getSalesforceDocuments
	getSalesforceDocumentsRequest(state: {
		status: { isSalesforceDocumentsLoading: boolean };
	}) {
		state.status.isSalesforceDocumentsLoading = true;
	},
	getSalesforceDocumentsSuccess(
		state: {
			status: { isSalesforceDocumentsLoading: boolean };
			documents: any;
		},
		{documents}: any
	) {
		state.status.isSalesforceDocumentsLoading = false;
		state.documents = documents;
	},
	getSalesforceDocumentsFailure(state: {
		status: { isSalesforceDocumentsLoading: boolean };
	}) {
		state.status.isSalesforceDocumentsLoading = false;
	},
	// getSalesforceTask
	getPartnerLoadingRequest(state: { partner: { isPartnerLoading: boolean } }) {
		state.partner.isPartnerLoading = true;
	},
	getPartnerLoadingSuccess(state: { partner: { isPartnerLoading: boolean } }) {
		state.partner.isPartnerLoading = false;
	},
	getPartnerLoadingFailure(state: { partner: { isPartnerLoading: boolean } }) {
		state.partner.isPartnerLoading = false;
	},
	setPartnerLoaded(state: { partner: { loaded: any } }, partner: any) {
		state.partner.loaded = partner;
	},
	// uploadDropboxFile
	uploadDropboxFileRequest(state: {
		status: { isUploadingDropboxFileSending: boolean };
	}) {
		state.status.isUploadingDropboxFileSending = true;
	},
	uploadDropboxFileSuccess(state: {
		status: { isUploadingDropboxFileSending: boolean };
	}) {
		state.status.isUploadingDropboxFileSending = false;
	},
	uploadDropboxFileFailure(state: {
		status: { isUploadingDropboxFileSending: boolean };
	}) {
		state.status.isUploadingDropboxFileSending = false;
	},
	// getMostRecentFolder
	getMostRecentFolderPathRequest(state: {
		status: { hasMostRecentFolder: boolean; isGetRecentFolderLoading: boolean };
	}) {
		state.status.hasMostRecentFolder = true;
		state.status.isGetRecentFolderLoading = true;
	},
	getMostRecentFolderPathSuccess(state: {
		status: { hasMostRecentFolder: boolean; isGetRecentFolderLoading: boolean };
	}) {
		state.status.hasMostRecentFolder = false;
		state.status.isGetRecentFolderLoading = false;
	},
	getMostRecentFolderPathFailure(state: {
		status: { hasMostRecentFolder: boolean; isGetRecentFolderLoading: boolean };
	}) {
		state.status.hasMostRecentFolder = false;
		state.status.isGetRecentFolderLoading = false;
	},
	// downloadDropboxFile
	downloadDropboxFileRequest(state: {
		status: { isDownloadingDropboxFileSending: boolean };
	}) {
		state.status.isDownloadingDropboxFileSending = true;
	},
	downloadDropboxFileSuccess(state: {
		status: { isDownloadingDropboxFileSending: boolean };
	}) {
		state.status.isDownloadingDropboxFileSending = false;
	},
	downloadDropboxFileFailure(state: {
		status: { isDownloadingDropboxFileSending: boolean };
	}) {
		state.status.isDownloadingDropboxFileSending = false;
	},
	// createSalesforceTicket
	createSalesforceTicketRequest(state: {
		status: { isSalesforceTicketCreating: boolean };
	}) {
		state.status.isSalesforceTicketCreating = true;
	},
	createSalesforceTicketSuccess(state: {
		status: { isSalesforceTicketCreating: boolean };
	}) {
		state.status.isSalesforceTicketCreating = false;
	},
	createSalesforceTicketFailure(state: {
		status: { isSalesforceTicketCreating: boolean };
	}) {
		state.status.isSalesforceTicketCreating = false;
	},
	// updateSalesforceTicket
	updateSalesforceTicketRequest(state: {
		status: { isSalesforceTicketUpdating: boolean };
	}) {
		state.status.isSalesforceTicketUpdating = true;
	},
	updateSalesforceTicketSuccess(state: {
		status: { isSalesforceTicketUpdating: boolean };
	}) {
		state.status.isSalesforceTicketUpdating = false;
	},
	updateSalesforceTicketFailure(state: {
		status: { isSalesforceTicketUpdating: boolean };
	}) {
		state.status.isSalesforceTicketUpdating = false;
	},
	// sendSalesforceTicketAttachment
	sendSalesforceTicketAttachmentRequest(state: {
		status: { isSalesforceTicketAttachmentSending: boolean };
	}) {
		state.status.isSalesforceTicketAttachmentSending = true;
	},
	sendSalesforceTicketAttachmentSuccess(state: {
		status: { isSalesforceTicketAttachmentSending: boolean };
	}) {
		state.status.isSalesforceTicketAttachmentSending = false;
	},
	sendSalesforceTicketAttachmentFailure(state: {
		status: { isSalesforceTicketAttachmentSending: boolean };
	}) {
		state.status.isSalesforceTicketAttachmentSending = false;
	},
	setSalesforceInformation(state: { salesforce: any }, salesforce: any) {
		state.salesforce = salesforce;
	},
	setOpportunities(
		state: { salesforce: { opportunities: any } },
		opportunities: any
	) {
		state.salesforce.opportunities = opportunities;
	},
	setAdplorerInformation(state: { adplorer: any }, adplorer: any) {
		state.adplorer = adplorer;
	},
	// s3Upload
	s3UploadRequest(state: { status: { isS3Uploading: boolean } }) {
		state.status.isS3Uploading = true;
	},
	s3UploadSuccess(state: { status: { isS3Uploading: boolean } }) {
		state.status.isS3Uploading = false;
	},
	s3UploadFailure(state: { status: { isS3Uploading: boolean } }) {
		state.status.isS3Uploading = false;
	},
	// getSalesforceTicket
	getSalesforceTicketRequest(state: {
		status: { isSalesforceTicketLoading: boolean };
	}) {
		state.status.isSalesforceTicketLoading = true;
	},
	getSalesforceTicketSuccess(state: {
		status: { isSalesforceTicketLoading: boolean };
	}) {
		state.status.isSalesforceTicketLoading = false;
	},
	getSalesforceTicketFailure(state: {
		status: { isSalesforceTicketLoading: boolean };
	}) {
		state.status.isSalesforceTicketLoading = false;
	},
	// getSalesforceTickets
	getSalesforceTicketsRequest(state: {
		status: { isSalesforceTicketsLoading: boolean };
	}) {
		state.status.isSalesforceTicketsLoading = true;
	},
	getSalesforceTicketsSuccess(
		state: {
			status: { isSalesforceTicketsLoading: boolean };
			salesforceTickets: any;
		},
		{tickets}: any
	) {
		state.status.isSalesforceTicketsLoading = false;
		state.salesforceTickets = tickets;
	},
	getSalesforceTicketsFailure(state: {
		status: { isSalesforceTicketsLoading: boolean };
	}) {
		state.status.isSalesforceTicketsLoading = false;
	},
	// loadSalesforceTicketThread
	loadSalesforceTicketThreadRequest(state: {
		status: { isSalesforceTicketThreadLoading: boolean };
	}) {
		state.status.isSalesforceTicketThreadLoading = true;
	},
	loadSalesforceTicketThreadSuccess(
		state: {
			status: { isSalesforceTicketThreadLoading: boolean };
			salesforceTicketThread: any;
		},
		{thread}: any
	) {
		state.status.isSalesforceTicketThreadLoading = false;
		state.salesforceTicketThread = thread;
	},
	loadSalesforceTicketThreadFailure(state: {
		status: { isSalesforceTicketThreadLoading: boolean };
	}) {
		state.status.isSalesforceTicketThreadLoading = false;
	},
	// sendNewBillingInfoMail
	sendNewBillingInfoMailRequest(state: {
		status: { isNewBillingInfoSending: boolean };
	}) {
		state.status.isNewBillingInfoSending = true;
	},
	sendNewBillingInfoMailSuccess(state: {
		status: { isNewBillingInfoSending: boolean };
	}) {
		state.status.isNewBillingInfoSending = false;
	},
	sendNewBillingInfoMailFailure(state: {
		status: { isNewBillingInfoSending: boolean };
	}) {
		state.status.isNewBillingInfoSending = false;
	},
	// sendDropboxNotification
	sendDropboxNotificationRequest(state: {
		status: { isNewDropobNotification: boolean };
	}) {
		state.status.isNewDropobNotification = true;
	},
	sendDropboxNotificationSuccess(state: {
		status: { isNewDropobNotification: boolean };
	}) {
		state.status.isNewDropobNotification = false;
	},
	sendDropboxNotificationFailure(state: {
		status: { isNewDropobNotification: boolean };
	}) {
		state.status.isNewDropobNotification = false;
	},
	// notifyUploadedFiles
	notifyUploadedFilesRequest(state: {
		status: { isNotifyingUploadedFiles: boolean };
	}) {
		state.status.isNotifyingUploadedFiles = true;
	},
	notifyUploadedFilesSuccess(state: {
		status: { isNotifyingUploadedFiles: boolean };
	}) {
		state.status.isNotifyingUploadedFiles = false;
	},
	notifyUploadedFilesFailure(state: {
		status: { isNotifyingUploadedFiles: boolean };
	}) {
		state.status.isNotifyingUploadedFiles = false;
	},
	// contactMessages
	getContactMessagesRequest(state: {
		status: { isContactMessagesLoading: boolean };
	}) {
		state.status.isContactMessagesLoading = true;
	},
	getContactMessagesSuccess(state: {
		status: { isContactMessagesLoading: boolean };
	}) {
		state.status.isContactMessagesLoading = false;
	},
	getContactMessagesFailure(state: {
		status: { isContactMessagesLoading: boolean };
	}) {
		state.status.isContactMessagesLoading = false;
	},
	// countContactMessages
	getCountContactMessagesRequest(state: {
		status: { isCountContactMessagesLoading: boolean };
	}) {
		state.status.isCountContactMessagesLoading = true;
	},
	getCountContactMessagesSuccess(state: {
		status: { isCountContactMessagesLoading: boolean };
	}) {
		state.status.isCountContactMessagesLoading = false;
	},
	getCountContactMessagesFailure(state: {
		status: { isCountContactMessagesLoading: boolean };
	}) {
		state.status.isCountContactMessagesLoading = false;
	},
	// sendResetPasswordMail
	sendResetPasswordMailRequest(state: {
		status: { isPasswordResetting: boolean };
	}) {
		state.status.isPasswordResetting = true;
	},
	sendResetPasswordMailSuccess(state: {
		status: { isPasswordResetting: boolean };
	}) {
		state.status.isPasswordResetting = false;
	},
	sendResetPasswordMailFailure(state: {
		status: { isPasswordResetting: boolean };
	}) {
		state.status.isPasswordResetting = false;
	},
	// PaymentModes
	getPaymentModesRequest(state: {
		status: { isPaymentModesLoading: boolean };
	}) {
		state.status.isPaymentModesLoading = true;
	},
	getPaymentModesSuccess(state: {
		status: { isPaymentModesLoading: boolean };
	}) {
		state.status.isPaymentModesLoading = false;
	},
	getPaymentModesFailure(state: {
		status: { isPaymentModesLoading: boolean };
	}) {
		state.status.isPaymentModesLoading = false;
	},
	// Languages
	getLanguagesRequest(state: { status: { isLanguagesLoading: boolean } }) {
		state.status.isLanguagesLoading = true;
	},
	getLanguagesSuccess(state: { status: { isLanguagesLoading: boolean } }) {
		state.status.isLanguagesLoading = false;
	},
	getLanguagesFailure(state: { status: { isLanguagesLoading: boolean } }) {
		state.status.isLanguagesLoading = false;
	},
	// Portals
	getPortalsRequest(state: { status: { isPortalsLoading: boolean } }) {
		state.status.isPortalsLoading = true;
	},
	getPortalsSuccess(state: { status: { isPortalsLoading: boolean } }) {
		state.status.isPortalsLoading = false;
	},
	getPortalsFailure(state: { status: { isPortalsLoading: boolean } }) {
		state.status.isPortalsLoading = false;
	},
	togglePasswordResetForm(
		state: { status: { passwordResetForm: any } },
		value: any
	) {
		state.status.passwordResetForm = value;
	},
	toggleIsPageLoading(state: { status: { isPageLoading: any } }, value: any) {
		state.status.isPageLoading = value;
	},
	isFilesSubmitting(state: { status: { isFilesSubmitting: any } }, value: any) {
		state.status.isFilesSubmitting = value;
	},
	toggleIsLocalBoost(state: { status: { isLocalBoost: any } }, value: any) {
		state.status.isLocalBoost = value;
	},
	toggleIsLocalStart(state: { status: { isLocalStart: any } }, value: any) {
		state.status.isLocalStart = value;
	},
	toggleIsLocalWeb(state: { status: { isLocalWeb: any } }, value: any) {
		state.status.isLocalWeb = value;
	},
	toggleIsLocalPresence(
		state: { status: { isLocalPresence: any } },
		value: any
	) {
		state.status.isLocalPresence = value;
	},
	toggleIsWebtool(state: { status: { isWebtool: any } }, value: any) {
		state.status.isWebtool = value;
	},
	toggleIsToolbox(state: { status: { isToolbox: any } }, value: any) {
		state.status.isToolbox = value;
	},
	toggleIsEcommerce(state: { status: { isEcommerce: any } }, value: any) {
		state.status.isEcommerce = value;
	},
	toggleIsLocalShop(state: { status: { isLocalShop: any } }, value: any) {
		state.status.isLocalShop = value;
	},
	toggleIsLocalShopWithMigration(
		state: { status: { isLocalShopWithMigration: any } },
		value: any
	) {
		state.status.isLocalShopWithMigration = value;
	},
	toggleIsUbiflow(state: { status: { isUbiflow: any } }, value: any) {
		state.status.isUbiflow = value;
	},
	toggleIsLocalAuto(state: { status: { isLocalAuto: any } }, value: any) {
		state.status.isLocalAuto = value;
	},
	toggleIsLocalAutoPlus(
		state: { status: { isLocalAutoPlus: any } },
		value: any
	) {
		state.status.isLocalAutoPlus = value;
	},
	toggleIsLocalImmo(state: { status: { isLocalImmo: any } }, value: any) {
		state.status.isLocalImmo = value;
	},
	toggleIsLocalImmoPlus(
		state: { status: { isLocalImmoPlus: any } },
		value: any
	) {
		state.status.isLocalImmoPlus = value;
	},
	toggleIsLocalHotel(state: { status: { isLocalHotel: any } }, value: any) {
		state.status.isLocalHotel = value;
	},
	toggleIsLocalResto(state: { status: { isLocalResto: any } }, value: any) {
		state.status.isLocalResto = value;
	},
	toggleIsLocalRestoBoutique(
		state: { status: { isLocalRestoBoutique: any } },
		value: any
	) {
		state.status.isLocalRestoBoutique = value;
	},
	toggleIsNewLocalResto(
		state: { status: { isNewLocalResto: any } },
		value: any
	) {
		state.status.isNewLocalResto = value;
	},
	toggleIsLocalBoutique(
		state: { status: { isLocalBoutique: any } },
		value: any
	) {
		state.status.isLocalBoutique = value;
	},
	toggleIsNewLocalBoutique(
		state: { status: { isNewLocalBoutique: any } },
		value: any
	) {
		state.status.isNewLocalBoutique = value;
	},
	toggleIsOldLocalBoutique(
		state: { status: { isOldLocalBoutique: any } },
		value: any
	) {
		state.status.isOldLocalBoutique = value;
	},
	toggleIsLocalAgenda(state: { status: { isLocalAgenda: any } }, value: any) {
		state.status.isLocalAgenda = value;
	},
	toggleWebsiteInfoDisabled(
		state: { status: { websiteInfoDisabled: any } },
		value: any
	) {
		state.status.websiteInfoDisabled = value;
	},
	toggleUpdateWebsiteDisabled(
		state: { status: { updateWebsiteDisabled: any } },
		value: any
	) {
		state.status.updateWebsiteDisabled = value;
	},
	toggleIsWebsiteOnline(
		state: { status: { isWebsiteOnline: any } },
		value: any
	) {
		state.status.isWebsiteOnline = value;
	},
	setWebsitePublicationDate(
		state: { websitePublicationDate: any },
		value: any
	) {
		state.websitePublicationDate = value;
	},
	setLatestAppointmentBriefInfo(
		state: {
			salesforce: { brief: { date: any; callResult: any; ownerName: any } };
		},
		briefInfo: {
			ActivityDateTime: any;
			R_sultat_d_appel__c: any;
			Owner: { Name: any };
		}
	) {
		if (!briefInfo) {
			return;
		}
		state.salesforce.brief.date = briefInfo.ActivityDateTime;
		state.salesforce.brief.callResult = briefInfo.R_sultat_d_appel__c;
		state.salesforce.brief.ownerName = briefInfo.Owner.Name;
	},
	setSalesforceBriefAppointmentInfoLoadingRequest(state: {
		status: { isSalesforceBriefAppointmentInfoLoading: boolean };
	}) {
		state.status.isSalesforceBriefAppointmentInfoLoading = true;
	},
	setSalesforceBriefAppointmentInfoLoadingSuccess(state: {
		status: { isSalesforceBriefAppointmentInfoLoading: boolean };
	}) {
		state.status.isSalesforceBriefAppointmentInfoLoading = false;
	},
	setSalesforceBriefAppointmentInfoLoadingFailure(state: {
		status: { isSalesforceBriefAppointmentInfoLoading: boolean };
	}) {
		state.status.isSalesforceBriefAppointmentInfoLoading = false;
	},
	setDocuments(state: { documents: any }, documents: any) {
		state.documents = documents;
	},
	setWebsiteLink(state: { websiteLink: any }, websiteLink: any) {
		state.websiteLink = websiteLink;
	},
	setFilterAudienceValue(state: { filterAudienceRange: any }, value: any) {
		state.filterAudienceRange = value;
	},
	setPartnerUrl(state: { partner: { url: any } }, partnerUrl: any) {
		state.partner.url = partnerUrl;
	},
	setToolBoxPartnerUrl(
		state: { partner: { toolBoxUrl: any } },
		toolBoxUrl: any
	) {
		state.partner.toolBoxUrl = toolBoxUrl;
	},
	setPartnerBoutiqueUrl(
		state: { partner: { boutiqueUrl: any } },
		boutiqueUrl: any
	) {
		state.partner.boutiqueUrl = boutiqueUrl;
	},
	setUbiflowUrl(state: { ubiflowLink: any }, ubiflowUrl: any) {
		state.ubiflowLink = ubiflowUrl;
	},
	setHasSharedSpaceAccess(
		state: { status: { hasSharedSpaceAccess: any } },
		hasSharedSpaceAccess: any
	) {
		state.status.hasSharedSpaceAccess = hasSharedSpaceAccess;
	},
	setHasPartnerFolderAccess(
		state: { status: { hasPartnerFolderAccess: any } },
		hasPartnerFolderAccess: any
	) {
		state.status.hasPartnerFolderAccess = hasPartnerFolderAccess;
	},
	setAtInternetVisitsData(
		state: { atInternetVisitsData: any; status: { isLoadingVisits: boolean } },
		data: any
	) {
		state.atInternetVisitsData = Object.assign({}, data);
		state.status.isLoadingVisits = false;
	},
	loadAtInternetVisitsDataRequest(state: {
		status: { isLoadingVisits: boolean };
	}) {
		state.status.isLoadingVisits = true;
	},
	loadAtInternetSourcesDataDone(state: {
		status: { isLoadingSources: boolean };
	}) {
		state.status.isLoadingSources = false;
	},
	loadAtInternetVisitsDataDone(state: {
		status: { isLoadingVisits: boolean };
	}) {
		state.status.isLoadingVisits = false;
	},
	loadAtInternetSourcesDataRequest(state: {
		status: { isLoadingSources: boolean };
	}) {
		state.status.isLoadingSources = true;
	},
	setAtInternetSourceData(
		state: { status: { isLoadingSources: boolean }; atInternetSourceData: any },
		data: any
	) {
		state.status.isLoadingSources = false;
		state.atInternetSourceData = data;
	},
	resetPartnerOffers(state: { offers: never[] }) {
		state.offers = [];
	},
	toggleHasVisibility(state: { partner: { hasVisibility: any } }, value: any) {
		state.partner.hasVisibility = value;
	},
	setOffers(state: { offers: any }, offers: any) {
		state.offers = offers;
	},
	addOffer(state: { offers: any[] }, offer: any) {
		state.offers.push(offer);
	},
	setPaymentModes(state: { paymentModes: any }, paymentModes: any) {
		state.paymentModes = paymentModes;
	},
	setLanguages(state: { languages: any }, languages: any) {
		state.languages = languages;
	},
	setPortals(state: { portals: any }, portals: any) {
		state.portals = portals;
	},
	setUberallListing(
		state: { uberall: { listingsLength: any; listingsTab: any } },
		listings: string | any[]
	) {
		state.uberall.listingsLength = listings.length;
		state.uberall.listingsTab = listings;
	},
	setNumberOfSubscribers(
		state: { webtool: { newsletter: { nbrUser: any } } },
		count: any
	) {
		state.webtool.newsletter.nbrUser = count;
	},
	setSubscribers(
		state: { webtool: { newsletter: { userList: any } } },
		list: any
	) {
		state.webtool.newsletter.userList = list;
	},
	setSalesforceTask(state: { salesforce: { task: any } }, task: any) {
		state.salesforce.task = task;
	},
	setDpValidated(
		state: {
			salesforce: { dpValidated: { canEdit: any; validatedDpDate: any } };
		},
		dpValidated: { canEdit: any; validatedDpDate: any }
	) {
		console.log('setDpValidated', dpValidated);
		state.salesforce.dpValidated.canEdit = dpValidated.canEdit;
		state.salesforce.dpValidated.validatedDpDate = dpValidated.validatedDpDate;
	},
	setAgendaVisio(
		state: { salesforce: { agenda: { visio: any } } },
		value: any
	) {
		state.salesforce.agenda.visio = value;
	},
	setAgendaCrm(state: { salesforce: { agenda: { crm: any } } }, value: any) {
		state.salesforce.agenda.crm = value;
	},
	setAgendaOnline(
		state: { salesforce: { agenda: { online: any } } },
		value: any
	) {
		state.salesforce.agenda.online = value;
	},
	setOpportunity(
		state: { salesforce: { opportunity: {} } },
		{opportunity}: any
	) {
		if (!opportunity) {
			opportunity = getInitialState().salesforce.opportunity;
		}
		if (!state.salesforce.opportunity) {
			state.salesforce.opportunity = {};
		}
		Object.assignRecursive(state.salesforce.opportunity, opportunity);
	},
	setTaskTracking(
		state: { salesforce: { taskTracking: {} } },
		{taskTracking}: any
	) {
		if (!taskTracking) {
			taskTracking = getInitialState().salesforce.taskTracking;
		}
		if (!state.salesforce.taskTracking) {
			state.salesforce.taskTracking = {};
		}
		Object.assignRecursive(state.salesforce.taskTracking, taskTracking);
	},
	isProductionValidated(
		state: { status: { isSalesforceProductionValidated: any } },
		value: any
	) {
		state.status.isSalesforceProductionValidated = value;
	},
	isQrcodeEnabled(state: { status: { isQrcodeEnabled: any } }, value: any) {
		state.status.isQrcodeEnabled = value;
	},
	setReportHasBeenSent(
		state: { status: { reportHasBeenSent: any } },
		value: any
	) {
		state.status.reportHasBeenSent = value;
	},
	// getRib
	getRibRequest(state: { status: { isRibLoading: boolean } }) {
		state.status.isRibLoading = true;
	},
	getRibSuccess(
		state: { status: { isRibLoading: boolean }; partner: { hasRib: any } },
		{hasRib}: any
	) {
		state.status.isRibLoading = false;
		state.partner.hasRib = hasRib;
	},
	getRibFailure(state: { status: { isRibLoading: boolean } }) {
		state.status.isRibLoading = false;
	},
	connectToAtInternetRequest(state: {
		status: { isConnectingToAtInternet: boolean };
	}) {
		state.status.isConnectingToAtInternet = true;
	},
	connectToAtInternetSuccess(
		state: {
			atInternetInformation: any;
			status: { isConnectingToAtInternet: boolean };
		},
		data: any
	) {
		state.atInternetInformation = data;
		state.status.isConnectingToAtInternet = false;
	},
	connectToAtInternetFailure(state: {
		status: { isConnectingToAtInternet: boolean };
	}) {
		state.status.isConnectingToAtInternet = false;
	},
	// options
	toggleHasLogoCreation(
		state: { status: { hasLogoCreation: any } },
		value: any
	) {
		state.status.hasLogoCreation = value;
	},
	toggleHasPhotosReport10(
		state: { status: { hasPhotosReport10: any } },
		value: any
	) {
		state.status.hasPhotosReport10 = value;
	},
	toggleHasPhotosReport20(
		state: { status: { hasPhotosReport20: any } },
		value: any
	) {
		state.status.hasPhotosReport20 = value;
	},
	toggleHasVirtualVisit(
		state: { status: { hasVirtualVisit: any } },
		value: any
	) {
		state.status.hasVirtualVisit = value;
	},
	toggleHasPhotosVideoReport10(
		state: { status: { hasPhotosVideoReport10: any } },
		value: any
	) {
		state.status.hasPhotosVideoReport10 = value;
	},
	toggleHasAdwordsCampaign(
		state: { status: { hasAdwordsCampaign: any } },
		value: any
	) {
		state.status.hasAdwordsCampaign = value;
	},
	isDropboxEmailSent(
		state: { status: { isDropboxEmailSent: any } },
		value: any
	) {
		state.status.isDropboxEmailSent = value;
	},
	mostRecentFolderPath(
		state: {
			status: {
				mostRecentFolder: { path: any; multipleFolders: any; message: any };
				hasMostRecentFolder: any;
			};
		},
		value: {
			path: any;
			multipleFolders: any;
			message: any;
			hasMostRecentFolder: any;
		}
	) {
		state.status.mostRecentFolder = {
			path: value.path,
			multipleFolders: value.multipleFolders,
			message: value.message,
		};
		state.status.hasMostRecentFolder = value.hasMostRecentFolder;
	},
	resetState(state: any) {
		//Object.assignRecursive(state, getInitialState());
	},
	resetStatusState(state: { status: any }) {
		// Object.assignRecursive(state.status, {
		// 	...state.status,
		// 	...getInitialStatusState(),
		// });
	},
};

export const globalStore = {
	namespaced: true,
	state,
	actions,
	mutations,
};
