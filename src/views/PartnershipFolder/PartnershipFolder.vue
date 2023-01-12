<template>
	<div class="partnership-folder" @click="close_menu">
		<header-buttons/>
		<b-container fluid class="bc-example-row">
			<b-row>
				<menu-profile
					class="hidden-for-mobile margin-profile"
				></menu-profile>
				<menu-mobile class="menu-mobile"></menu-mobile>
<!--				<fade-loader-->
<!--					v-if="isPageLoading"-->
<!--					class="loader-site hidden-for-mobile"-->
<!--				></fade-loader>-->

				<b-col sm="12" md="12" lg="9" v-if="!isPageLoading"><!--  v-if="!isPageLoading"-->
					<hr/>
					<PartnershipForm v-if="allowPartnerFolderAccess"/>
					<div v-else>Aucune donnée à afficher.</div>
				</b-col>
			</b-row>
		</b-container>
		<footer
			class="footer"
			v-if="!currentPartner || !currentPartner.hasPartnerFolder"
		></footer>
		<footer
			class="footer-auth"
			v-if="currentPartner && currentPartner.hasPartnerFolder"
		></footer>
	</div>
</template>

<script lang="ts" setup>
// import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import {useStore} from "vuex";
import MenuMobile from "@/components/MenuMobile.vue";
import PartnershipForm from "@/components/PartnershipFolder/PartnershipForm.vue";
import {readyState} from "@/helpers";
import {computed, onMounted, ref, watchEffect} from "vue";
import HeaderButtons from "@/components/HeaderButtons.vue";
import {BCol, BContainer, BRow} from "bootstrap-vue-3";
import MenuProfile from "@/components/MenuProfile.vue";

const store = useStore();

const isPageLoading = ref(true);

const currentPartner = computed(() => store.state.account.currentPartner);
const status = computed(() => store.state.globalStore.status);
const salesforce = computed(() => store.state.globalStore.salesforce);

const allowPartnerFolderAccess = computed(() => {
	return (
		!isPageLoading.value &&
		currentPartner &&
		currentPartner.value.hasPartnerFolder &&
		salesforce.value.dpValidated.canEdit &&
		status.value.hasPartnerFolderAccess
	);
});
console.log('[COMPONENT PARTNERSGIPFOLDER] currerntPartner', currentPartner.value);
console.log('[COMPONENT PARTNERSGIPFOLDER] dpvalidated', salesforce.value.dpValidated);

console.log('COMPONENT PARTNERSGIPFOLDER', allowPartnerFolderAccess.value);

onMounted(() => {
	console.log('on mounted');
	Promise.all([
		readyState.getSalesforceState(),
		readyState.getCurrentPartnerState(),
		readyState.isAllowedToEditToDisplayColorSection(),
		new Promise((resolve) => {
			const timeout = setInterval(() => {
				if (
					!status.value.isPageLoading &&
					currentPartner &&
					undefined !== currentPartner.value.hasPartnerFolder &&
					null !== currentPartner.value.hasPartnerFolder &&
					undefined !== salesforce.value.dpValidated.canEdit &&
					null !== salesforce.value.dpValidated.canEdit
				) {
					clearInterval(timeout);
					resolve();
				}
			}, 50);
		}),
	]).finally(() => {
		console.log('finally');
		isPageLoading.value = false;
	});
});

const close_menu = () => {
	if (document.getElementById("mySidenav")) {
		document.getElementById("mySidenav").style.width = "0";
	}
};
</script>

<style lang="scss">
@import "@/assets/style/Pfolder/partnership-folder.scss";
.partner-folder-container button.btn-dp-section {
	border-width: 0 0 8px;
	color: #000;
	padding: 1em 3em;
	text-align: left;
	-webkit-box-shadow: none!important;
	box-shadow: none!important;
	border-bottom: 8px solid #aaa;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	background: linear-gradient(120deg,#aaa 2em,#c2c2c2 2.1em);
}
</style>
