<template>
	<div class="accueil" id="full-page">
		<app-headergeneral/>
		<b-container fluid class="ref-section d-lg-flex d-md-flex">
			<div class="ml-lg-auto ml-md-auto d-lg-flex d-md-flex">
				<div class="match-select-padding">
					<b>Référence de votre dossier :</b>
				</div>
				<div class="ml-lg-2 ml-md-2 min-w-250" v-if="currentPartner">
					<b-select
						:value="currentPartner.customerCode"
						@change="onPartnerChange($event)"
					>
						<option
							v-for="option in partnerOptions"
							:key="option.key"
							:value="option.value"
						>
							{{ option.label }}
						</option>
					</b-select>
				</div>
				<div class="ml-lg-2 ml-md-2 min-w-250" v-if="!currentPartner">
					<b-select value="none">
						<option value="none" disabled>Aucun dossier trouvé</option>
					</b-select>
				</div>
			</div>
		</b-container>
		<b-container fluid class="ref-section d-lg-flex d-md-flex">
			<div class="ml-lg-auto ml-md-auto d-lg-flex d-md-flex">
				<div><b>Site :</b></div>
				<div class="ml-lg-2 ml-md-2 min-w-250">
					<a
						v-if="null !== websiteLink && !status.isPageLoading"
						v-bind:href="websiteLink"
						target="_blank"
					>
						www.{{ websiteLink.replace(/https?:\/\//, "").replace("/", "") }}
					</a>
					<a v-if="null === websiteLink"> Aucun site </a>
				</div>
			</div>
		</b-container>
		<v-tour name="myTour" :steps="steps" class="hidden-for-mobile">
			<template
				v-if="currentPartner && true === currentPartner.showTutorial"
				v-slot="tour"
			>
				<transition name="fade">
					<div v-if="tour.currentStep === index">
						<v-step
							v-for="(step, index) of tour.steps"
							:key="index"
							:step="step"
							:previous-step="tour.previousStep"
							:next-step="tour.nextStep"
							:stop="tour.stop"
							:is-first="tour.isFirst"
							:is-last="tour.isLast"
							:labels="tour.labels"
						>
							<template>
								<div slot="actions">
									<button
										v-if="tour.currentStep !== 0"
										@click="tour.previousStep"
										class="step-button"
									>
										Précédent
									</button>
									<button
										v-if="tour.currentStep !== 7"
										@click="tour.nextStep"
										class="step-button"
									>
										Suivant
									</button>
									<button
										@click="
                      tour.stop();
                      onFinishTour();
                    "
										class="step-button"
									>
										Finir le tour
									</button>
								</div>
							</template>
						</v-step>
					</div>
				</transition>
			</template>
		</v-tour>
		<b-container fluid class="custom-container">
			<b-row>
				<b-row
					v-if="status.isPageLoading"
					class="hidden-for-mobile grey-fade"
				></b-row>
				<fade-loader
					v-if="status.isPageLoading"
					:color="color"
					class="loader-accueil"
				></fade-loader>
				<div id="v-step-1"></div>
				<b-col
					:lg="status.isNewLocalBoutique || status.isLocalRestoBoutique ? 3 : 4"
					md="6"
					sm="6"
					class="text-center pad-right"
					v-bind:class="{ unavailable: status.websiteInfoDisabled }"
				>
					<router-link class="link-menu" to="/presence/site">
						<img class="img-big" src="@/assets/infos-site.jpg"/>
						<div class="title-img-section pink">
							<p class="title-img">
								J'accède à toutes les informations relatives à mon site internet
							</p>
						</div>
					</router-link>
				</b-col>
				<b-col
					:lg="status.isNewLocalBoutique || status.isLocalRestoBoutique ? 3 : 4"
					md="6"
					sm="6"
					class="text-center pad-right hidden-for-mobile-only"
					:class="{
            unavailable:
              status.updateWebsiteDisabled ||
              (status.isWebtool && !isPublished),
          }"
				>
					<b-link
						class="link-menu"
						:href="!status.isWebtool || isPublished ? partner.url : null"
						target="_blank"
						:disabled="status.isWebtool && !isPublished"
					>
						<img class="img-big" src="@/assets/maj-site.jpg"/>
						<img
							v-if="status.isWebtool && !isPublished"
							class="img-under-construction"
							src="@/assets/under-construction.svg"
						/>
						<div class="title-img-section yellow">
							<p
								class="title-img off-line"
								v-if="status.isWebtool && !isPublished"
							>
								Ce site est en cours de réalisation
							</p>
							<p class="title-img on-line" v-else-if="!currentPartner">
								Je mets à jour mon site internet
							</p>
							<p class="title-img on-line" v-else>
								Je mets à jour mon site internet avec
								{{ currentPartner.source }}
							</p>
						</div>
					</b-link>
				</b-col>
				<b-col
					v-if="status.isNewLocalBoutique || status.isLocalRestoBoutique"
					:class="{
            unavailable:
              (!status.isNewLocalBoutique && !status.isLocalRestoBoutique) ||
              !partner.boutiqueUrl,
          }"
					class="text-center pad-right hidden-for-mobile-only"
					lg="3"
					md="6"
					sm="6"
					target="_blank"
				>
					<b-link class="link-menu" :href="partner.boutiqueUrl" target="_blank">
						<img class="img-big" src="@/assets/acces-rdv.jpg"/>
						<div class="title-img-section yellow">
							<p class="title-img on-line" v-if="currentPartner">
								Je mets à jour ma boutique
							</p>
						</div>
					</b-link>
				</b-col>
				<b-col
					v-if="!status.isLocalRestoBoutique"
					:lg="status.isNewLocalBoutique || status.isNewLocalResto ? 3 : 4"
					md="6"
					sm="6"
					class="text-center pad-right"
					:class="{ unavailable: status.websiteInfoDisabled }"
				>
					<router-link class="link-menu" to="presence/campagne">
						<img class="img-big" src="@/assets/google-infos.jpg"/>
						<div class="title-img-section black">
							<p class="title-img">
								Je retrouve tous mes rapports de campagne Google Ads
							</p>
						</div>
					</router-link>
				</b-col>
				<b-col
					v-if="status.isLocalRestoBoutique"
					:lg="status.isLocalRestoBoutique ? 3 : 4"
					class="text-center pad-right"
					md="6"
					sm="6"
					:class="{ unavailable: status.websiteInfoDisabled }"
				>
					<b-link
						:class="{
              unavailable: !status.isLocalRestoBoutique || !partner.toolBoxUrl,
            }"
						:href="partner.toolBoxUrl"
						target="_blank"
						class="link-menu"
					>
						<img class="img-big" src="@/assets/autologin-resa-table.jpg"/>
						<div class="title-img-section yellow">
							<p class="title-img one-line">
								Je mets à jour mon module de réservation de table
							</p>
						</div>
					</b-link>
				</b-col>
			</b-row>
			<b-row>
				<div id="v-step-0"></div>
				<b-col
					:lg="status.isLocalRestoBoutique ? 3 : 4"
					md="4"
					sm="6"
					class="text-center pad-right"
					:class="{ unavailable: status.isEcommerce }"
				>
					<router-link class="link-menu" to="performance/audience">
						<img class="img-by-3" src="@/assets/performance-outil.jpg"/>
						<div class="title-img-section-big pink">
							<p class="title-img on-line">
								J'accède aux performances de mon site
							</p>
						</div>
					</router-link>
				</b-col>
				<b-col
					v-if="status.isLocalRestoBoutique"
					:lg="status.isLocalRestoBoutique ? 3 : 4"
					md="6"
					sm="6"
					class="text-center pad-right"
					v-bind:class="{ unavailable: status.websiteInfoDisabled }"
				>
					<router-link class="link-menu" to="presence/campagne">
						<img
							style="height: 80%"
							class="img-by-3"
							src="@/assets/google-infos-croped.jpg"
						/>
						<div class="title-img-section-big black">
							<p class="title-img">
								Je retrouve tous mes rapports de campagne Google Ads
							</p>
						</div>
					</router-link>
				</b-col>
				<b-col
					:lg="status.isLocalRestoBoutique ? 3 : 4"
					md="4"
					sm="6"
					class="text-center pad-right"
					:class="{ unavailable: notAvailable_5 }"
				>
					<b-link class="link-menu" href="/demandes">
						<img class="img-by-3" src="@/assets/acces-demandes.jpg"/>
						<div class="title-img-section-big pink">
							<p class="title-img">
								J'accède à mes demandes en attente, en cours, ou terminées
							</p>
						</div>
					</b-link>
				</b-col>
				<b-col
					:lg="status.isLocalRestoBoutique ? 3 : 4"
					md="4"
					sm="6"
					class="text-center pad-right"
					:class="{ unavailable: status.websiteInfoDisabled }"
				>
					<router-link class="link-menu" to="/documents">
						<img class="img-by-3" src="@/assets/stockage-doc.jpg"/>
						<div class="title-img-section-big black">
							<p class="title-img">
								Je retrouve tous mes documents&nbsp;: contrats, avenants, RIB,
								échéanciers
							</p>
						</div>
					</router-link>
				</b-col>
			</b-row>
		</b-container>
		<app-footer></app-footer>
	</div>
