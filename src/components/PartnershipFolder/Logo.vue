<template>
	<b-container fluid>
		<b-row v-if="status.hasLogoCreation || (logoCreation && !isMiniOffer)">
			<b-col md="6" class="my-3">
				<label class="label">Logo existant à moderniser ?</label>
				<b-form-select
					@change="onBlur($event, { site: currentPartnerFolder.sites[0] })"
					:class="classes"
					type="select"
					:options="todoWithLogoOptions"
					name="currentPartnerFolder.sites.0.todoWithLogo"
					v-model="todoWithLogo"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				></b-form-select>
			</b-col>
			<b-col md="6" class="my-3">
				<label class="label">Marque, appellation à faire figurer</label>
				<div class="input-text">
					<b-form-textarea
						@focus="onFocus"
						@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
						:class="classes"
						type="textarea"
						name="currentPartnerFolder.sites.0.logoBrand"
						v-model="currentPartnerFolder.sites[0].logoBrand"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-textarea>
					<TextLengthMessage
						:value="!currentSite || currentSite.logoBrand"
						maxlength="255"
					/>
				</div>
			</b-col>
			<b-col md="6" class="my-3" v-if="'Oui' === todoWithLogo">
				<label class="label"
				>Donner des précisions au graphiste sur le résultat attendu</label
				>
				<b-form-textarea
					@focus="onFocus"
					@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
					:class="classes"
					type="textarea"
					name="currentPartnerFolder.sites.0.logoDetails"
					v-model="currentPartnerFolder.sites[0].logoDetails"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				></b-form-textarea>
			</b-col>
			<b-col md="6" class="my-3">
				<label class="label">Slogan, claim, baseline à associer</label>
				<b-form-textarea
					@focus="onFocus"
					@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
					:class="classes"
					type="textarea"
					name="currentPartnerFolder.sites.0.logoClaim"
					v-model="currentPartnerFolder.sites[0].logoClaim"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				></b-form-textarea>
			</b-col>
			<b-col md="6" class="my-3">
				<label class="label">Typographie à respecter</label>
				<b-form-textarea
					@focus="onFocus"
					@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
					:class="classes"
					type="textarea"
					name="currentPartnerFolder.sites.0.logoFonts"
					v-model="currentPartnerFolder.sites[0].logoFonts"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				></b-form-textarea>
			</b-col>
			<b-col md="6" class="my-3">
				<label class="label"
				>Éléments figuratifs à intégrer (illustration symbole, ...)</label
				>
				<b-form-textarea
					@focus="onFocus"
					@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
					:class="classes"
					type="textarea"
					name="currentPartnerFolder.sites.0.logoValues"
					v-model="currentPartnerFolder.sites[0].logoValues"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				></b-form-textarea>
			</b-col>
			<b-col md="6" class="my-3">
				<label class="label">Couleurs souhaitées</label>
				<b-form-textarea
					@focus="onFocus"
					@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
					:class="classes"
					type="textarea"
					name="currentPartnerFolder.sites.0.logoColors"
					v-model="currentPartnerFolder.sites[0].logoColors"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				></b-form-textarea>
			</b-col>
			<b-col md="6" class="my-3">
				<label class="label">Image, valeurs, à faire passer dans le logo</label>
				<b-form-textarea
					@focus="onFocus"
					@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
					:class="classes"
					type="textarea"
					name="currentPartnerFolder.sites.0.logoPictures"
					v-model="currentPartnerFolder.sites[0].logoPictures"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				></b-form-textarea>
			</b-col>
			<b-col>
				<label class="label"
				>Logo de référence demo.local.fr (nom + numéro)</label
				>
				<div class="input-text">
					<b-form-textarea
						@focus="onFocus"
						@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
						:class="classes"
						type="textarea"
						name="currentPartnerFolder.sites.0.referenceLogo"
						v-model="currentPartnerFolder.sites[0].referenceLogo"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					></b-form-textarea>
					<TextLengthMessage
						:value="!currentSite || currentSite.referenceLogo"
						maxlength="255"
					/>
				</div>
			</b-col>
		</b-row>
		<b-row v-else-if="!isMiniOffer">
			<b-col>
				Le partenaire ne souhaitant pas une création logo, un lettrage de
				l'enseigne de son entreprise sera écrite en texte sur le site internet.
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {
	hasLogoChoice,
	todoWithLogoOptions,
} from "@/Interface/partnershipFolderDatas";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import {useDP} from "@/mixins/useDP";
import {BContainer,BRow,BCol} from "bootstrap-vue-3";

const store = useStore();
const {verifyFields, allowedToEdit} = useDP();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);
const status = computed(() => store.state.globalStore.status);
const salesforce = computed(() => store.state.globalStore.salesforce);
const isMiniOffer = computed(() => status.value.isLocalWeb || status.value.isLocalStart);
const logoCreation = computed(() => salesforce.value.opportunity.Cr_ation_logo__c);

const todoWithLogo = ref("");
const previousEditedValue = ref(null);

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
	});
	verifyFields();
};

onMounted(() => {
	todoWithLogo.value = currentPartnerFolder.value.sites[0].todoWithLogo;
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
