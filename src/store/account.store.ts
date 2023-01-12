import router from "@/router";
import {userService, localfrApiService, salesforceService} from "@/services";
import {
	normalizer,
	authDpHelper,
	getParsedLocalStorageItem,
	getLocalStorageItem,
} from "@/helpers";
import {partnerFolderRelations, siteRelations} from "@/Interface/partnershipFolderDatas";

import type {PfPreviewInformation, Status} from "./typings/accountStore";

const user = getParsedLocalStorageItem("user");
const identity: any = getParsedLocalStorageItem("identity");
const salesforceUser: any  = getParsedLocalStorageItem("salesforceUser");
const currentPartner: any = identity && identity.partners ? identity.partners[0] : null;
const partnerHistoryContext = getParsedLocalStorageItem("partnerHistoryContext") || {};
const impersonatedUser = getParsedLocalStorageItem("impersonatedUser");
const initialLogoutModal = {
	refreshTokenTtl: null,
	refreshTokenTtlState: null,
	isShowLogoutModal: false,
};

const pfPreviewInformation = {
	isPreview: false,
	stepOwner: null,
	creationDate: null,
	updateDate: null,
	userFullname: null,
} as PfPreviewInformation;

// STATE
const state = user
	? {
		status: {
			loggedIn: true,
			isStopEditing: false,
			impersonated: impersonatedUser !== null,
			performanceCookie: null,
			targetingCookie: null,
			isPartnerHistoryLoading: false,
			isSalesforceUsersLoading: {},
			logoutModal: {}
		} as Status,
		pfPreviewInformation,
		timelineSteps: [],
		user,
		salesforceUser,
		salesforceUsers: [],
		identity,
		impersonatedUser,
		currentPartner,
		partnerHistoryContext,
		currentPartnerFolderSnapshot: null,
		selectedOpportunityFolder: null,
	}
	: {
		status: {
			isStopEditing: false,
			impersonated: impersonatedUser !== null,
			performanceCookie: null,
			targetingCookie: null,
			isPartnerHistoriesLoading: false,
			isSalesforceUsersLoading: {},
			logoutModal: {}
		} as Status,
		user: null,
		salesforceUser: null, //
		salesforceUsers: [],
		timelineSteps: [],
		pfPreviewInformation,
		identity,
		impersonatedUser,
		currentPartner,
		partnerHistoryContext,
		currentPartnerFolderSnapshot: null,
		selectedOpportunityFolder: null,
	};

state.status.logoutModal = initialLogoutModal;

const initializeEntityRelations = function (
	entity: { [x: string]: {}[] },
	relations: any[]
) {
	relations.forEach((key: string | number) => {
		if (!entity[key] || !entity[key].length) {
			entity[key] = [{}];
		}
	});
};

const getOpeningRanges = function (
	parentEntityName: string,
	openingRange: { agendaMember: { [x: string]: any } }
) {
	switch (true) {
		case "partner" === parentEntityName:
			return state.currentPartnerFolder.openingRanges;
		case "agenda" === parentEntityName:
			return state.currentPartnerFolder.agenda.appointmentTimeRanges;
		case "agendaMember" === parentEntityName:
			return state.currentPartnerFolder.agenda.agendaMembers.find(
				(item: { [x: string]: any }) =>
					item["@id"] === openingRange.agendaMember ||
					item["@id"] === openingRange.agendaMember["@id"]
			).appointmentTimeRanges;
		case "partnerHotelResto" === parentEntityName:
			return state.currentPartnerFolder.partnerHotelResto.openingRanges;
		default:
			return [];
	}
};

const getDeliveryModes = function (parentEntityName: string) {
	switch (true) {
		case "partner" === parentEntityName:
			return state.currentPartnerFolder.deliveryModes;
		case "partnerHotelResto" === parentEntityName:
			return state.currentPartnerFolder.partnerHotelResto.deliveryModes;
		default:
			return [];
	}
};

function fillEntity(
	stateEntity: { [x: string]: any },
	entityValue: { [x: string]: any }
) {
	Object.keys(entityValue).forEach((offset) => {
		stateEntity[offset] = entityValue[offset];
	});
}

/**
 * ACTIONS
 */