</template>

<script lang="ts" setup>
import router from "@/router";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import {authDpHelper} from "@/helpers";
import useCookie from "@/mixins/useCookie";
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

// require("vue-tour/dist/vue-tour.css");
const identity = computed(() => store.state.account.identity);
const currentPartner = computed(() => store.state.account.currentPartner);
const status = computed(() => store.state.globalStore.status);
const partner = computed(() => store.state.globalStore.partner);
const websiteLink = computed(() => store.state.globalStore.websiteLink);
const websitePublicationDate = computed(
	() => store.state.globalStore.websitePublicationDate
);

const partnerOptions = computed(() => {
	return identity.value.partners.reduce(partnersReducer, []);
});
const partners : any = computed(() => {
	return identity.value.partners.reduce(partnersReducerObjectMap, {});
});
const isPublished = computed(() => {
	return null !== websitePublicationDate.value;
});

const steps = ref([
	{
		target: "#v-step-0",
		content:
			'<p class="title-tour">Bienvenue dans votre espace partenaire <strong>Local&moi</strong> !</p><p>Votre espace vous permet d\'avoir accès à toutes les informations sur votre partenariat en temps réel.</p>',
		params: {
			placement: "top",
		},
	},
	{
		target: "#v-step-1",
		content:
			"Découvrez les différentes rubriques auxquelles vous avez accès depuis ce menu d'accueil.",
		params: {
			placement: "left",
		},
	},
	{
		target: "#v-step-3",
		content:
			"Pour toutes demandes relatives à votre partenariat, contactez-nous !",
		params: {
			placement: "left",
		},
	},
	{
		target: "#v-step-4",
		content: "Accédez facilement aux différentes rubriques à tout moment.",
	},
	{
		target: "#v-step-4",
		content: "Mettez à jour votre site internet avec Webtool.",
	},
	{
		target: "#v-step-4",
		content: "Créez et assurez le suivi de vos demandes.",
	},
	{
		target: "#v-step-4",
		content: "Accédez à votre compte partenaire.",
	},
	{
		target: "#footer",
		content: "Retrouvez-nous sur les réseaux sociaux !",
		params: {
			placement: "bottom",
		},
	},
]);
const notAvailable_4 = ref(true);
const notAvailable_5 = ref(false);
const color = ref("#ec008c");

