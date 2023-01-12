<template>
	<b-container fluid v-if="currentPartnerFolder">
		<b-row class="my-3">
			<b-col xl="3" lg="3" md="3" sm="4">
				<span class="mr-3">Travaillez-vous seul(e) ou en équipe ?</span>
			</b-col>
			<b-col lg="1" md="2" sm="3">
					<b-form-radio
						@change="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'bool',
              })
            "
						type="radio"
						name="currentPartnerFolder.isAlone"
						v-model="currentPartnerFolder.isAlone"
						:value="true"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						Seul(e)
					</b-form-radio>
			</b-col>
			<b-col lg="1" md="2" sm="3">
					<b-form-radio
						@change="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'bool',
              })
            "
						type="radio"
						name="currentPartnerFolder.isAlone"
						v-model="currentPartnerFolder.isAlone"
						:value="false"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						En équipe
					</b-form-radio>
			</b-col>
		</b-row>
		<b-row>
			<b-col v-if="currentPartnerFolder.workAloneOrTeam">
        <span class="wording-comment"
		>Valeur saisie par le commercial en RDV :
          <i>{{ currentPartnerFolder.workAloneOrTeam }}</i></span
		>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col xl="3" lg="3" md="3" sm="4">
        <span class="mr-3"
		>Avec quel pronom devons-nous rédiger votre site ?
          <i
			  class="far fa-question-circle custom-tooltip"
			  v-b-tooltip.hover
			  title="Exemple : J’interviens sous 24h après la demande / Nous intervenons sous 24h après la demande"
		  ></i
		  ></span>
			</b-col>
			<b-col lg="1" md="2" sm="3">
					<b-form-radio
						@change="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="radio"
						name="currentPartnerFolder.pronoun"
						v-model="currentPartnerFolder.pronoun"
						:value="'Je'"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						Je
					</b-form-radio>
			</b-col>
			<b-col lg="1" md="2" sm="3">
					<b-form-radio
						@change="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="radio"
						name="currentPartnerFolder.pronoun"
						v-model="currentPartnerFolder.pronoun"
						:value="'Nous'"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						Nous
					</b-form-radio>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col lg="6" md="6" sm="12">
					<label class="label"
					>Quelle est votre typologie client ?
						<i
							class="far fa-question-circle custom-tooltip"
							v-b-tooltip.hover.bottom
							title="Exemples : particulier / professionnels ; jeune de 25-35 ans ; personnes âgées ; famille ; etc. "
						></i
						></label>
					<b-form-textarea
						v-if="allowedToEdit"
						v-autoresize
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.customers"
						v-model="currentPartnerFolder.customers"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
					</b-form-textarea>
					<div
						class="mx-2 pre-line-text"
						v-else-if="
              !allowedToEdit &&
              currentPartnerFolder.customers &&
              currentPartnerFolder.customers.length
            "
					>
						{{ currentPartnerFolder.customers }}
					</div>
			</b-col>
			<b-col lg="6" md="6" sm="12">
					<label class="label"
					>Qu'est-ce qui vous distingue des concurrents ?
						<i
							class="far fa-question-circle custom-tooltip"
							v-b-tooltip.hover.bottom
							title="Exemples : rapport qualité / prix ; dépannage dans l’heure; etc."
						></i
						></label>
					<div class="input-text" v-if="allowedToEdit">
						<b-form-textarea
							v-autoresize
							@focus="onFocus"
							@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
							type="text"
							:class="classes"
							name="currentPartnerFolder.competitor"
							v-model="currentPartnerFolder.competitor"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-textarea>
						<TextLengthMessage
							:value="!currentPartnerFolder || currentPartnerFolder.competitor"
							maxlength="255"
						/>
					</div>
					<div
						class="mx-2 pre-line-text"
						v-else-if="
              !allowedToEdit &&
              currentPartnerFolder.competitor &&
              currentPartnerFolder.competitor.length
            "
					>
						{{ currentPartnerFolder.competitor }}
					</div>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col lg="6" md="6" sm="12">
					<label class="label"
					>Parlez-nous de vous / de votre entreprise
						<i
							class="far fa-question-circle custom-tooltip"
							v-b-tooltip.hover.bottom
							title="Il faut récolter ici un maximum d’information afin de pouvoir orienter le rédacteur dans la bonne direction lorsqu’il va rédiger le contenu du site.
                    Cela peut-être par exemple :
                    Des informations à mettre en avant (devis gratuit, intervention sous 24h, etc.)
                    Des informations sur le travail du partenaire (qualité, sur-mesure, processus de fabrication, etc.)"
						></i
						></label>
					<b-form-textarea
						v-if="allowedToEdit"
						v-autoresize
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.companyDetails"
						v-model="currentPartnerFolder.companyDetails"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
					</b-form-textarea>
					<div
						class="mx-2 pre-line-text"
						v-else-if="
              !allowedToEdit &&
              currentPartnerFolder.companyDetails &&
              currentPartnerFolder.companyDetails.length
            "
					>
						{{ currentPartnerFolder.companyDetails }}
					</div>
			</b-col>
			<b-col lg="6" md="6" sm="12">
					<label class="label">Avec quelles marques travaillez-vous ?</label>
					<b-form-textarea
						v-if="allowedToEdit"
						v-autoresize
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.partners"
						v-model="currentPartnerFolder.partners"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-textarea>
					<div
						class="mx-2 pre-line-text"
						v-else-if="
              !allowedToEdit &&
              currentPartnerFolder.partners &&
              currentPartnerFolder.partners.length
            "
					>
						{{ currentPartnerFolder.partners }}
					</div>
			</b-col>
		</b-row>
		<b-row class="my-3 keyword-group">
			<b-col cols="11">
					<label class="label"
					>Avez-vous des mots-clés liés à votre activité que vous souhaiteriez
						voir sur votre site ?</label
					>
					<b-form-tags
						id="activity-keywords"
						@input="
              onTagsChange(
                $event,
                { partnerFolder: currentPartnerFolder },
                'activityKeywords'
              )
            "
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						tag-variant="local-orange"
						size="md"
						placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
						:class="classes"
						remove-on-delete
						name="currentPartnerFolder.activityKeywords"
						v-model="currentPartnerFolder.activityKeywords"
					></b-form-tags>
			</b-col>
			<b-col cols="1" align-self="center" class="text-center">
				<b-button
					@click="
            uiActions.copy2clipboard(currentPartnerFolder.activityKeywords)
          "
					size="md"
					class="button-copy"
					v-if="
            currentPartnerFolder.activityKeywords &&
            currentPartnerFolder.activityKeywords.length >= 1
          "
					v-b-tooltip.hover
					title="Copier dans le presse-papier"
				>
					<i class="fas fa-copy"></i>
				</b-button>
			</b-col>
		</b-row>
		<b-row class="my-3 keyword-group">
			<b-col cols="11">
					<label class="label"
					>A contrario, avez-vous des mots-clés que vous n'avez pas le droit
						d'utiliser dans votre activité ?
						<i
							class="far fa-question-circle custom-tooltip"
							v-b-tooltip.hover.right
							title="Exemple : l’utilisation de la marque 'placo' ; le mot 'paysagiste' ou 'prothésiste ongulaire', etc."
						></i>
					</label>
					<b-form-tags
						id="forbidden-activity-keywords"
						@input="
              onTagsChange(
                $event,
                { partnerFolder: currentPartnerFolder },
                'forbiddenActivityKeywords'
              )
            "
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						tag-variant="local-orange"
						size="md"
						placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
						:class="classes"
						remove-on-delete
						name="currentPartnerFolder.forbiddenActivityKeywords"
						v-model="currentPartnerFolder.forbiddenActivityKeywords"
					></b-form-tags>
			</b-col>
			<b-col cols="1" align-self="center" class="text-center">
				<b-button
					@click="
            uiActions.copy2clipboard(
              currentPartnerFolder.forbiddenActivityKeywords
            )
          "
					size="md"
					class="button-copy"
					v-if="
            currentPartnerFolder.forbiddenActivityKeywords &&
            currentPartnerFolder.forbiddenActivityKeywords.length >= 1
          "
					v-b-tooltip.hover
					title="Copier dans le presse-papier"
				>
					<i class="fas fa-copy"></i>
				</b-button>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col xl="3" lg="3" md="3" sm="4">
        <span class="mr-3"
		>Si vous possédez un site existant, pouvons-nous récupérer des
          informations / textes sur votre ancien site ?</span
		>
			</b-col>
			<b-col lg="1" md="2" sm="3">

					<b-form-radio
						@change="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'bool',
              })
            "
						type="radio"
						name="currentPartnerFolder.getDataFromSite"
						v-model="currentPartnerFolder.getDataFromSite"
						:value="true"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						Oui
					</b-form-radio>

			</b-col>
			<b-col lg="1" md="2" sm="3">
					<b-form-radio
						@change="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'bool',
              })
            "
						type="radio"
						name="currentPartnerFolder.getDataFromSite"
						v-model="currentPartnerFolder.getDataFromSite"
						:value="false"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						Non
					</b-form-radio>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<label class="label mt-2"
			>Avant quelle date, allez-vous nous envoyer des éléments ?</label
			>
			<b-col lg="2" md="2" sm="12">
					<b-form-datepicker
						@focus="onFocus"
						@input="
              onSendElementsDateChange($event, {
                partnerFolder: currentPartnerFolder,
              })
            "
						type="date"
						:class="classes"
						name="currentPartnerFolder.sentElementsDate"
						v-model="sentElementsDate"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						:max="maxDate"
					></b-form-datepicker>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import autoresize from "@/directives/AutoResize.vue";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import {useDP} from "@/mixins/useDP";
