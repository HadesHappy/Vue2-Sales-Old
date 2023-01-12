<template>
	<b-container fluid v-if="currentPartnerFolder">
		<b-row class="mt-3 mb-3">
			<b-col md="6">
				<label class="label"
				>Avez-vous un logo existant à nous transmettre ?</label
				>

					<b-form-select
						@change="onBlur($event, { site: currentPartnerFolder.sites[0] })"
						:class="classes"
						name="currentPartnerFolder.sites.0.hasLogo"
						v-model="currentPartnerFolder.sites[0].hasLogo"
						:options="hasLogoChoice"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-select>

			</b-col>
		</b-row>
		<b-row class="my-3" v-if="'Non' === currentPartnerFolder.sites[0].hasLogo">
			<b-col md="6">
				<label class="label">Souhaitez-vous une création de logo ?</label>
					<b-form-select
						:class="classes"
						@change="onBlur($event, { opportunity: salesforce.opportunity })"
						name="salesforce.opportunity.Cr_ation_logo__c"
						v-model="salesforce.opportunity.Cr_ation_logo__c"
						:options="yesNoOptions"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-select>
			</b-col>
			<b-col
				md="12"
				v-if="!logoCreation"
				class="mt-3"
				:class="logoCreation ? null : 'no-logo-creation-disclaimer'"
			>
				Si vous n'avez pas de logo, nous proposerons un lettrage, l'enseigne de
				votre entreprise sera écrite en texte sur votre site internet.
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useDP} from "@/mixins/useDP";
import {useStore} from "vuex";
import {
	hasLogoChoice,
	yesNoOptions,
	todoWithLogoOptions,
} from "@/Interface/partnershipFolderDatas";
import {BCol, BContainer, BRow} from "bootstrap-vue-3";

const {allowedToEdit, verifyFields} = useDP();
const store = useStore();
const previousEditedValue = ref(null);

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);

const salesforce = computed(() => store.state.globalStore.salesforce);
const logoCreation = computed(
	() => salesforce.value.opportunity.Cr_ation_logo__c
);

const updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: any } }) => {
	previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: any) => {
	updatePartnerPropertyFromForm({
		event: event,
		provider: ref[event.target.name],
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	}).then(() => verifyFields());
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
