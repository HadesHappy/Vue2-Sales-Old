<template>
	<b-container fluid>
		<!-- your company -->
		<b-row class="my-3">
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Enseigne"
					rules="required|min:3|max:255"
					ref="salesforce.account.Name"
				>
					<label class="label">Enseigne</label>
					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { account: salesforce.account })"
							type="text"
							:class="classes"
							name="salesforce.account.Name"
							v-model="salesforce.account.Name"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage
							:value="!salesforce || salesforce.account.Name"
							maxlength="255"
						/>
					</div>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<label class="label">Raison sociale</label>
				<div class="input-text">
					<b-form-input
						@focus="onFocus"
						type="text"
						name="salesforce.account.Raison_sociale__c"
						v-model="salesforce.account.Raison_sociale__c"
						disabled
					></b-form-input>
				</div>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<label class="label">Forme de la société</label>
				<b-form-select
					type="select"
					v-model="salesforce.account.Ownership"
					:options="companyFormList"
					disabled
					name="salesforce.account.Ownership"
				>
				</b-form-select>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Code APE"
					rules="required"
					ref="salesforce.account.Code_Ape__c"
				>
					<label class="label">Code APE</label>
					<b-form-select
						type="select"
						@change="onBlur($event, { account: salesforce.account })"
						name="salesforce.account.Code_Ape__c"
						v-model="salesforce.account.Code_Ape__c"
						:options="apeCodeList"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-select>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Secteur d'activité"
					rules="required"
					ref="salesforce.account.Industry"
				>
					<label class="label">Secteur d'activité</label>
					<b-form-select
						type="select"
						@change="onBlur($event, { account: salesforce.account })"
						name="salesforce.account.Industry"
						v-model="salesforce.account.Industry"
						:options="industries"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-select>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Siret"
					rules="required|min:14|siretValidation"
					ref="salesforce.account.Siren__c"
				>
					<label class="label">Siret</label>
					<b-form-input
						@focus="onFocus"
						@blur="onSiretBlur($event, { account: salesforce.account })"
						type="text"
						:class="classes"
						name="salesforce.account.Siren__c"
						v-model="salesforceSiret"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Adresse"
					rules="required|min:3|max:255"
					ref="salesforce.account.BillingStreet"
				>
					<label class="label">Adresse</label>
					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { account: salesforce.account })"
							type="text"
							:class="classes"
							name="salesforce.account.BillingStreet"
							v-model="salesforce.account.BillingStreet"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage
							:value="!salesforce || salesforce.account.BillingStreet"
							maxlength="255"
						/>
					</div>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Code postal"
					rules="required|integer|max:20"
					ref="salesforce.account.BillingPostalCode"

				>
					<label class="label">Code postal</label>
					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { account: salesforce.account })"
							type="number"
							:class="classes"
							name="salesforce.account.BillingPostalCode"
							v-model="salesforce.account.BillingPostalCode"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage
							:value="!salesforce || salesforce.account.BillingPostalCode"
							maxlength="20"
						/>
					</div>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Ville"
					rules="required|min:3|max:40"
					ref="salesforce.account.BillingCity"
				>
					<label class="label">Ville</label>
					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { account: salesforce.account })"
							type="text"
							:class="classes"
							name="salesforce.account.BillingCity"
							v-model="salesforce.account.BillingCity"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						>
						</b-form-input>
						<TextLengthMessage
							:value="!salesforce || salesforce.account.BillingCity"
							maxlength="40"
						/>
					</div>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Prénom"
					rules="required|min:2|max:255"
					ref="salesforce.contact.FirstName"
				>
					<label class="label">Prénom</label>
					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { contact: salesforce.contact })"
							type="text"
							:class="classes"
							name="salesforce.contact.FirstName"
							v-model="salesforce.contact.FirstName"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage
							:value="!salesforce || salesforce.contact.FirstName"
							maxlength="255"
						/>
					</div>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Nom"
					rules="required|min:2|max:255"
					ref="salesforce.contact.LastName"
				>
					<label class="label">Nom</label>
					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { contact: salesforce.contact })"
							type="text"
							:class="classes"
							name="salesforce.contact.LastName"
							v-model="salesforce.contact.LastName"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage
							:value="!salesforce || salesforce.contact.LastName"
							maxlength="255"
						/>
					</div>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Date de naissance"
					rules="min:3"
					ref="salesforce.contact.Birthdate"

				>
					<label class="label">Date de naissance</label>
					<b-form-input
						@focus="onFocus"
						@blur="onBlur($event, { contact: salesforce.contact })"
						type="date"
						:class="classes"
						name="salesforce.contact.Birthdate"
						v-model="salesforce.contact.Birthdate"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						placeholder="Aucune date sélectionnée"
					></b-form-input>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Email"
					rules="required|min:8|max:255|email"
					ref="salesforce.contact.Email"
				>
					<label class="label">Email</label>
					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { contact: salesforce.contact })"
							type="email"
							:class="classes"
							name="salesforce.contact.Email"
							v-model="salesforce.contact.Email"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage
							:value="!salesforce || salesforce.contact.Email"
							maxlength="255"
						/>
					</div>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Téléphone"
					:rules="{ expectedValidPhone: salesforce.account.Phone }"
					ref="salesforce.account.Phone"
				>
					<label class="label">Téléphone</label>
					<b-form-input
						@focus="onFocus"
						@blur="onBlur($event, { account: salesforce.account })"
						type="tel"
						:class="classes"
						name="salesforce.account.Phone"
						v-model="salesforce.account.Phone"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-input>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
			<b-col lg="4" md="6" sm="12">
				<ValidationProvider
					name="Date de création"
					rules="min:3"
					ref="salesforce.account.Date_de_cr_ation__c"
				>
					<label class="label">Date de création</label>
					<b-form-input
						@focus="onFocus"
						@blur="onBlur($event, { account: salesforce.account })"
						type="date"
						:class="classes"
						name="salesforce.account.Date_de_cr_ation__c"
						v-model="salesforce.account.Date_de_cr_ation__c"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						placeholder="Aucune date sélectionnée"
					></b-form-input>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {siretValidation, validateSection} from "@/helpers";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import {useStore} from "vuex";
