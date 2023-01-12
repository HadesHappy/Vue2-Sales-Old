<template>
	<b-container fluid class="bc-example-row">
		<vue-progress-bar
			id="timeline-progress-bar"
			v-if="isTimeLineProgressBarActive"
		/>
		<!-- if connected into a user impersonated -->
		<b-row v-if="accountStatus.impersonated && identity">
			<b-col cols="12">
				<div class="alert alert-danger text-center">
					Connecté en tant que : {{ identity.name }} ({{ identity.email }}) /
					{{ currentPartner.fullname }}
					<a href="#/accueil" @click="onImpersonateLogoutClick">
						Déconnecter
					</a>
				</div>
			</b-col>
		</b-row>
		<b-row
			class="timeline-header"
			v-if="pfPreviewInformation && pfPreviewInformation.isPreview"
		>
			<b-col md="2">
				<div class="back-to-edit" @click="backToEditPf()">
					<img alt="" src="@/assets/x-circle.svg"/>
					<span>Retour à l'édition du DP</span>
				</div>
			</b-col>
			<b-col md="8">
				<div class="text-center white-text">
					{{
						`Visualisation du DP version ${pfPreviewInformation.stepOwner}
                    validé par ${pfPreviewInformation.userFullname}
                    le ${formatDate(
							pfPreviewInformation.updateDate ||
							pfPreviewInformation.creationDate
						)}`
					}}
				</div>
			</b-col>
		</b-row>
		<b-row class="marge-header">
			<b-col
				:lg="displayDropElements || isBackOfficePartnershipFolderRoute ? 4 : 6"
				md="6"
			>
				<div>
					<router-link
						:to="
              identity && identity.allowedToEdit ? '/backoffice' : '/accueil'
            "
					>
						<img class="image-log" src="@/assets/logo-local-et-moi.jpg"/>
					</router-link>
				</div>
				<div class="welcome-message">
					Bienvenue dans votre espace partenaire local&moi !
				</div>
			</b-col>
			<DropButtonLink v-if="displayDropElements"/>
			<Timeline
				v-if="
          isBackOfficePartnershipFolderRoute && !globalStoreStatus.isPageLoading
        "
			/>
			<b-col
				class="text-right"
				:lg="displayDropElements || isBackOfficePartnershipFolderRoute ? 4 : 6"
			>
				<a
					href="tel:+33420101080"
					v-if="
            'BackOffice' !== route.name &&
            'BackOfficePartnershipFolder' !== route.name &&
            isUser
          "
				>
					<img class="logo-phone" src="@/assets/phone.png"/>
					<div class="phone-number">04 20 10 10 80</div>
				</a>
				<app-dropdownmenu
					class="inline-menu"
					id="v-step-4"
					:websiteLink="websiteLink"
				></app-dropdownmenu>
			</b-col>
		</b-row>
		<notifications
			group="auth-error"
			position="bottom right"
			class="notification-container"
		/>
		<notifications
			group="general-error"
			position="bottom right"
			class="notification-container"
		/>
	</b-container>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import DropButtonLink from "@/components/DropButtonLink.vue";
import Timeline from "@/components/PartnershipFolder/Timeline/Timeline.vue";
import {authDpHelper} from "@/helpers";

import dayjs from "dayjs";
import {useRoute, useRouter} from "vue-router";
import {
	computed,
	onBeforeMount,
	onMounted,
	ref,
	getCurrentInstance,
} from "vue";

const internalInstance = getCurrentInstance();
const progress = internalInstance.appContext.config.globalProperties.$Progress;

const store = useStore();
const router = useRouter();
const route = useRoute();

const isHeaderInitializing = ref(false);
const isTimeLineProgressBarActive = ref(false);

const identity = computed( () => store.state.account.identity);
const accountStatus = store.state.account.status;
const currentPartner = computed( () => store.state.account.currentPartner);
const pfPreviewInformation = computed(
	() => store.state.account.pfPreviewInformation
);
const selectedOpportunityFolder = computed(
	() => store.state.account.selectedOpportunityFolder
);