import {useStore} from "vuex";
import {uiActions as uiActionsData, dateHelpers} from "@/helpers";
import {BContainer, BRow, BCol, BFormRadio} from "bootstrap-vue-3";

const store = useStore();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);
const salesforce = computed(() => store.state.globalStore.salesforce);
const allowedToEdit = computed(() => {identity.value.allowedToEdit});

const {verifyFields} = useDP();


const sentElementsDate = computed({
	get() {
		return currentPartnerFolder.value.sentElementsDate
			? dateHelpers.dateToStringForInput(
				currentPartnerFolder.value.sentElementsDate
			)
			: null;
	},
	set(value) {
		return (currentPartnerFolder.value.sentElementsDate = value);
	},
});
const maxDate = computed(() => {
	return !salesforce.value.opportunity ||
	!salesforce.value.opportunity.Date_signature2__c
		? null
		: momentBusinessDays(
			salesforce.value.opportunity.Date_signature2__c,
			"YYYY-MM-DD"
		)
			.businessAdd(10)
			.toDate();
});

const uiActions = ref(uiActionsData);
const previousEditedValue = ref(null);

const updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event) => {
	previousEditedValue.value = event.target.value;
};
const onBlur = (event, data) => {
	const provider = ref[event.target.name];
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	});
	verifyFields();
};
const onSendElementsDateChange = (date, data) => {
	if (!date) {
		return;
	}

	data.payload = {
		sentElementsDate: date,
	};

	updatePartnerPropertyFromForm({data});
};
const onTagsChange = (value, data, offset) => {
	data.value = value;
	data.offset = offset;
	updatePartnerPropertyFromForm({
		data: data,
	});
	verifyFields();
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
