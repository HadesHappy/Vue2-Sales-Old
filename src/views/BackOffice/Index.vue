<template>
	<div class="accueil" id="full-page">
		<b-row align-h="around" class="marge-header back-office_header">
			<b-col sm="12" md="12" lg="4" class="text-left pl-5 margin-mobile">
				<div>
					<router-link to="/backoffice">
						<img class="image-log" src="@/assets/logo-local-et-moi.jpg"/>
					</router-link>
				</div>
				<div class="welcome-message">
					Bienvenue dans le Back-office de local&moi !
				</div>
			</b-col>
			<b-col
				align-self="end"
				sm="12"
				md="12"
				lg="4"
				class="text-center back-office_search margin-mobile"
			>
				<b-form-input
					id="searchPartner"
					type="search"
					name="partner"
					placeholder="Rechercher un partenaire (code sage)"
					v-model="customerCode"
					@input="getPartner"
				/>
			</b-col>
			<b-col
				sm="12"
				md="12"
				lg="4"
				class="text-right pr-5 margin-mobile back-office_dropdown"
			>
				<app-dropdownmenu
					class="inline-menu"
					id="v-step-4"
					:websiteLink="websiteLink"
				></app-dropdownmenu>
			</b-col>
		</b-row>
		<b-container
			fluid
			class="ref-section d-lg-flex d-md-flex back-office_files-infos"
		>
			<div
				class="ml-lg-auto ml-md-auto d-lg-flex-column d-md-flex-column back-office_files"
			>
				<div v-if="currentPartner && currentPartner.customerCode">
					<b>Référence du dossier :</b>
					{{
						currentPartner && currentPartner.customerCode
							? currentPartner.customerCode
							: "Non renseigné"
					}}
				</div>
				<div>
					<b>Utilisateur :</b>
					{{ identity.email ? identity.email : "Non renseigné" }}
				</div>

				<div v-if="currentPartner && currentPartner.customerCode">
					<b>Site :</b>
					<a
						v-if="null !== websiteLink && !status.isPageLoading"
						v-bind:href="websiteLink"
						target="_blank"
						style="color: #ec008c !important"
					>
						www.{{ websiteLink.replace(/https?:\/\//, "").replace("/", "") }}
					</a>
					<a v-if="null === websiteLink"> Aucun site </a>
				</div>
			</div>
		</b-container>
		<fade-loader
			v-if="loading"
			color="#ec008c"
			class="loader-accueil"
		></fade-loader>
		<b-container fluid class="back-office" v-if="!loading">
			<b-row class="justify-content-center">
				<b-col sm="12" md="3" lg="3" v-if="currentPartner && !isProvider">
					<b-row
						v-for="user in currentPartner.users"
						:key="user.id"
						class="back-office_box mb-3"
					>
						<router-link :to="'/impersonate/' + user.email">
							<b-col
								align-v="center"
								class="text-center back-office_impersonate"
							>
                <span
				>Se connecter à local&moi en tant que
                  {{ user.name || user.email }}
                </span>
							</b-col>
						</router-link>
					</b-row>
				</b-col>
				<b-col
					m="12"
					md="3"
					lg="3"
					v-if="currentPartner && currentPartner.hasPartnerFolder"
				>
					<b-row class="back-office_box">
						<router-link
							:to="'/backoffice/dossier-partenaire/' + currentPartner.customerCode"
						>
							<b-col
								align-v="center"
								class="text-center back-office_partnership-folder"
							>
								<span>Accéder au Dossier partenaire de {{ currentPartner.fullname }}</span>
							</b-col>
						</router-link>
					</b-row>
				</b-col>
				<b-col
					m="12"
					md="3"
					lg="3"
					v-if="currentPartner && !currentPartner.hasPartnerFolder"
				>
					<b-row class="back-office_box">
						<b-col
							align-v="center"
							class="text-center back-office_partnership-folder disabled"
						>
              <span
			  >{{ currentPartner.fullname }} n'a pas de dossier
                partenaire</span
			  >
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<b-row
				v-if="!currentPartner && customerCode"
				class="justify-content-center"
			>
				<b-col class="text-center">
					<span>Aucun partenaire n'a été trouvé</span>
				</b-col>
			</b-row>
		</b-container>
		<app-footer id="footer" class="footer-accueil"></app-footer>
	</div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {localfrApiService} from "@/services";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import {authDpHelper} from "@/helpers";
import {useRoute} from "vue-router";
import {computed, nextTick, onMounted, ref} from "vue";

const store = useStore();
const route = useRoute();

const status = computed(() => store.state.account.status);
const identity = computed(() => store.state.account.identity);
const currentPartner = computed(() => store.state.account.currentPartner);
const websiteLink = computed(() => store.state.globalStore.websiteLink);
const isProvider = computed(() => {
	return authDpHelper.isProvider(identity);
});

const loading = ref(false);

onMounted(() => {
	const promise = currentPartner.value
		? impersonateLogout()
		: Promise.resolve();

	promise.then(() => {
		if (route.query.customerCode) {
			document.querySelector("input#searchPartner").value =
				route.query.customerCode;
		}

		nextTick(() => {
			if (route.query.customerCode) {
				customerCode.value = route.query.customerCode as string;
			} else if (currentPartner.value) {
				customerCode.value = currentPartner.value.customerCode;
			}
			getPartner();
		});
	});
});

const setCurrentPartner = (partner: any) => store.dispatch("account/setCurrentPartner", partner);
const impersonateLogout = () => store.dispatch("account/impersonateLogout");

const getSalesforceAccount = (account: any) => store.dispatch("globalStore/getSalesforceAccount", account);
const getSalesforceContact = (account: any) => store.dispatch("globalStore/getSalesforceContact", account);
const getSalesforceOpportunities = (account: any) => store.dispatch("globalStore/getSalesforceOpportunities", account);
const toggleIsWebtool = (value: boolean) => store.dispatch("globalStore/toggleIsWebtool", value);
const resetState = () => store.dispatch("globalStore/resetState");
//const setWebsiteLink = (account: any) => store.dispatch("globalStore/setWebsiteLink");

const customerCode = ref("");

const resetCurrentPartner = () => {
	setCurrentPartner({currentPartner: null});
	resetState();
	loading.value = false;
};

const getPartner = () => {
	const parsedCustomerCode = parseInt(customerCode.value);

	if (!customerCode.value || !parsedCustomerCode || parsedCustomerCode < 1000) {
		resetCurrentPartner();
		return null;
	}


	loading.value = true;
	setTimeout(() => {
		localfrApiService.getPartner(parsedCustomerCode).then(
			(partners: any) => {
				const partner = partners["hydra:member"][0];
				if (!partner) {
					resetCurrentPartner();
					return;
				}
				console.log('partner',partner);
				if (partner.customerCode !== parsedCustomerCode) {
					loading.value = false;
					return;
				}
				const accountId = partner.company;
				setCurrentPartner({currentPartner: partner});
				console.log('currentPartner', currentPartner.value);
				toggleIsWebtool("webtool" === partner.source);
				return Promise.all([
					getSalesforceAccount({accountId}),
					getSalesforceContact({accountId}),
					getSalesforceOpportunities({accountId}),
				]).then(() => (loading.value = false));
			},
			(error) => {

				resetCurrentPartner();
				console.error('erreur',error);
			}
		);
	}, 500);
};



</script>

<style lang="scss" scoped>
@import "@/assets/style/back-office.scss";
</style>