const offers = computed(() => store.state.globalStore.offers);
const partner = computed(() => store.state.globalStore.partner);
const salesforce = computed(() => store.state.globalStore.salesforce);
const globalStoreStatus = computed(() => store.state.globalStore.status);
const websiteLink = computed(() => store.state.globalStore.websiteLink);

const displayDropElements = computed(() => {
	return (
		-1 !== ["Accueil", "Root"].indexOf(route.name) &&
		undefined !== isHeaderInitializing.value &&
		!globalStoreStatus.value.isPageLoading &&
		globalStoreStatus.value.hasSharedSpaceAccess &&
		!!currentPartner.value
	);
});
const isUser = computed(() => {
	return authDpHelper.isUser(identity);
});
const isBackOfficePartnershipFolderRoute = computed(() => {
	return "BackOfficePartnershipFolder" === route.name;
});

onMounted(async () => {
	console.log('HeaderGeneral mouted')
	await initialize();
});

onBeforeMount(() => {
	resetPreviewInformation();
});

const loadSalesforceData = (value: any) => store.dispatch("globalStore/loadSalesforceData", value);
const impersonateLogout = () => store.dispatch("account/impersonateLogout");
const handleOpportunityFolder = (value: any) => store.dispatch("account/handleOpportunityFolder", value);

const setPreviewInformation = (value: any) =>
	store.commit("account/setPreviewInformation", value);
const setPartnerUrl = () => store.commit("globalStore/setPartnerUrl");
const toggleIsPageLoading = () =>
	store.commit("globalStore/toggleIsPageLoading");
const toggleUpdateWebsiteDisabled = () =>
	store.commit("globalStore/toggleUpdateWebsiteDisabled");

//   mixins: [partnerMixin],

const formatDate = (date: any) => {
	return dayjs(date).format("DD/MM/YYYY à HH:mm");
};
const onImpersonateLogoutClick = () => {
	impersonateLogout().then(() => {
		router.push("/backoffice");
	});
};

const initialize = async () => {
	if (isHeaderInitializing.value) {
		return new Promise((resolve) => {
			if (!isHeaderInitializing.value) {
				resolve(true);
			}
		});
	}

	if (offers.value.length > 0) {
		isHeaderInitializing.value = false;
		return Promise.resolve();
	}

	if (!isHeaderInitializing.value) {
		isHeaderInitializing.value = true;
	}

	// User without partner (i.e: internal user)
	if (!currentPartner?.value) {
		console.info(
			"No current partner found, this is normal for internal users."
		);
	}

	const args = {
		identity: identity.value,
		currentPartner: currentPartner.value,
		loadDocuments: false,
	};
	console.log("[HeaderGeneralComponent] Init", args);
	if ("/documents" === route.path) {
		args.loadDocuments = true;
	}
	await loadSalesforceData(args);

	isHeaderInitializing.value = false;

	return Promise.resolve();
};

const backToEditPf = () => {
	isTimeLineProgressBarActive.value = true;
	progress.start();
	resetPreviewInformation();
	Promise.resolve(handleOpportunityFolder(selectedOpportunityFolder.value))
		.then(() =>
			store.dispatch(
				"alert/warn",
				{
					group: "general-error",
					type: "warn",
					message:
						"Dans ce mode, vous pouvez modifier le dossier partenaire, sauf si l'étape suivante du DP a déjà été validée.",
					show: true,
					title: "Vous êtes en mode édition",
				},
				{root: true}
			)
		)
		.finally(() => {
			progress.finish();
			isTimeLineProgressBarActive.value = false;
		});
};
const resetPreviewInformation = () => {
	setPreviewInformation({
		isPreview: false,
		stepOwner: null,
		creationDate: null,
		updateDate: null,
		userFullname: null,
	});
};
</script>
