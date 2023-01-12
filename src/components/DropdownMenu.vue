<template>
	<b-row>
		<b-col class="logo-menu-container">
			<template v-if="allowedToComeBackToDP && 'EspacePartage' === route.name">
				<img
					class="back-dp-button"
					src="@/assets/back-dp.png"
					title="Revenir au Dossier Partenaire"
					@click="backToPartnershipFolder()"
				/>
			</template>
			<b-dropdown
				variant="link"
				size="lg"
				right
				no-caret
				v-if="'BackOffice' !== route.name"
			>
				<template v-slot:button-content>
					<img class="logo-menu-header" src="@/assets/menu.png" title="Menu"/>
				</template>
				<b-dropdown-item
					v-if="allowBackOfficeAccess"
					href="/backoffice"
					class="text-menu hidden-for-mobile"
				>
					<img
						class="logo-dropdown"
						src="@/assets/mettre-a-jour-mon-site.png"
					/>Retour au back-office
				</b-dropdown-item>
				<b-dropdown-item
					v-if="
            identity &&
            isUser &&
            !identity.allowedToEdit &&
            'BackOfficePartnershipFolder' !== route.name
          "
					v-bind:href="store.state.globalStore.partner.url"
					target="_blank"
					class="text-menu hidden-for-mobile"
					v-bind:class="{
            unavailable: store.state.globalStore.status.updateWebsiteDisabled,
          }"
				>
					<img
						class="logo-dropdown"
						src="@/assets/mettre-a-jour-mon-site.png"
					/>Mettre à jour mon site
				</b-dropdown-item>
				<b-dropdown-item
					v-bind:href="store.state.globalStore.ubiflowLink"
					target="_blank"
					class="text-menu"
					v-if="
            isUser &&
            store.state.globalStore.status.isUbiflow &&
            'BackOffice' !== route.name &&
            'BackOfficePartnershipFolder' !== route.name
          "
				>
					<img class="logo-dropdown back-home" src="@/assets/annonces.png"/>Mes
					annonces
				</b-dropdown-item>
				<b-dropdown-divider
					class="hidden-for-mobile"
					v-if="
            'BackOffice' !== route.name &&
            'BackOfficePartnershipFolder' !== route.name &&
            isUser
          "
				>
				</b-dropdown-divider>
				<b-dropdown-item
					href="/#/accueil"
					class="text-menu backtomenu pr-lg-5 pr-md-5"
					v-on:click="reloadPage"
					v-if="'BackOfficePartnershipFolder' !== route.name && isUser"
				>
					<img class="logo-dropdown back-home" src="@/assets/icon.png"/>Retour
					à l'accueil
				</b-dropdown-item>
			</b-dropdown>
			<b-dropdown
				variant="link"
				size="lg"
				right
				no-caret
				v-if="
          'BackOffice' !== route.name &&
          'BackOfficePartnershipFolder' !== route.name &&
          isUser
        "
			>
				<template v-slot:button-content>
					<img
						class="logo-ask"
						width="10"
						src="@/assets/point-d-interrogation.png"
					/>
				</template>
				<b-dropdown-item href="/demandes/creer" class="text-menu">
					<img
						class="logo-dropdown"
						src="@/assets/creer-une-demande.png"
					/>Créer une demande
				</b-dropdown-item>
				<b-dropdown-divider></b-dropdown-divider>
				<b-dropdown-item href="/demandes" class="text-menu">
					<img class="logo-dropdown" src="@/assets/voir-mes-demandes.png"/>Voir
					mes demandes
				</b-dropdown-item>
				<b-dropdown-divider></b-dropdown-divider>
				<b-dropdown-item href="/aide/tutorial" class="text-menu">
					<img class="logo-dropdown" src="@/assets/learning_tutorials.svg"/>Mes
					formations en vidéo
				</b-dropdown-item>
				<b-dropdown-divider></b-dropdown-divider>
				<b-dropdown-item href="/aide/presentation" class="text-menu">
					<img class="logo-dropdown" src="@/assets/video-play.png"/>Découvrir
					Local&moi
				</b-dropdown-item>
			</b-dropdown>
			<b-dropdown variant="link" size="lg" right no-caret>
				<template v-slot:button-content>
					<img
						class="logo-menu-header"
						src="@/assets/user.png"
						title="Profil"
					/>
				</template>
				<b-dropdown-item
					href="/profil"
					class="text-menu"
					v-if="'BackOffice' !== route.name && 'BackOfficePartnershipFolder' !== route.name && isUser
          "
				>
					<img
						class="logo-dropdown"
						src="@/assets/voir-mon-compte-client.png"
					/>Mon compte partenaire
				</b-dropdown-item>

				<b-dropdown-divider
					v-if="
            'BackOffice' !== route.name &&
            'BackOfficePartnershipFolder' !== route.name &&
            isUser
          "
				>
				</b-dropdown-divider>
				<b-dropdown-item
					href="/dossier-partenaire"
					class="text-menu"
					v-if="allowPartnerFolderAccess && isUser"
				>
					<img
						class="logo-dropdown"
						src="@/assets/picto-contrat-partenaire.png"
					/>Mon dossier partenaire
				</b-dropdown-item>

				<b-dropdown-divider v-if="allowPartnerFolderAccess && isUser"></b-dropdown-divider>
				<b-dropdown-item @click="logout" class="text-menu">
					<img class="log-out" src="@/assets/me-deconnecter.png"/>Me
					déconnecter
				</b-dropdown-item>
			</b-dropdown>
		</b-col>
	</b-row>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {authDpHelper} from "@/helpers/auth-dp.helper";
import Navigation from "@/components//Navigation.vue";
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();
console.log('salesforrce', store.state.globalStore.salesforce.account);

const currentPartner = computed(() => store.state.account.currentPartner);
const identity = computed(() => store.state.account.identity);
const status = computed(() => store.state.account.status);
const salesforce = computed(() => store.state.globalStore.salesforce);

const allowPartnerFolderAccess = computed(() => {
	console.log('Salesforce can edit', salesforce.value.dpValidated);

	return (
		"BackOffice" !== route.name &&
		"BackOfficePartnershipFolder" !== route.name &&
		currentPartner.value &&
		currentPartner.value.hasPartnerFolder &&
		salesforce.value.dpValidated.canEdit
	);
});
const allowBackOfficeAccess = computed(() => {

	return (
		identity.value &&
		(identity.value.allowedToEdit ||
			isSalesman.value ||
			isProvider.value  ||
			isSuperAdmin.value ) &&
		"BackOffice" !== route.name
	);
});
const isUser = computed(() => {
	return authDpHelper.isUser(identity.value);
});
const isSalesman = computed(() => {
	return authDpHelper.isSalesman(identity.value);
});
const isProvider = computed(() => {
	return authDpHelper.isProvider(identity.value);
});
const isSuperAdmin = computed(() => {
	return authDpHelper.isSuperAdmin(identity.value);
});
const allowedToComeBackToDP = computed(() => {
	return isSalesman.value || isSuperAdmin;
});

const logout = () => store.dispatch("account/logout");
const impersonateLogout = () => store.dispatch("account/impersonateLogout");

const reloadPage = () => {
	Navigation.methods.refreshPage();
};
const backToPartnershipFolder = () => {
	router.push(
		`/backoffice/dossier-partenaire/${currentPartner.value.customerCode}`
	);
};
</script>
