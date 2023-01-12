<template>
	<b-container fluid  v-if="currentPartnerFolder">
		<!-- your profile -->
		<b-row class="my-3">
			<b-col lg="6" md="6" sm="12">
					<label class="label">Vos expériences</label>
					<b-form-textarea
						v-if="currentPartnerFolder"
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="textarea"
						:class="classes"
						name="currentPartnerFolder.experience"
						v-model="currentPartnerFolder.value.experience"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-textarea>
			</b-col>
			<b-col lg="6" md="6" sm="12">
					<label class="label">Zones géographiques</label>
					<b-form-textarea
						v-if="currentPartnerFolder"
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.geographicalArea"
						v-model="currentPartnerFolder.geographicalArea"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-textarea>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col>
					<label class="label">Prestations détaillées</label>
					<b-form-input
						v-if="currentPartnerFolder"
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.serviceDetails"
						v-model="currentPartnerFolder.serviceDetails"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col lg="4" md="6" sm="12">
					<label class="label">Nombre de clients / chantiers</label>
					<b-form-input
						v-if="currentPartnerFolder"

						@focus="onFocus"
						@blur="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'int',
              })
            "
						type="text"
						:class="classes"
						name="currentPartnerFolder.clientNumber"
						v-model="currentPartnerFolder.clientNumber"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
			</b-col>
			<b-col lg="4" md="6" sm="12">
					<label class="label">Panier moyen</label>
					<b-form-input
						v-if="currentPartnerFolder"

						@focus="onFocus"
						@blur="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'int',
              })
            "
						type="text"
						:class="classes"
						name="currentPartnerFolder.averageBasket"
						v-model="currentPartnerFolder.averageBasket"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
			</b-col>
			<b-col lg="4" md="6" sm="12">
					<label class="label">Chiffre d'affaires</label>
					<b-form-input
						@focus="onFocus"
						@blur="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'int',
              })
            "
						type="text"
						:class="classes"
						name="currentPartnerFolder.grossSales"
						v-model="currentPartnerFolder.grossSales"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col>
					<label class="label">Points forts / Concurrence</label>
					<b-form-input
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.keyPoints"
						v-model="currentPartnerFolder.keyPoints"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col>

					<label class="label">Commentaires</label>
					<b-form-textarea
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.companyComment"
						v-model="currentPartnerFolder.companyComment"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-textarea>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col md="6">
				<!-- unknown field -->
					<label class="label">Concepts et objectifs de la boutique</label>
					<b-form-input
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.goalsStore"
						v-model="currentPartnerFolder.goalsStore"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
			</b-col>
			<b-col md="6">
				<!-- unknown field -->
					<label class="label">Type de produits et marques proposées</label>
					<b-form-input
						@focus="onFocus"
						@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
						type="text"
						:class="classes"
						name="currentPartnerFolder.productBrands"
						v-model="currentPartnerFolder.productBrands"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {useDP} from "@/mixins/useDP";
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {BFormInput, BRow, BContainer, BCol, BFormTextarea} from "bootstrap-vue-3";

const {allowedToEdit} = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
	() => store.state.account.currentPartnerFolder
);

const previousEditedValue = ref(null);

const updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
	previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: any) => {
	const provider = ref[event.target.name];
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	});
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