import {companyFormList as companyFormListInterface} from "@/Interface/companyFormList";
import {apeCodeList as apeCodeListInterface} from "@/Interface/apeCode";
import {industries as industriesInterface} from "@/Interface/industries";
//import { extend } from "vee-validate";
import {useDP} from "@/mixins/useDP";
import {computed, ref} from "vue";

const store = useStore();
const {verifyFields, allowedToEdit} = useDP();

// Custom validator for Siret number
// extend("siretValidation", {
//   validate(value) {
//     return siretValidation.validateSiret(value);
//   },
//   message: "Le numéro siret est invalide",
// });

const identity = computed(() => store.state.account.identity);
const salesforce = computed(() => store.state.globalStore.salesforce);
const status = computed(() => store.state.globalStore.status);

const companyFormList = ref(companyFormListInterface);
const apeCodeList = ref(apeCodeListInterface);
const industries = ref(industriesInterface);
const previousEditedValue = ref(null);

const salesforceSiret = computed({
	get() {
		if (
			null === salesforce.value.account.Siren__c ||
			null === salesforce.value.account.Nic__c
		) {
			return null;
		} else {
			return (
				salesforce.value.account.Siren__c + salesforce.value.account.Nic__c
			);
		}
	},
	set(value) {
		if (value) {
			salesforce.value.account.Siren__c = value.substring(0, 9);
			salesforce.value.account.Nic__c = value.substring(9);
		}
	},
});

const updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
	previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: any) => {
	const provider = ref[event.target.name];
	console.log(provider);
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	}).then(() => verifyFields());
};
const onSiretBlur = (
	event: any,
	data: { payload: { Siren__c: any; Nic__c: any } }
) => {
	data.payload = {
		Siren__c: salesforce.value.account.Siren__c,
		Nic__c: salesforce.value.account.Nic__c,
	};
	onBlur(event, data);
};
const validateFields = async (refs: any, entity: any) => {
	if (!allowedToEdit) {
		validateSection.displayColorStateOnSection("company-form", "reset");
		return;
	}

	let isValid = await validateSection.validateRequiredFields(
		entity,
		refs,
		"Siren__c"
	);
	if (isValid) {
		isValid =
			!!salesforceSiret.value && siretValidation.validateSiret(salesforceSiret);
		if (!isValid) {
			await ref["salesforce.account.Siren__c"].validate();
		}
	}

	validateSection.displayColorStateOnSection("company-form", isValid);
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