onMounted(() => {
	if (authDpHelper.isProvider(identity)) {
		router.push("/backoffice");
	}
	startTour();
});

const updatePartnerPropertyFromForm = (data: any) => store.dispatch("account/updatePartnerPropertyFromForm", data);
const loadSalesforceData = (value: any) => store.dispatch("globalStore/loadSalesforceData", value);

const startTour = () => {
	new Promise((resolve) => {
		const interval = setInterval(() => {
			if (!currentPartner.value) {
				return;
			}
			window.clearInterval(interval);
			resolve(currentPartner);
		}, 50);
	}).then(() => {
		if (
			currentPartner.value &&
			currentPartner.value.showTutorial &&
			!status.value.impersonated
		) {
			//TODO
			// $tours["myTour"].start();
		}
	});
};

const onFinishTour = () => {
	currentPartner.value.showTutorial = false;
	identity.value.partners.forEach((partner: any) => {
		if (partner.id === currentPartner.value.id) {
			partner.showTutorial = currentPartner.value.showTutorial;
		}
	});
	updatePartnerPropertyFromForm({
		data: {
			partner: currentPartner,
			payload: {
				showTutorial: currentPartner.value.showTutorial,
			},
		},
		skipPartnerHistory: true,
	});
};

const partnersReducer = (accumulator: any, currentValue: any) => {
	accumulator.push({
		key: `partner__select__option_${currentValue.customerCode}`,
		value: currentValue.customerCode,
		label: `${currentValue.customerCode} / ${currentValue.fullname}`,
		selected: currentValue.customerCode === currentPartner.value.customerCode,
	});
	return accumulator;
};
const partnersReducerObjectMap = (accumulator: any, currentValue: any) => {
	accumulator[currentValue.customerCode] = currentValue;
	return accumulator;
};
const onPartnerChange = (customerCode: any) => {
	loadSalesforceData({
		identity: identity,
		currentPartner: partners[customerCode],
		loadDocuments: false,
	});
};
</script>