const actions = {
	setIsStopEditing({commit}: any, value: boolean) {
		commit("setIsStopEditing", value);
	},
	previewPfHistoryStep(
		{commit, dispatch},
		{snapshot, isPreview, stepOwner, creationDate, updateDate, userFullname}
	) {
		commit("setPreviewInformation", {
			isPreview,
			stepOwner,
			creationDate,
			updateDate,
			userFullname,
		});
		commit("previewPfHistoryStep", snapshot.currentPartnerFolder);
		dispatch("globalStore/setSalesforceInformation", snapshot.salesforce, {
			root: true,
		});
	},

	changePassword({dispatch}, {userId, data, token}) {
		userService.changePassword(userId, data, token).then(
			() => {
				dispatch(
					"alert/success",
					{
						group: "mail-sent",
						message: "Votre mot de passe a été créé avec succès.",
						show: true,
						title: "Mot de passe défini",
						type: "success",
					},
					{root: true}
				);
				setTimeout(() => {
					router.push("/authentification");
				}, 4000);
			},
			(error) => {
				console.log(error);
				dispatch(
					"alert/error",
					{
						group: "auth-error",
						message: "La création du mot de passe a échoué.",
						show: true,
						title: "Impossible de créer le mot de passe",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},

	impersonateLogin({dispatch, commit}, {userId, username}) {
		commit("impersonateLoginRequest", {username});

		// Clear current impersoanting information
		userService.impersonateLogout();
		commit("impersonateLogout");
		dispatch("globalStore/resetState", {}, {root: true});

		userService.impersonateLogin(userId, username).then(
			(accessToken) => {
				userService.me().then(
					(me) => {
						commit("impersonateLoginSuccess", {
							impersonatedUser: me,
							accessToken: accessToken,
						});
						return dispatch(
							"globalStore/loadSalesforceData",
							{
								identity: me,
								currentPartner: me.partners ? me.partners[0] : null,
							},
							{root: true}
						);
					},
					(error) => {
						console.error(error);
					}
				);
			},
			(error) => {
				console.error("Impersonation error");
				console.error(error);
				if (
					state.identity &&
					state.identity.roles &&
					state.identity.roles.includes("ROLE_CLIENT")
				) {
					dispatch(
						"alert/warn",
						{
							group: "auth-error",
							message: `Vous êtes actuellement connecté avec le compte d'un partenaire (<strong>${state.identity.name} / ${state.identity.email}</strong>).
<br>Veuillez vous reconnecter avec vos identifiants <strong>LOCAL.FR</strong>.`,
							show: true,
							title: "Erreur d'impersonnalisation",
							type: "error",
							duration: 30000,
						},
						{root: true}
					);
				}
			}
		);
	},

	impersonateLogout({dispatch, commit}) {
		userService.impersonateLogout();
		return userService.me().then(
			(me) => {
				commit("impersonateLogout");
				dispatch("globalStore/resetState", {}, {root: true});
				dispatch("setIdentity", {identity: me});
				dispatch(
					"globalStore/loadSalesforceData",
					{identity: me},
					{root: true}
				);
			},
			(error) => {
				console.error(error);
			}
		);
	},

	login({dispatch, commit}, {username, password, next = null}) {
		commit("loginRequest", {username});

		userService.login(username, password).then(
			(user) => {
				userService.me().then(
					(me) => {
						if (me.resetPassword) {
							const errorOptions = {
								group: "auth-error",
								message:
									'Votre mot de passe a expiré. Pour des raisons de sécurité, nous vous demandons de le modifier. Pour cela, allez sur "Mot de passe oublié ?" et laissez-vous guider.',
								show: true,
								title: "Erreur de connexion",
								type: "error",
								duration: 30000,
							};

							commit("loginFailure", null);
							dispatch("alert/error", errorOptions, {root: true});
							commit("logout", null);
							localStorage.clear();
						} else {
							commit("loginSuccess", {user, me});
							dispatch("setIdentity", {identity: me});
							if (me.partners.length) {
								dispatch("setCurrentPartner", {
									currentPartner: me.partners[0],
								});
							}

							if (
								state.identity &&
								(state.identity.allowedToEdit ||
									authDpHelper.isProvider(state.identity) ||
									authDpHelper.isSalesman(state.identity) ||
									authDpHelper.isSuperAdmin(state.identity))
							) {
								if (!next || "/" === next || "/?" === next) {
									next = "/backoffice";
								}
							} else {
								if (!next) {
									next = "/accueil";
								}
							}

							router.push(next);
						}
					},
					(error) => {
						const errorOptions = {
							group: "auth-error",
							message: "Impossible de récupérer les informations utilisateur.",
							show: true,
							title: "Erreur de connexion",
							type: "error",
						};

						commit("loginFailure", error);
						dispatch("alert/error", errorOptions, {root: true});
					}
				);
			},
			(error) => {
				commit("loginFailure", error);
				dispatch(
					"alert/error",
					{
						group: "auth-error",
						message: "Votre identifiant ou votre mot de passe est erroné.",
						show: true,
						title: "Erreur de connexion",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},

	logout({dispatch, commit}) {
		dispatch("globalStore/resetState", {}, {root: true});
		userService.logout();
		commit("logout");
	},

	setRefreshTokenTtl({commit}: any, value: any) {
		commit("setRefreshTokenTtl", value);
		commit("updateRefreshTokenState", true);
		commit("isShowLogoutModal", false);
	},

	refreshTokenUpdated({commit}: any, value: any) {
		commit("updateRefreshTokenState", value);
	},

	setIsShowLogoutModal({commit}: any, value: any) {
		commit("isShowLogoutModal", value);
	},
	setPerformanceCookie({commit}: any, value: any) {
		commit("setPerformanceCookie", value);
	},
	setTargetingCookie({commit}: any, value: any) {
		commit("setTargetingCookie", value);
	},
	setIdentity({commit}, {identity}) {
		commit("setIdentity", {identity});
	},
	setCurrentPartnerFolderSnapshot({commit}: any, partnerFolderSnapshot: any) {
		commit("setCurrentPartnerFolderSnapshot", partnerFolderSnapshot);
	},

	setCurrentPartner({dispatch, commit}, {currentPartner}) {
		commit("resetPartnerHistoryContext");
		if (currentPartner) {
			console.log("ACTION : setCurrentPartner", currentPartner)
			const currentPartnerFolder =
				currentPartner.partnerFolders && currentPartner.partnerFolders.length
					? currentPartner.partnerFolders[0]
					: null;
			if (currentPartnerFolder) {
				initializeEntityRelations(currentPartnerFolder, partnerFolderRelations);
				if (currentPartnerFolder.sites && currentPartnerFolder.sites.length) {
					initializeEntityRelations(
						currentPartnerFolder.sites[0],
						siteRelations
					);
				}
			}

			commit("setCurrentPartner", {currentPartner});

			return dispatch("setPartnerHistorySteps");
		}

		return Promise.resolve(currentPartner);
	},

	setCurrentPartnerFolder({dispatch, commit, rootState}, {partnerFolder}) {
		commit("resetPartnerHistoryContext");
		if (partnerFolder) {
			initializeEntityRelations(partnerFolder, partnerFolderRelations);
			if (partnerFolder.sites && partnerFolder.sites.length) {
				initializeEntityRelations(partnerFolder.sites[0], siteRelations);
			}
		}
		commit("setCurrentPartnerFolder", partnerFolder);
		commit("setCurrentPartnerFolderSnapshot", {
			currentPartnerFolder: Object.assign({}, partnerFolder) || null,
			salesforce: rootState.globalStore.salesforce,
		});

		return dispatch("setPartnerHistorySteps", partnerFolder);
	},

	isChangedOpportunity({commit, rootState}) {
		commit("setIsStopEditing", false);
		if (1 === authDpHelper.getCurrentUserStep()) {
			const salesforce = rootState.globalStore.salesforce;
			const start = momentBusinessDays(
					momentBusinessDays
						.utc(salesforce.opportunity.CreatedDate)
						.locale("fr")
				),
				end = start.businessAdd(1),
				now = momentBusinessDays();
			commit("setIsStopEditing", !now.isBetween(start, end));
		}
	},
	async handleOpportunityFolder(
		{dispatch, commit}: any,
		opportunityFolder: {
			opportunity: string;
			partnerFolder: { opportunities: any };
		}
	) {
		console.log('handleOpportunityFolder');
		dispatch("globalStore/resetStatusState", null, {root: true});
		const opportunity = JSON.parse(opportunityFolder.opportunity);
		dispatch("globalStore/setOpportunity", opportunity, {root: true});
		dispatch(
			"getOpportunityByPartnerFolder",
			opportunityFolder.partnerFolder.opportunities
		);
		dispatch("setCurrentPartnerFolder", {
			partnerFolder: opportunityFolder.partnerFolder,
		});
		dispatch("isChangedOpportunity");
		commit("setSelectedOpportunityFolder", opportunityFolder);
	},

	async getOpportunityByPartnerFolder(
		{dispatch, commit, rootState}: any,
		opportunitiesIds: any[]
	) {
		console.log('ACCOUNT STORE : getOpportunityByPartnerFolder');
		const filterOpportunities =
			rootState.globalStore.salesforce.opportunities.filter(
				(opportunity: { Id: any }) =>
					opportunitiesIds.some(
						(opportunityId: any) => opportunityId === opportunity.Id
					)
			);
		let opportunity;
		const hasSeveralOpportunities = filterOpportunities.length > 1;
		for (const filteredOpportunity of filterOpportunities) {
			if (
				!hasSeveralOpportunities ||
				!salesforceService.isAdsOpportunity(filteredOpportunity)
			) {
				opportunity = filteredOpportunity;
			}
			await salesforceService.loadProductsFromOpportunity(
				filteredOpportunity,
				salesforceService.isAdsOpportunity(filteredOpportunity) &&
				hasSeveralOpportunities
					? "option"
					: "offer"
			);
		}

		return opportunity;
	},
	setPartnerHistorySteps({commit, state}, currentPartnerFolder: any = null) {
		if (!currentPartnerFolder) {
			return null;
		}
		currentPartnerFolder = currentPartnerFolder || state.currentPartnerFolder;
		if (state.status.isPartnerHistoriesLoading) {
			return Promise.resolve(
				(currentPartnerFolder || {}).partnerHistories || []
			);
		}

		state.status.isPartnerHistoriesLoading = true;
		const currentUserStep = authDpHelper.getCurrentUserStep();
		if (!state.status.isSalesforceUsersLoading) {
			state.status.isSalesforceUsersLoading = {};
		}
		if (!state.salesforceUsers) {
			state.salesforceUsers = {};
		}

		let partnerHistoriesPromise;
		if (currentPartnerFolder && (
			!currentPartnerFolder.partnerHistories ||
			!currentPartnerFolder.partnerHistories.length
		)

		) {
			partnerHistoriesPromise = Promise.resolve();
		}


		partnerHistoriesPromise = Promise.all(
			currentPartnerFolder.partnerHistories.map(
				(
					partnerHistory: { userId: string | number; salesforceUser: any },
					key: string | number
				) => {
					let userPromise;

					if (undefined !== state.salesforceUsers[partnerHistory.userId]) {
						userPromise = Promise.resolve(
							state.salesforceUsers[partnerHistory.userId]
						);
					} else if (
						undefined !==
						state.status.isSalesforceUsersLoading[partnerHistory.userId]
					) {
						userPromise = new Promise((resolve, reject) => {
							const timeout = setInterval(() => {
								if (
									state.status.isSalesforceUsersLoading[partnerHistory.userId]
								) {
									return;
								}
								clearInterval(timeout);
								if (state.salesforceUsers[partnerHistory.userId]) {
									resolve(state.salesforceUsers[partnerHistory.userId]);
								} else {
									reject();
								}
							}, 50);
						});
					} else {
						userPromise = salesforceService.getUser(partnerHistory.userId);
					}
					commit("salesforceUsersLoadingRequest", partnerHistory.userId);

					return userPromise
						.then(
							(user) => {
								partnerHistory.salesforceUser = user;
								currentPartnerFolder.partnerHistories[key] = partnerHistory;
								return user;
							},
							() =>
								commit("salesforceUsersLoadingFailure", partnerHistory.userId)
						)
						.catch(() =>
							commit("salesforceUsersLoadingFailure", partnerHistory.userId)
						)
						.then((user) => commit("salesforceUsersLoadingSuccess", user));
				}
			)
		);
		return partnerHistoriesPromise
			.then(() => {
				currentPartnerFolder.partnerHistories
					.sort(
						(a: { salesforceUser: any }, b: { salesforceUser: any }) =>
							authDpHelper.getUserStep(a.salesforceUser) -
							authDpHelper.getUserStep(b.salesforceUser)
					)
					.forEach((partnerHistory: { salesforceUser: any }) => {
						const user = partnerHistory.salesforceUser;
						const userStep =
							user && authDpHelper.getUserStatus(user)
								? authDpHelper.getUserStatus(user).step
								: null;
						if (userStep === currentUserStep) {
							commit("setPartnerHistoryContext", {
								current: normalizer.normalizePartnerHistory(partnerHistory),
								currentStep: userStep || null,
							});
						} else if (userStep < currentUserStep) {
							commit("setPartnerHistoryContext", {
								previous: normalizer.normalizePartnerHistory(partnerHistory),
								previousStep: userStep || null,
							});
						} else if (userStep > currentUserStep) {
							commit("setPartnerHistoryContext", {
								next: normalizer.normalizePartnerHistory(partnerHistory),
								nextStep: userStep || null,
							});
						}
					});
			})
			.then(() => {
				commit("setTimelineSteps", state.currentPartnerFolder);
				state.identity.allowedToEdit =
					(authDpHelper.canTransmitPf() || authDpHelper.canByPassRolesToUpdatePf()) &&
					!state.status.isStopEditing;
				state.status.isPartnerHistoriesLoading = false;

				return currentPartnerFolder;
			});
	},
	initializePartnerAutoImmo({commit}) {
		if (undefined === state.currentPartnerFolder.partnerAutoImmo) {
			commit("setPartnerAutoImmo", {entityValue: {}});
		}
	},
	initializePartnerHotelResto({commit}) {
		if (undefined === state.currentPartnerFolder.partnerHotelResto) {
			commit("setPartnerHotelResto", {entityValue: {}});
		}
	},
	initializePartnerBoutique({commit}) {
		if (undefined === state.currentPartnerFolder.partnerBoutique) {
			commit("setPartnerBoutique", {entityValue: {}});
		}
	},
	initializePartnerShop({commit}) {
		if (undefined === state.currentPartnerFolder.partnerShop) {
			commit("setPartnerShop", {entityValue: {}});
		}
	},
	updateIdentity({dispatch}) {
		return userService.me().then(
			(me) => {
				dispatch("setIdentity", {identity: me});
				if (me.partners.length) {
					return dispatch("setCurrentPartner", {
						currentPartner: me.partners[0],
					});
				}

				return me;
			},
			() => {
				dispatch(
					"alert/error",
					{
						group: "general-error",
						message: "Impossible de récupérer les informations utilisateur.",
						show: true,
						title: "Erreur",
						type: "error",
					},
					{root: true}
				);
			}
		);
	},
	async updatePartnerPropertyFromForm(
		{dispatch, commit, state, rootState},
		{event, provider, data, showNotification, skipPartnerHistory}
	) {
		if (provider) {
			const validation = await provider.validate(event);
			if (validation && !validation.valid) {
				return Promise.resolve();
			}
		}

		if (!data) {
			return Promise.resolve();
		}

		let value,
			offset,
			payload = {};

		if (event) {
			value = event.target.value;
			if (data.previousEditedValue === value) {
				return Promise.resolve();
			}

			const index = event.target.name.split(".");

			switch (event.target.type) {
				case "number":
					value = event.target.valueAsNumber;
					break;
			}

			if ("float" === data.type) {
				value = normalizer.floatNormalizer(event.target.value);
			}

			if ("bool" === data.type) {
				if ("checkbox" === event.target.type) {
					value = event.target.checked;
				}
				value = normalizer.booleanNormalizer(value);
			}

			offset = index.slice(-1)[0];
		} else {
			if (data.offset) {
				offset = data.offset;
				value = data.value;
			}
		}

		if (data.payload) {
			payload = data.payload;
		} else {
			switch (data.type) {
				case "int":
					value = parseInt(value);
					break;
				case "bool":
					value = normalizer.booleanNormalizer(value);
					break;
				case "float":
					value = normalizer.floatNormalizer(event.target.value);
					break;
			}

			if ("time2sec" === data.format) {
				value = normalizer.strTimeToSeconds(value);
			}

			payload[offset] = value;
		}

		const dispatchEntity = function (entityTarget: string, entityName: string) {
			const index = entityName.charAt(0).toLowerCase() + entityName.slice(1);
			if (undefined !== data[index]) {
				return dispatch(`update${entityTarget}`, {
					entityName: entityName,
					id: data[index].id || data[index].Id,
					data: payload,
					showNotification: showNotification,
					context: data,
				});
			}

			return Promise.resolve();
		};

		if (data.site && !data.site.id) {
			data.site.partnerFolder = state.currentPartnerFolder["@id"];
		}

		return Promise.all([
			// Manage entities updates
			...["Partner", "BookEngine", "Agenda"].map((entityName) =>
				dispatchEntity("PartnerEntity", entityName)
			),

			// Manage entities updates/creation
			...[
				"PartnerFolder",
				"PartnerBoutique",
				"PartnerHotelResto",
				"PartnerAutoImmo",
				"PartnerShop",
				"Site",
				"CampaignOption",
				"SiteTree",
				"Footage",
				"Banner",
				"OpeningRange",
				"SocialNetwork",
				"AgendaService",
				"AgendaResource",
				"AgendaMember",
				"AgendaVisio",
				"DeliveryMode",
				"FeeDetail",
				"PartnerHistory",
				"Note",
				"BookingService",
				"BookingTimeRange",
			].map((entityName) => {
				const offset = entityName.charAt(0).toLowerCase() + entityName.slice(1);
				if (undefined === data[offset]) {
					return;
				}
				if (data[offset].id) {
					return dispatchEntity("PartnerEntity", entityName);
				} else {
					return dispatch("createEntity", {
						entityName: entityName,
						data: data[offset],
						showNotification: showNotification,
						context: data,
					});
				}
			}),

			// Manage Salesforce data updates
			...["Account", "Contact", "Opportunity", "TaskTracking"].map(
				(entityName) => dispatchEntity("SalesforceAccount", entityName)
			),
		])
			.then((response) => response.filter((item) => item))
			.finally(() => {
				if (skipPartnerHistory) {
					return;
				}
				const currentPartner = state.currentPartner;
				const currentPartnerFolder = state.currentPartnerFolder;
				const currentSFUser = state.salesforceUser;
				const partnerHistoryContext = state.partnerHistoryContext;
				const currentUserContext = authDpHelper.getUserStatus(
					state.salesforceUser
				);
				const partnerHistories = currentPartnerFolder.partnerHistories;
				const isAllowedToByPassRolesToUpdateDP =
					authDpHelper.canByPassRolesToUpdatePf();
				let updatePartnerPromise;

				// case there's no partner histories (first time)
				if (
					(!partnerHistories || !partnerHistories.length) &&
					!isAllowedToByPassRolesToUpdateDP
				) {
					updatePartnerPromise = dispatch(
						"registerPartnerHistory",
						normalizer.normalizePartnerHistory({
							partnerFolder: currentPartnerFolder,
							userId: currentSFUser.Id,
							creationDate: new Date(),
							snapshot: {
								currentPartnerFolder,
								salesforce: {
									...rootState.globalStore.salesforce,
								},
							},
							isValidated: false,
						})
					);
				} else {
					const currentUserStep = authDpHelper.getCurrentUserStep();
					let previousPartnerHistory =
						partnerHistoryContext.previous ||
						partnerHistoryContext.current ||
						partnerHistoryContext.next ||
						null;

					const previousUserContext = authDpHelper.getUserStatus(
						previousPartnerHistory
							? previousPartnerHistory.salesforceUser
							: null
					);

					let isEditable = false;

					// skip this logic case the current sf user context is either cpw or planification
					if (
						currentUserStep &&
						3 !== currentUserStep &&
						4 !== currentUserStep
					) {
						isEditable = isAllowedToByPassRolesToUpdateDP
							? false
							: [
								(previousUserContext || {}).status,
								currentUserContext.status,
							].every((status) => ["salesman", "assistant"].includes(status));
					}

					if (partnerHistoryContext && previousPartnerHistory) {
						let isValidated = previousPartnerHistory.isValidated;
						let snapshot = JSON.parse(state.currentPartnerFolderSnapshot);
						if (
							// previous step in the chain of steps, and verify if the is the right editable steps
							(currentUserStep === partnerHistoryContext.previousStep + 1 &&
								isEditable) ||
							(currentUserStep > partnerHistoryContext.previousStep &&
								!(
									"cpw" === currentUserContext.status &&
									"planning" === previousUserContext.status
								)) ||
							// to revoke the editable case between cpw and planning
							(currentUserContext &&
								(("cpw" === currentUserContext.status &&
										"planning" !== previousUserContext.status &&
										currentUserContext.status !== previousUserContext.status) ||
									("planning" === currentUserContext.status &&
										currentUserStep > partnerHistoryContext.previousStep)))
						) {
							if (!partnerHistoryContext.current) {
								isValidated = true;
							}
						} else if (isAllowedToByPassRolesToUpdateDP) {
							previousPartnerHistory =
								partnerHistoryContext.current ||
								partnerHistoryContext.next ||
								partnerHistoryContext.previous ||
								null;
							snapshot = {
								currentPartnerFolder,
								salesforce: rootState.globalStore.salesforce,
							};
						}

						if (!partnerHistoryContext.current) {
							// validation case the previous partnerHistory is not valid
							updatePartnerPromise = dispatch("updatePartnerEntity", {
								entityName: "PartnerHistory",
								id: previousPartnerHistory.id,
								data: normalizer.normalizePartnerHistory({
									partnerFolder: currentPartnerFolder,
									updateDate: new Date(),
									snapshot,
									isValidated,
								}),
								showNotification: false,
							});
						}
					}

					// need to verify if there's a partnerHistory for this role, case if doesn't exist we create the first batch
					if (
						partnerHistories.every(
							(partnerHistory: { userId: any; salesforceUser: { Id: any } }) =>
								(partnerHistory.userId || partnerHistory.salesforceUser.Id) !==
								currentSFUser.Id
						) &&
						!isAllowedToByPassRolesToUpdateDP
					) {
						if (!updatePartnerPromise) {
							updatePartnerPromise = Promise.resolve();
						}
						if (
							authDpHelper.getUserStep(
								previousPartnerHistory.salesforceUser
							) === currentUserStep
						) {
							updatePartnerPromise = updatePartnerPromise.then(
								dispatch("updatePartnerEntity", {
									entityName: "PartnerHistory",
									id: previousPartnerHistory.id,
									data: normalizer.normalizePartnerHistory({
										partnerFolder: currentPartnerFolder,
										updateDate: new Date(),
										snapshot: {
											currentPartnerFolder,
											salesforce: rootState.globalStore.salesforce,
										},
									}),
									showNotification: false,
								})
							);
						} else {
							updatePartnerPromise = updatePartnerPromise.then(
								dispatch(
									"registerPartnerHistory",
									normalizer.normalizePartnerHistory({
										partnerFolder: currentPartnerFolder,
										userId: currentSFUser.Id,
										creationDate: new Date(),
										snapshot: {
											currentPartnerFolder,
											salesforce: rootState.globalStore.salesforce,
										},
										isValidated: false,
									})
								)
							);
						}
					}
				}

				return (updatePartnerPromise || Promise.resolve()).then(() =>
					dispatch("setPartnerHistorySteps", state.currentPartnerFolder)
				);
			});
	},
	registerPartnerHistory(
		{dispatch, commit, state, rootState}: any,
		data: any
	) {
		return dispatch("createEntity", {
			entityName: "PartnerHistory",
			data,
			showNotification: false,
		}).then(
			commit("setPartnerHistoryContext", {
				current: normalizer.normalizePartnerHistory({
					snapshot: {
						currentPartnerFolder: state.currentPartnerFolder,
						salesforce: {
							...rootState.globalStore.salesforce,
						},
					},
				}),
				currentStep: authDpHelper.getCurrentUserStep(),
			})
		);
	},
	deletePartnerPropertyFromForm(
		{dispatch, commit},
		{data, showNotification}
	) {
		return Promise.all(
			[
				"CampaignOption",
				"SiteTree",
				"Footage",
				"OpeningRange",
				"AgendaService",
				"AgendaResource",
				"AgendaMember",
				"AgendaVisio",
				"FeeDetail",
				"BookingService",
				"BookingTimeRange",
				"DeliveryMode",
			].map((entityName) => {
				const offset = entityName.charAt(0).toLowerCase() + entityName.slice(1);
				if (undefined !== data[offset] && data[offset].id) {
					return dispatch("deleteEntity", {
						entityName: entityName,
						deletedEntity: data[offset],
						showNotification: showNotification,
						context: data,
					});
				}

				return Promise.resolve();
			})
		);
	},
	updatePartnerEntity(
		{dispatch, commit},
		{entityName, id, data, showNotification, context}
	) {
		return localfrApiService[`update${entityName}`](id, data).then(
			(response: any) => {
				let promise;
				if ("Partner" === entityName) {
					promise = dispatch(`setCurrentPartner`, {currentPartner: response});
				} else {
					if ("Site" === entityName) {
						initializeEntityRelations(response, siteRelations);
					}
					commit(`set${entityName}`, {entityValue: response, context});
					promise = Promise.resolve();
				}
				return promise.then(() => {
					dispatch("updateIdentity");
					if (false !== showNotification) {
						dispatch(
							"alert/success",
							{
								group: "general-error",
								type: "success",
								message: "Donnée sauvegardée !",
								show: true,
								title: "Envoyé !",
							},
							{root: true}
						);
					}

					return response;
				});
			},
			() => {
				if (false !== showNotification) {
					dispatch(
						"alert/error",
						{
							group: "general-error",
							message: "Impossible de mettre à jour les informations du site.",
							show: true,
							title: "Erreur",
							type: "error",
						},
						{root: true}
					);
				}
			}
		);
	},
	updateSalesforceAccount(
		{dispatch, commit},
		{entityName, id, data, showNotification}
	) {
		return salesforceService[`update${entityName}`](id, data).then(
			() => {
				if (false !== showNotification) {
					dispatch(
						"alert/success",
						{
							group: "general-error",
							type: "success",
							message: "Donnée sauvegardée !",
							show: true,
							title: "Envoyé !",
						},
						{root: true}
					);
				}
			},
			() => {
				if (false !== showNotification) {
					dispatch(
						"alert/error",
						{
							group: "general-error",
							message:
								"Impossible de mettre à jour les informations du compte.",
							show: true,
							title: "Erreur",
							type: "error",
						},
						{root: true}
					);
				}
			}
		);
	},
	createEntity(
		{dispatch, commit},
		{entityName, data, showNotification, context}
	) {
		return localfrApiService[`create${entityName}`](data).then(
			(currentEntity: any) => {
				if ("Site" === entityName) {
					initializeEntityRelations(currentEntity, siteRelations);
				}
				commit(`add${entityName}`, {entityValue: currentEntity, context});
				dispatch("updateIdentity");
				if (false !== showNotification) {
					dispatch(
						"alert/success",
						{
							group: "general-error",
							type: "success",
							message: "Donnée sauvegardée !",
							show: true,
							title: "Envoyé !",
						},
						{root: true}
					);
				}

				return currentEntity;
			},
			() => {
				if (false !== showNotification) {
					dispatch(
						"alert/error",
						{
							group: "general-error",
							message: "Impossible de mettre à jour les informations du site.",
							show: true,
							title: "Erreur",
							type: "error",
						},
						{root: true}
					);
				}
			}
		);
	},
	deleteEntity(
		{dispatch, commit},
		{entityName, deletedEntity, showNotification, context}
	) {
		return localfrApiService[`delete${entityName}`](deletedEntity.id).then(
			(response: any) => {
				commit(`remove${entityName}`, {deletedEntity, context});
				dispatch("updateIdentity");
				if (false !== showNotification) {
					dispatch(
						"alert/success",
						{
							group: "general-error",
							type: "success",
							message: "Donnée sauvegardée !",
							show: true,
							title: "Envoyé !",
						},
						{root: true}
					);
				}
			},
			() => {
				if (false !== showNotification) {
					dispatch(
						"alert/error",
						{
							group: "general-error",
							message:
								"Impossible de mettre à jour les informations du compte.",
							show: true,
							title: "Erreur",
							type: "error",
						},
						{root: true}
					);
				}
			}
		);
	},
};

const mutations = {
	previewPfHistoryStep(
		state: { identity: { allowedToEdit: boolean }; currentPartnerFolder: any },
		currentPartnerFolder: any
	) {
		state.identity.allowedToEdit = false;
		state.currentPartnerFolder = currentPartnerFolder;
	},
	setIsStopEditing(state: { status: { isStopEditing: any } }, value: boolean) {
		state.status.isStopEditing = value;
	},
	setSelectedOpportunityFolder(
		state: { selectedOpportunityFolder: any },
		value: any
	) {
		state.selectedOpportunityFolder = value;
	},
	setPreviewInformation(
		state: { pfPreviewInformation: any },
		pfPreviewInformation: any
	) {
		Object.assign(state.pfPreviewInformation, pfPreviewInformation);
	},
	setTimelineSteps(
		state: { timelineSteps: any; currentPartnerFolder: any },
		currentPartnerFolder = null
	) {
		state.timelineSteps = (
			currentPartnerFolder || state.currentPartnerFolder
		).partnerHistories.map(
			(partnerHistory: {
				salesforceUser: { LastName: any; FirstName: any };
				snapshot: any;
				creationDate: any;
				updateDate: any;
				isValidated: any;
			}) => {
				const userStatus = authDpHelper.getUserStatus(
					partnerHistory && partnerHistory.salesforceUser
						? partnerHistory.salesforceUser
						: null
				);

				return {
					step: userStatus && userStatus.step ? userStatus.step : null,
					snapshot: partnerHistory.snapshot,
					creationDate: partnerHistory.creationDate,
					updateDate: partnerHistory.updateDate,
					userFullname:
						partnerHistory && partnerHistory.salesforceUser
							? `${partnerHistory.salesforceUser.LastName} ${partnerHistory.salesforceUser.FirstName}`
							: "",
					isValidated: partnerHistory && partnerHistory.isValidated,
				};
			}
		);
	},
	impersonateLoginRequest(
		state: { status: { impersonating: boolean }; impersonatedUser: any },
		impersonatedUser: any
	) {
		state.status.impersonating = true;
		state.impersonatedUser = impersonatedUser;
	},
	impersonateLoginSuccess(
		state: {
			status: { impersonated: boolean; impersonating: boolean };
			impersonatedUser: any;
			currentPartner: { partnerFolders: any[] };
			currentPartnerFolder: any;
		},
		{impersonatedUser, accessToken}: any
	) {
		state.status.impersonated = true;
		state.status.impersonating = false;
		impersonatedUser.access_token = accessToken.access_token;
		state.impersonatedUser = impersonatedUser;
		state.currentPartner = impersonatedUser.partners
			? impersonatedUser.partners[0]
			: null;
		state.currentPartnerFolder = state.currentPartner.partnerFolders
			? state.currentPartner.partnerFolders[0]
			: null;
	},
	impersonateLoginFailure(state: {
		status: { impersonated: boolean; impersonating: boolean };
		impersonatedUser: null;
		currentPartner: null;
		currentPartnerFolder: null;
	}) {
		state.status.impersonated = false;
		state.status.impersonating = false;
		state.impersonatedUser = null;
		state.currentPartner = null;
		state.currentPartnerFolder = null;
	},
	impersonateLogout(state: {
		status: { impersonated: boolean; impersonating: boolean };
		impersonatedUser: null;
		currentPartner: null;
		currentPartnerFolder: null;
	}) {
		state.status.impersonated = false;
		state.status.impersonating = false;
		state.impersonatedUser = null;
		state.currentPartner = null;
		state.currentPartnerFolder = null;
	},
	loginRequest(
		state: { status: { loggingIn: boolean; logoutModal: any }; user: any },
		user: any
	) {
		state.status = {
			loggingIn: true,
			logoutModal: Object.duplicate(initialLogoutModal),
		};
		state.user = user;
	},
	loginSuccess(
		state: {
			status: { loggedIn: boolean; logoutModal: any };
			user: any;
			identity: any;
			salesforceUser: any;
		},
		{user, me}: any
	) {
		state.status = {
			loggedIn: true,
			logoutModal: Object.duplicate(initialLogoutModal),
		};
		state.user = user;
		state.identity = me;
		if (me.salesforceUser) {
			state.salesforceUser = me.salesforceUser;
		}
	},
	loginFailure(state: { status: { logoutModal: any }; user: null }) {
		state.status = {
			logoutModal: Object.duplicate(initialLogoutModal),
		};
		state.user = null;
	},
	logout(state: {
		status: { logoutModal: any };
		user: null;
		impersonatedUser: null;
		identity: null;
		salesforceUser: null;
		currentPartner: null;
		currentPartnerFolder: null;
	}) {
		state.status = {
			logoutModal: Object.duplicate(initialLogoutModal),
		};
		state.user = null;
		state.impersonatedUser = null;
		state.identity = null;
		state.salesforceUser = null;
		state.currentPartner = null;
		state.currentPartnerFolder = null;
	},
	salesforceUsersLoadingRequest(
		state: { status: { isSalesforceUsersLoading: { [x: string]: boolean } } },
		userId: string | number
	) {
		if (!state.status.isSalesforceUsersLoading) {
			state.status.isSalesforceUsersLoading = {};
		}
		state.status.isSalesforceUsersLoading[userId] = true;
	},
	salesforceUsersLoadingSuccess(
		state: {
			status: { isSalesforceUsersLoading: { [x: string]: boolean } };
			salesforceUsers: { [x: string]: any };
		},
		user: { Id: string | number }
	) {
		if (!state.status.isSalesforceUsersLoading) {
			state.status.isSalesforceUsersLoading = {};
		}
		state.salesforceUsers[user.Id] = user;
		state.status.isSalesforceUsersLoading[user.Id] = false;
	},
	salesforceUsersLoadingFailure(
		state: { status: { isSalesforceUsersLoading: { [x: string]: boolean } } },
		userId: string | number
	) {
		if (!state.status.isSalesforceUsersLoading) {
			state.status.isSalesforceUsersLoading = {};
		}
		state.status.isSalesforceUsersLoading[userId] = false;
	},
	setRefreshTokenTtl(
		state: { status: { logoutModal: { refreshTokenTtl: any } } },
		value: any
	) {
		state.status.logoutModal.refreshTokenTtl = value;
	},
	updateRefreshTokenState(
		state: { status: { logoutModal: { refreshTokenTtlState: any } } },
		value: any
	) {
		state.status.logoutModal.refreshTokenTtlState = value;
	},
	isShowLogoutModal(
		state: { status: { logoutModal: { isShowLogoutModal: any } } },
		value: any
	) {
		state.status.logoutModal.isShowLogoutModal = value;
	},
	setIdentity(state: { identity: any }, {identity}: any) {
		state.identity = identity;
	},
	updateUser(state: { user: any }, value: any) {
		state.user = value;
	},

	setCurrentPartner(
		state: { currentPartner: any; currentPartnerFolder: any },
		{currentPartner}: any
	) {
		state.currentPartner = currentPartner;
		const currentPartnerFolder =
			currentPartner &&
			currentPartner.partnerFolders &&
			currentPartner.partnerFolders.length
				? currentPartner.partnerFolders[0]
				: null;
		if (
			currentPartnerFolder &&
			currentPartnerFolder.sites &&
			currentPartnerFolder.sites[0] &&
			currentPartnerFolder.sites[0].siteTrees &&
			currentPartnerFolder.sites[0].siteTrees.length > 1
		) {
			currentPartnerFolder.sites[0].siteTrees.sort(
				(a: { position: number }, b: { position: number }) =>
					a.position - b.position
			);
		}
		state.currentPartnerFolder = currentPartnerFolder;
	},

	setCurrentPartnerFolder(
		state: { currentPartnerFolder: any },
		currentPartnerFolder: any
	) {
		state.currentPartnerFolder = currentPartnerFolder;
	},
	setCurrentPartnerFolderSnapshot(
		state: { currentPartnerFolderSnapshot: string },
		currentPartnerFolderSnapshot: any
	) {
		state.currentPartnerFolderSnapshot = JSON.stringify(
			currentPartnerFolderSnapshot
		);
	},
	setPartnerHistoryContext(state: { partnerHistoryContext: {} }, data: any) {
		if (!state.partnerHistoryContext) {
			state.partnerHistoryContext = {};
		}
		state.partnerHistoryContext = Object.assign(
			state.partnerHistoryContext,
			data
		);
		localStorage.setItem(
			"partnerHistoryContext",
			JSON.stringify(state.partnerHistoryContext)
		);
	},
	resetPartnerHistoryContext(state: { partnerHistoryContext: {} }) {
		state.partnerHistoryContext = {};
		localStorage.setItem(
			"partnerHistoryContext",
			JSON.stringify(state.partnerHistoryContext)
		);
	},
	setPartnerFolder(
		state: { currentPartner: { partnerFolders: any[] } },
		{entityValue}: any
	) {
		let found = false;
		if (!state.currentPartner.partnerFolders) {
			state.currentPartner.partnerFolders = [];
		} else {
			state.currentPartner.partnerFolders.forEach(function (
				item: { id: any },
				index: string | number
			) {
				if (item.id === entityValue.id) {
					found = true;
					state.currentPartner.partnerFolders[index] = entityValue;
				}
			});
		}

		if (!found) {
			state.currentPartner.partnerFolders.push(entityValue);
		}

		this.currentPartnerFolder = entityValue;
	},
	addPartnerAutoImmo(
		state: { currentPartnerFolder: { partnerAutoImmo: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerAutoImmo = entityValue;
	},
	setPartnerAutoImmo(
		state: { currentPartnerFolder: { partnerAutoImmo: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerAutoImmo = entityValue;
	},
	addPartnerHotelResto(
		state: { currentPartnerFolder: { partnerHotelResto: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerHotelResto = entityValue;
	},
	setPartnerHotelResto(
		state: { currentPartnerFolder: { partnerHotelResto: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerHotelResto = entityValue;
	},
	addPartnerBoutique(
		state: { currentPartnerFolder: { partnerBoutique: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerBoutique = entityValue;
	},
	setPartnerBoutique(
		state: { currentPartnerFolder: { partnerBoutique: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerBoutique = entityValue;
	},
	addPartnerShop(
		state: { currentPartnerFolder: { partnerShop: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerShop = entityValue;
	},
	setPartnerShop(
		state: { currentPartnerFolder: { partnerShop: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.partnerShop = entityValue;
	},
	setSite(
		state: { currentPartnerFolder: { sites: any[] } },
		{entityValue}: any
	) {
		if (entityValue.siteTrees && entityValue.siteTrees.length > 1) {
			entityValue.siteTrees.sort(
				(a: { position: number }, b: { position: number }) =>
					a.position - b.position
			);
		}
		fillEntity(state.currentPartnerFolder.sites[0], entityValue);
	},
	addSite(
		state: { currentPartnerFolder: { sites: any[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.sites[0] = entityValue;
	},
	setPartnerHistory(
		state: {
			currentPartnerFolder: { partnerHistories: any[] };
			salesforceUser: any;
		},
		{entityValue}: any
	) {
		let found = false;
		if (!state.currentPartnerFolder.partnerHistories) {
			state.currentPartnerFolder.partnerHistories = [];
		} else {
			state.currentPartnerFolder.partnerHistories.forEach(function (
				item: { id: any },
				index: string | number
			) {
				if (item.id === entityValue.id) {
					found = true;
					state.currentPartnerFolder.partnerHistories[index] = entityValue;
				}
			});
		}

		if (!found) {
			entityValue.salesforceUser = state.salesforceUser;
			state.currentPartnerFolder.partnerHistories.push(entityValue);
		}
	},
	addPartnerHistory(
		state: {
			currentPartnerFolder: { partnerHistories: any[] };
			salesforceUser: any;
		},
		{entityValue}: any
	) {
		if (!state.currentPartnerFolder.partnerHistories) {
			state.currentPartnerFolder.partnerHistories = [];
		}

		entityValue.salesforceUser = state.salesforceUser;
		state.currentPartnerFolder.partnerHistories.push(entityValue);
	},
	setNote(
		state: { currentPartnerFolder: { notes: any[] } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.notes.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id === entityValue.id) {
				found = true;
				state.currentPartnerFolder.notes[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.notes.push(entityValue);
		}
	},
	addNote(
		state: { currentPartnerFolder: { notes: any[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.notes.push(entityValue);
	},
	setAgenda(
		state: { currentPartnerFolder: { agenda: any } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.agenda = entityValue;
	},
	setBookEngine(
		state: { currentPartnerFolder: { bookEngines: any[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.bookEngines[0] = entityValue;
	},
	setTargetingCookie(state: { status: { targetingCookie: any } }, value: any) {
		state.status.targetingCookie = value;
	},
	setPerformanceCookie(
		state: { status: { performanceCookie: any } },
		value: any
	) {
		state.status.performanceCookie = value;
	},
	setBanner(
		state: { currentPartnerFolder: { sites: { banners: any[] }[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.sites[0].banners[0] = entityValue;
	},
	addBanner(
		state: { currentPartnerFolder: { sites: { banners: any[] }[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.sites[0].banners[0] = entityValue;
	},
	setFootage(
		state: { currentPartnerFolder: { footages: any[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.footages[0] = entityValue;
	},
	addFootage(
		state: { currentPartnerFolder: { footages: any[] } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.footages.forEach(function (
			item: { id: any; name: any },
			index: string | number
		) {
			if (!item.id && entityValue.name === item.name) {
				found = true;
				state.currentPartnerFolder.footages[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.footages.push(entityValue);
		}
	},
	removeFootage(
		state: { currentPartnerFolder: { footages: any[] } },
		{deletedEntity}: any
	) {
		const index = state.currentPartnerFolder.footages.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.footages.splice(index, 1);
		}
	},
	setSocialNetwork(
		state: { currentPartnerFolder: { socialNetworks: any[] } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.socialNetworks.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id === entityValue.id) {
				found = true;
				state.currentPartnerFolder.socialNetworks[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.socialNetworks.push(entityValue);
		}
	},
	addSocialNetwork(
		state: { currentPartnerFolder: { socialNetworks: any[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.socialNetworks.push(entityValue);
	},
	setDeliveryMode(state: any, {entityValue, context}: any) {
		const deliveryModes = getDeliveryModes(context.parentEntityName);
		let found = false;
		deliveryModes.forEach(function (item: { id: any }, index: string | number) {
			if (item.id === entityValue.id) {
				found = true;
				deliveryModes[index] = entityValue;
			}
		});

		if (!found) {
			deliveryModes.push(entityValue);
		}
	},
	addDeliveryMode(state: any, {entityValue, context}: any) {
		const deliveryModes = getDeliveryModes(context.parentEntityName);

		if (deliveryModes) {
			let found = deliveryModes.some(function (
				item: { name: any },
				index: string | number
			) {
				if (item.name === entityValue.name) {
					found = true;
					deliveryModes[index] = entityValue;
					return true;
				}

				return false;
			});

			if (!found) {
				deliveryModes.push(entityValue);
			}
		}
	},
	removeDeliveryMode(state: any, {deletedEntity, context}: any) {
		const deliveryModes = getDeliveryModes(context.parentEntityName);
		const index = deliveryModes.findIndex(
			(deliveryMode: { id: any }) => deliveryMode.id === deletedEntity.id
		);
		if (-1 !== index) {
			deliveryModes.splice(index, 1);
		}
	},
	setCampaignOption(
		state: { currentPartnerFolder: { campaignOptions: any[] } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.campaignOptions.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id === entityValue.id) {
				found = true;
				state.currentPartnerFolder.campaignOptions[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.campaignOptions.push(entityValue);
		}
	},
	addCampaignOption(
		state: { currentPartnerFolder: { campaignOptions: any[] } },
		{entityValue}: any
	) {
		state.currentPartnerFolder.campaignOptions.push(entityValue);
	},
	removeCampaignOption(
		state: { currentPartnerFolder: { campaignOptions: any[] } },
		{deletedEntity}: any
	) {
		const index = state.currentPartnerFolder.campaignOptions.findIndex(
			(campaign: { id: any }) => campaign.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.campaignOptions.splice(index, 1);
		}
	},
	setSiteTree(
		state: { currentPartnerFolder: { sites: { siteTrees: any[] }[] } },
		{entityValue}: any
	) {
		if (
			!state.currentPartnerFolder ||
			!state.currentPartnerFolder.sites ||
			!state.currentPartnerFolder.sites[0]
		) {
			return;
		}

		if (!state.currentPartnerFolder.sites[0].siteTrees) {
			state.currentPartnerFolder.sites[0].siteTrees = [];
		}

		const index = state.currentPartnerFolder.sites[0].siteTrees.findIndex(
			(item: { id: any }) => item.id === entityValue.id
		);
		if (index < 0) {
			state.currentPartnerFolder.sites[0].siteTrees.push(entityValue);
		}
	},
	addSiteTree(
		state: {
			currentPartnerFolder: { sites: { siteTrees: { [x: string]: any } }[] };
		},
		{entityValue}: any
	) {
		if (
			!state.currentPartnerFolder ||
			!state.currentPartnerFolder.sites ||
			!state.currentPartnerFolder.sites[0]
		) {
			return;
		}

		if (!state.currentPartnerFolder.sites[0].siteTrees) {
			state.currentPartnerFolder.sites[0].siteTrees = [];
		}

		const index = state.currentPartnerFolder.sites[0].siteTrees.findIndex(
			(item: { id: any; name: any; position: any }) =>
				!item.id &&
				entityValue.name === item.name &&
				entityValue.position === item.position
		);
		if (index < 0) {
			state.currentPartnerFolder.sites[0].siteTrees.push(entityValue);
		} else {
			state.currentPartnerFolder.sites[0].siteTrees[index] = entityValue;
		}
	},
	removeSiteTree(
		state: { currentPartnerFolder: { sites: { siteTrees: any[] }[] } },
		{deletedEntity}: any
	) {
		if (
			!state.currentPartnerFolder ||
			!state.currentPartnerFolder.sites ||
			!state.currentPartnerFolder.sites[0] ||
			!state.currentPartnerFolder.sites[0].siteTrees ||
			!state.currentPartnerFolder.sites[0].siteTrees.length
		) {
			return;
		}

		const index = state.currentPartnerFolder.sites[0].siteTrees.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.sites[0].siteTrees.splice(index, 1);
		}
	},
	setFeeDetail(
		state: { currentPartnerFolder: { deliveryModes: { feeDetails: any[] }[] } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.deliveryModes[0].feeDetails.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id === entityValue.id) {
				found = true;
				state.currentPartnerFolder.deliveryModes[0].feeDetails[index] =
					entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.deliveryModes[0].feeDetails.push(entityValue);
		}
	},
	addFeeDetail(
		state: { currentPartnerFolder: { deliveryModes: { feeDetails: any[] }[] } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.deliveryModes[0].feeDetails.forEach(function (
			item: { id: any; name: any },
			index: string | number
		) {
			if (!item.id && entityValue.name === item.name) {
				found = true;
				state.currentPartnerFolder.deliveryModes[0].feeDetails[index] =
					entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.deliveryModes[0].feeDetails.push(entityValue);
		}
	},
	removeFeeDetail(
		state: { currentPartnerFolder: { deliveryModes: { feeDetails: any[] }[] } },
		{deletedEntity}: any
	) {
		const index =
			state.currentPartnerFolder.deliveryModes[0].feeDetails.findIndex(
				(item: { id: any }) => item.id === deletedEntity.id
			);
		if (-1 !== index) {
			state.currentPartnerFolder.deliveryModes[0].feeDetails.splice(index, 1);
		}
	},
	setAgendaMember(
		state: { currentPartnerFolder: { agenda: { agendaMembers: any[] } } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.agenda.agendaMembers.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id && entityValue.id === item.id) {
				found = true;
				state.currentPartnerFolder.agenda.agendaMembers[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.agenda.agendaMembers.push(entityValue);
		}
	},
	addAgendaMember(
		state: { currentPartnerFolder: { agenda: { agendaMembers: any[] } } },
		{entityValue}: any
	) {
		const index = state.currentPartnerFolder.agenda.agendaMembers.findIndex(
			(item: { [x: string]: any; id?: any }) => {
				const offsets = Object.keys(item);
				return (
					(undefined === item.id || item.id === entityValue.id) &&
					offsets.every((offset) => {
						let value = entityValue[offset];
						if ("agenda" === offset && undefined !== value) {
							value = value["@id"];
						}
						return item[offset] === value;
					})
				);
			}
		);

		if (-1 === index) {
			state.currentPartnerFolder.agenda.agendaMembers.push(entityValue);
		} else {
			state.currentPartnerFolder.agenda.agendaMembers[index] = entityValue;
		}
	},
	removeAgendaMember(
		state: { currentPartnerFolder: { agenda: { agendaMembers: any[] } } },
		{deletedEntity}: any
	) {
		const index = state.currentPartnerFolder.agenda.agendaMembers.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.agenda.agendaMembers.splice(index, 1);
		}
	},
	setAgendaService(
		state: { currentPartnerFolder: { agenda: { agendaServices: any[] } } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.agenda.agendaServices.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id && entityValue.id === item.id) {
				found = true;
				state.currentPartnerFolder.agenda.agendaServices[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.agenda.agendaServices.push(entityValue);
		}
	},
	addAgendaService(
		state: { currentPartnerFolder: { agenda: { agendaServices: any[] } } },
		{entityValue}: any
	) {
		const index = state.currentPartnerFolder.agenda.agendaServices.findIndex(
			(item: { [x: string]: any; id?: any }) => {
				const offsets = Object.keys(item);
				return (
					(undefined === item.id || item.id === entityValue.id) &&
					offsets.every((offset) => {
						let value = entityValue[offset];
						if ("agenda" === offset && undefined !== value) {
							value = value["@id"];
						}
						return item[offset] === value;
					})
				);
			}
		);

		if (-1 === index) {
			state.currentPartnerFolder.agenda.agendaServices.push(entityValue);
		} else {
			state.currentPartnerFolder.agenda.agendaServices[index] = entityValue;
		}
	},
	removeAgendaService(
		state: { currentPartnerFolder: { agenda: { agendaServices: any[] } } },
		{deletedEntity}: any
	) {
		const index = state.currentPartnerFolder.agenda.agendaServices.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.agenda.agendaServices.splice(index, 1);
		}
	},
	setAgendaResource(
		state: { currentPartnerFolder: { agenda: { agendaResources: any[] } } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.agenda.agendaResources.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id && entityValue.id === item.id) {
				found = true;
				state.currentPartnerFolder.agenda.agendaResources[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.agenda.agendaResources.push(entityValue);
		}
	},
	addAgendaResource(
		state: { currentPartnerFolder: { agenda: { agendaResources: any[] } } },
		{entityValue}: any
	) {
		const index = state.currentPartnerFolder.agenda.agendaResources.findIndex(
			(item: { [x: string]: any; id?: any }) => {
				const offsets = Object.keys(item);
				return (
					(undefined === item.id || item.id === entityValue.id) &&
					offsets.every((offset) => {
						let value = entityValue[offset];
						if ("agenda" === offset && undefined !== value) {
							value = value["@id"];
						}
						return item[offset] === value;
					})
				);
			}
		);

		if (-1 === index) {
			state.currentPartnerFolder.agenda.agendaResources.push(entityValue);
		} else {
			state.currentPartnerFolder.agenda.agendaResources[index] = entityValue;
		}
	},
	removeAgendaResource(
		state: { currentPartnerFolder: { agenda: { agendaResources: any[] } } },
		{deletedEntity}: any
	) {
		const index = state.currentPartnerFolder.agenda.agendaResources.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.agenda.agendaResources.splice(index, 1);
		}
	},
	setAgendaVisio(
		state: { currentPartnerFolder: { agenda: { agendaVisios: any[] } } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.agenda.agendaVisios.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id && entityValue.id === item.id) {
				found = true;
				state.currentPartnerFolder.agenda.agendaVisios[index] = entityValue;
			}
		});
		if (!found) {
			state.currentPartnerFolder.agenda.agendaVisios.push(entityValue);
		}
	},
	addAgendaVisio(
		state: { currentPartnerFolder: { agenda: { agendaVisios: any[] } } },
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.agenda.agendaVisios.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (!item.id) {
				found = true;
				state.currentPartnerFolder.agenda.agendaVisios[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.agenda.agendaVisios.push(entityValue);
		}
	},
	removeAgendaVisio(
		state: { currentPartnerFolder: { agenda: { agendaVisios: any[] } } },
		{deletedEntity}: any
	) {
		const index = state.currentPartnerFolder.agenda.agendaVisios.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.agenda.agendaVisios.splice(index, 1);
		}
	},
	setBookingService(
		state: {
			currentPartnerFolder: { partnerHotelResto: { bookingServices: any[] } };
		},
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.partnerHotelResto.bookingServices.forEach(
			function (item: { id: any }, index: string | number) {
				if (item.id && entityValue.id === item.id) {
					found = true;
					state.currentPartnerFolder.partnerHotelResto.bookingServices[index] =
						entityValue;
				}
			}
		);
		if (!found) {
			state.currentPartnerFolder.partnerHotelResto.bookingServices.push(
				entityValue
			);
		}
	},
	addBookingService(
		state: {
			currentPartnerFolder: { partnerHotelResto: { bookingServices: any[] } };
		},
		{entityValue}: any
	) {
		let found = false;
		state.currentPartnerFolder.partnerHotelResto.bookingServices.forEach(
			function (item: { name: any }, index: string | number) {
				if (item.name === entityValue.name) {
					found = true;
					state.currentPartnerFolder.partnerHotelResto.bookingServices[index] =
						entityValue;
				}
			}
		);

		if (!found) {
			state.currentPartnerFolder.partnerHotelResto.bookingServices.push(
				entityValue
			);
		}
	},
	removeBookingService(
		state: {
			currentPartnerFolder: { partnerHotelResto: { bookingServices: any[] } };
		},
		{deletedEntity}: any
	) {
		const index =
			state.currentPartnerFolder.partnerHotelResto.bookingServices.findIndex(
				(item: { id: any }) => item.id === deletedEntity.id
			);
		if (-1 !== index) {
			state.currentPartnerFolder.partnerHotelResto.bookingServices.splice(
				index,
				1
			);
		}
	},
	setBookingTimeRange(
		state: {
			currentPartnerFolder: {
				partnerHotelResto: {
					bookingServices: { [x: string]: { bookingTimeRanges: any[] } };
				};
			};
		},
		{entityValue, context}: any
	) {
		let found = false;
		state.currentPartnerFolder.partnerHotelResto.bookingServices[
			context.serviceIndex
			].bookingTimeRanges.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (item.id && entityValue.id === item.id) {
				found = true;
				state.currentPartnerFolder.partnerHotelResto.bookingServices[
					context.serviceIndex
					].bookingTimeRanges[index] = entityValue;
			}
		});
		if (!found) {
			state.currentPartnerFolder.partnerHotelResto.bookingServices[
				context.serviceIndex
				].bookingTimeRanges.push(entityValue);
		}
	},
	addBookingTimeRange(
		state: {
			currentPartnerFolder: {
				partnerHotelResto: {
					bookingServices: { [x: string]: { bookingTimeRanges: any[] } };
				};
			};
		},
		{entityValue, context}: any
	) {
		let found = false;
		state.currentPartnerFolder.partnerHotelResto.bookingServices[
			context.serviceIndex
			].bookingTimeRanges.forEach(function (
			item: { id: any },
			index: string | number
		) {
			if (!item.id) {
				found = true;
				state.currentPartnerFolder.partnerHotelResto.bookingServices[
					context.serviceIndex
					].bookingTimeRanges[index] = entityValue;
			}
		});

		if (!found) {
			state.currentPartnerFolder.partnerHotelResto.bookingServices[
				context.serviceIndex
				].bookingTimeRanges.push(entityValue);
		}
	},
	removeBookingTimeRange(
		state: {
			currentPartnerFolder: {
				partnerHotelResto: {
					bookingServices: { [x: string]: { bookingTimeRanges: any[] } };
				};
			};
		},
		{deletedEntity, context}: any
	) {
		const index = state.currentPartnerFolder.partnerHotelResto.bookingServices[
			context.serviceIndex
			].bookingTimeRanges.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			state.currentPartnerFolder.partnerHotelResto.bookingServices[
				context.serviceIndex
				].bookingTimeRanges.splice(index, 1);
		}
	},
	setOpeningRange(state: any, {entityValue, context}: any) {
		const timeRanges = getOpeningRanges(context.parentEntityName, entityValue);
		let found = false;
		timeRanges.forEach(function (item: { id: any }, index: string | number) {
			if (item.id === entityValue.id) {
				found = true;
				timeRanges[index] = entityValue;
			}
		});

		if (!found) {
			timeRanges.push(entityValue);
		}
	},
	addOpeningRange(state: any, {entityValue, context}: any) {
		const timeRanges = getOpeningRanges(context.parentEntityName, entityValue);

		if (timeRanges) {
			const found = timeRanges.some(
				(item: { id: any }, index: string | number) => {
					if (item.id === entityValue.id) {
						timeRanges[index] = entityValue;
						return true;
					}

					return false;
				}
			);

			if (!found) {
				timeRanges.push(entityValue);
			}
		}
	},
	removeOpeningRange(state: any, {deletedEntity, context}: any) {
		const timeRanges = getOpeningRanges(
			context.parentEntityName,
			deletedEntity
		);
		const index = timeRanges.findIndex(
			(item: { id: any }) => item.id === deletedEntity.id
		);
		if (-1 !== index) {
			timeRanges.splice(index, 1);
		}
	},
};

export const account = {
	namespaced: true,
	state,
	actions,
	mutations,
};
