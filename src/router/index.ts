import { userService } from "@/services";
import Authentication from "@/views/Authentication.vue";
import Accueil from "@/views/Accueil.vue";
import Site from "@/views/Site.vue";
import Profile from "@/views/Profile.vue";
import NotFound from "@/views/NotFound.vue";
import Documents from "@/views/Documents.vue";
import TicketsList from "@/views/ticket/List.vue";
import TicketCreation from "@/views/ticket/Create.vue";
import TicketAttachment from "@/views/ticket/Attachment.vue";
import Campagne from "@/views/Campagne.vue";
import Audience from "@/views/Audience.vue";
import LocalBroadcast from "@/views/LocalBroadcast.vue";
import CreateAccount from "@/views/CreateAccount.vue";
import Messages from "@/views/Messages.vue";
import Newsletter from "@/views/Newsletter.vue";
import Presentation from "@/views/Presentation.vue";
import Tutorial from "@/views/Tutorial.vue";
import Cgu from "@/views/Cgu.vue";
import Impersonate from "@/views/Impersonate.vue";
import EspacePartage from "@/views/EspacePartage.vue";
import SalesforceAutologin from "@/views/SalesforceAutologin.vue";
import Qrcode from "@/views/Qrcode.vue";
import PartnershipFolder from "@/views/PartnershipFolder/PartnershipFolder.vue";
import BackOfficeIndex from "@/views/BackOffice/Index.vue";
import BackOfficePartnershipFolder from "@/views/BackOffice/PartnershipFolder.vue";
import Cookie from "@/views/Cookies/Cookie.vue";
import { account } from "@/store/account.store";
import { authDpHelper } from "@/helpers";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/authentification",
			name: "Authentication",
			component: Authentication,
			meta: {
				isPublic: true,
			},
		},
		{
			path: "/",
			name: "Root",
			component: Accueil,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/impersonate/:email",
			name: "Impersonate",
			component: Impersonate,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/accueil",
			name: "Accueil",
			component: Accueil,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/presence/site",
			name: "Site",
			component: Site,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/presence/qrcode",
			name: "Qrcode",
			component: Qrcode,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/profil",
			name: "Profil",
			component: Profile,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/performance/audience",
			name: "Audience",
			component: Audience,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/performance/localBroadcast",
			name: "LocalBroadcast",
			component: LocalBroadcast,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/demandes",
			name: "TicketsList",
			component: TicketsList,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/demandes/attachment/:folder/:filename",
			name: "TicketAttachment",
			component: TicketAttachment,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/demandes/attachment/:folder/:subfolder/:filename",
			name: "TicketAttachment",
			component: TicketAttachment,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/demandes/attachment/:customerCodeRange/:folder/:subfolder/:filename",
			name: "TicketAttachment",
			component: TicketAttachment,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/demandes/creer",
			name: "TicketCreation",
			component: TicketCreation,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/404",
			component: NotFound,
			meta: {
				isPublic: true,
			},
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/404",
		},
		{
			path: "/create-account",
			name: "CreateAccount",
			component: CreateAccount,
			meta: {
				isPublic: true,
			},
		},
		{
			path: "/documents",
			name: "Documents",
			component: Documents,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/presence/campagne",
			name: "Campagne",
			component: Campagne,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/performance/messages",
			name: "Messages",
			component: Messages,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/performance/newsletter",
			name: "Newsletter",
			component: Newsletter,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/aide/presentation",
			name: "Presentation",
			component: Presentation,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/aide/tutorial",
			name: "Tutorial",
			component: Tutorial,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/cgu",
			name: "Cgu",
			component: Cgu,
			meta: {
				isPublic: true,
			},
		},
		{
			path: "/Cookies",
			name: "Cookie",
			component: Cookie,
			meta: {
				isPublic: true,
			},
		},
		{
			path: "/autologin",
			name: "SalesforceAutologin",
			component: SalesforceAutologin,
			meta: {
				isPublic: true,
			},
		},
		{
			path: "/espace-partage/:customerCode",
			name: "EspacePartage",
			component: EspacePartage,
			meta: {
				isPublic: false,
			},
			beforeEnter: (to, from, next) => {
				const identity : any  = account.state.identity;
				const isUser = authDpHelper.isUser(identity);
				const isGranted =
					authDpHelper.isSuperAdmin(identity) ||
					authDpHelper.isSalesman(identity);
				const customerCode = to.params.customerCode
					? parseInt(to.params.customerCode as string)
					: null;
				if (
					customerCode &&
					identity &&
					(isGranted ||
						(isUser &&
							identity.partners.some(
								(partner : any) => customerCode === partner.customerCode
							)))
				) {
					return next();
				}

				next(isUser ? "/" : "/backoffice");
			},
		},
		{
			path: "/dossier-partenaire",
			name: "Dossier Partenaire",
			component: PartnershipFolder,
			meta: {
				isPublic: false,
			},
		},
		{
			path: "/backoffice",
			name: "BackOffice",
			component: BackOfficeIndex,
			meta: {
				isPublic: false,
			},
			beforeEnter: (to, from, next) => {
				let nextParam = "";
				if (to.query && to.query.customerCode) {
					const nextUrl = encodeURIComponent(
						`/backoffice?customerCode=${to.query.customerCode}`
					);
					nextParam = `?next=${nextUrl}`;
				}
				next(
					!account.state.identity || authDpHelper.isUser(account.state.identity)
						? `/authentification${nextParam}`
						: undefined
				);
			},
		},
		{
			path: "/backoffice/dossier-partenaire/:customerCode",
			name: "BackOfficePartnershipFolder",
			component: BackOfficePartnershipFolder,
			meta: {
				isPublic: false,
			},
		},
	],
});

router.beforeEach((to, from, next) => {
	//window[`ga-disable-${process.env.GOOGLE_ANALYTICS_ID}`] = !account.state.status.performanceCookie;
	// On a protected route
	if (to.matched.some(record => !record.meta.isPublic)) {
		// User is authenticated
		if (userService.checkToken()) {
			userService.refreshToken();
			next();
			// User is not authenticated
		} else {
			if ('/authentification' !== to.path) {
				let params = new URLSearchParams(to.query).toString();
				next({
					path: '/authentification',
					query: {
						next: `${to.path}?${params}`
					}
				});
			} else {
				next();
			}
		}
		// On a public route
	} else {
		next();
	}
});


export default router;
