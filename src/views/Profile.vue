<template>
	<div class="profile" @click="close_menu">
		<app-headerbuttons></app-headerbuttons>
		<b-container fluid class="bc-example-row">
			<b-row>
				<menu-profile
					class="hidden-for-mobile margin-profile"
				></menu-profile>
				<app-menumobile class="menu-mobile"></app-menumobile>
				<fade-loader
					v-if="status.isPageLoading"
					class="loader-site hidden-for-mobile"
					:color="color"
				></fade-loader>
				<notifications
					group="mail-sent"
					position="bottom right"
					class="notification-container"
				/>


				<b-col lg="9" md="12" sm="12">
					<hr/>
					<div class="billing">
						<b-row>
							<b-col lg="6" md="6" sm="6" xs="12" cols="12">
								<h3 class="factu-title">
									Coordonnées de facturation
									<img
										v-b-modal.modal-1
										class="edit-logo"
										src="@/assets/edit.png"
									/>
								</h3>
							</b-col>
							<b-col lg="6" md="6" sm="6" xs="6" cols="12">
								<customer-ref></customer-ref>
							</b-col>
							<b-col
								v-if="
                  !status.isPageLoading &&
                  salesforce.account &&
                  salesforce.contact
                "
								lg="12"
							>
								<div>
									<p>
										Raison sociale :
										<strong>{{ salesforce.account.Raison_sociale__c }}</strong>
									</p>
									<p>
										Nom : <strong>{{ salesforce.contact.LastName }}</strong>
									</p>
									<p>
										Prénom : <strong>{{ salesforce.contact.FirstName }}</strong>
									</p>
									<p>
										Adresse :
										<strong>{{ salesforce.account.BillingStreet }}</strong>
									</p>
									<p>
										CP Ville :
										<strong>{{ salesforce.account.BillingPostalCode }}</strong>
									</p>
									<p>
										Téléphone Fixe :
										<strong>{{ salesforce.account.Phone }}</strong>
									</p>
									<p>
										Téléphone portable :
										<strong>{{ salesforce.contact.MobilePhone }}</strong>
									</p>
									<p>
										E-mail : <strong>{{ salesforce.contact.Email }}</strong>
									</p>
								</div>
							</b-col>
						</b-row>
					</div>
				</b-col>
			</b-row>
			<b-modal id="modal-1" name="modal-edit-factu" width="70%" height="330px" v-show="true" hideFooter="true" hideHeader="trues">

				<fade-loader
					v-if="status.isNewBillingInfoSending"
					class="loader-site hidden-for-mobile"
					:color="color"
				></fade-loader>
				<div
					v-if="!status.isNewBillingInfoSending"
					class="edit-factu-infos-modal"
				>
					<h3>
						Modifications de coordonnées
						<span
						><img
							class="button-close"
							@click="close_modal"
							src="@/assets/close.png"
						/></span>
					</h3>
					<hr/>
					<p>Indiquez ici les modifications à apporter</p>
					<b-form-textarea
						v-model="message"
						id="textarea1"
						placeholder="Description"
						rows="3"
						wrap="soft"
					></b-form-textarea
					>
					<br/>
					<button
						@click="sendNewBillingInfo()"
						class="newsletter-btn"
						type="submit"
						v-bind:disabled="status.isNewBillingInfoSending"
					>
						Envoyer
					</button>
				</div>
			</b-modal>

		</b-container>
		<footer class="footer-profile"/>
	</div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import MenuMobile from "@/components/MenuMobile.vue";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import {computed, ref} from "vue";
import {BButton, BCol, BContainer, BModal, BRow} from "bootstrap-vue-3";
import Footer from "@/components/Footer.vue";
import MenuProfile from "@/components/MenuProfile.vue";
import CustomerRef from "@/components/CustomerRef.vue";

const store = useStore();

const identity = computed(() => store.state.account.identity);
const salesforce = computed(() => store.state.globalStore.salesforce);
const status = computed(() => store.state.globalStore.status);
let modal = ref(false);

const message = ref("");
const color = ref("#ec008c");

const sendNewBillingInfoMail = (value: any) => store.dispatch("globalStore/sendNewBillingInfoMail", value);

const feedback = () => {
	(function (t, e, s, o) {
		let n, c, l;
		(t.SMCX = t.SMCX || []),
		e.getElementById(o) ||
		((n = e.getElementsByTagName(s)),
			(c = n[n.length - 1]),
			(l = e.createElement(s)),
			(l.type = "text/javascript"),
			(l.async = !0),
			(l.id = o),
			(l.src = [
				"https:" === location.protocol ? "https://" : "http://",
				"widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd9QuxQWSQk99_2FVuA3ik9gvgH5IGpj66HI3poKGa9ebrp.js",
			].join("")),
			c.parentNode.insertBefore(l, c));
	})(window, document, "script", "smcx-sdk");
};

const sendNewBillingInfo = () => {
	const data = {
		email: identity.value.email,
		sageCode: salesforce.value.account.Code_Sage__c,
		message: message,
	};
	sendNewBillingInfoMail({data}).then(() => {
		close_modal();
	});
};

const open_edit_factu_modale = () => {
	modal.value = !modal.value;
};

const close_modal = () => {
	modal.value = false;
};

const close_menu = () => {
	if (document.getElementById("mySidenav")) {
		document.getElementById("mySidenav").style.width = "0";
	}
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/accueil.scss";
@import "@/assets/style/profile.scss";
.edit-factu-infos-modal {
	padding: 1em;
}
</style>
