<template>
	<b-container fluid class="bc-example-row">
		<app-headergeneral/>
		<b-row class="text-center justify-content-center" v-if="isUser">
			<b-col xl="1" lg="1" md="12" sm="12">
				<router-link to="/accueil" class="link-header">
					<img width="40" src="@/assets/icon.png"/>
				</router-link>
			</b-col>
			<b-col
				xl="2"
				lg="3"
				sm="4"
				class="hidden-for-mobile"
				v-bind:class="{
          unavailable: status.updateWebsiteDisabled,
        }"
			>
				<b-link class="link-menu" v-bind:href="partner.url" target="_blank">
					<div class="update-button button-profile">Mettre à jour mon site</div>
				</b-link>
			</b-col>
			<b-col xl="2" lg="3" sm="12">
				<router-link to="/demandes" class="link-header">
					<div class="ask-button button-profile">Mes demandes</div>
				</router-link>
			</b-col>
			<b-col
				xl="2"
				lg="3"
				sm="12"
				class="hidden-for-mobile"
				v-if="allowPartnerFolderAccess"
			>
				<router-link to="/dossier-partenaire" class="link-header">
					<div class="update-button button-profile">Mon dossier partenaire</div>
				</router-link>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {authDpHelper} from "@/helpers/auth-dp.helper";
import {computed} from "vue";
import {BCol, BRow, BContainer} from "bootstrap-vue-3";

const store = useStore();

const currentPartner = computed(() => store.state.account.currentPartner);

const identity = computed(() => store.state.account.identity);
const status = computed(() => store.state.account.status);
const dpValidated = computed(() => store.state.globalStore.salesforce.dpValidated); // attention on doit utilisers salesforce

const hasPartnerFolderAccess = computed(() => store.state.globalStore.hasPartnerFolderAccess);
const partner = computed(() => store.state.globalStore.partner);

const allowPartnerFolderAccess = computed(() => {
	return (
		currentPartner.value &&
		currentPartner.value.hasPartnerFolder &&
		dpValidated.value && dpValidated.value.canEdit &&
		hasPartnerFolderAccess
	);
});
console.log('[COMPONENT HEADER] currentPartner', currentPartner.value);
console.log('[COMPONENT HEADER] dpValidated', dpValidated.value);

console.log('[COMPONENT HEADER] allowPartnerFolderAccess', allowPartnerFolderAccess);

const isUser = computed(() => {
	return authDpHelper.isUser(identity.value);
});
</script>
