<template>
	<b-container fluid class="keyword-group" v-if="currentPartnerFolder">
		<b-row class="mb-3">
			<b-col>
				<span class="form-description">Mots-clés liés à l'activité</span>
			</b-col>
		</b-row>
		<!-- referencingForm -->
		<b-row class="mt-3 mb-3">
			<b-col cols="11">
				<label class="label"
				>Quels mots saississent vos clients sur Google pour chercher votre
					entreprise ou vos services ?
				</label>
				<b-form-tags
					id="keywords-1"
					@input="onInputTagsChange($event,currentPartnerFolder.sites[0],'seoKeywords' )"
					:tag-validator="validator"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
					tag-variant="local-orange"
					size="md"
					placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
					:class="classes"
					remove-on-delete
					name="currentPartnerFolder.sites.0.seoKeywords"
					v-model="currentPartnerFolder.sites[0].seoKeywords"
				></b-form-tags>

			</b-col>
			<b-col cols="1" align-self="center" class="text-center">
				<b-button
					@click="
            uiActions.copy2clipboard(currentPartnerFolder.sites[0].seoKeywords)
          "
					size="md"
					class="button-copy"
					v-if="
            currentPartnerFolder.sites[0].seoKeywords &&
            currentPartnerFolder.sites[0].seoKeywords.length
          "
					v-b-tooltip.hover
					title="Copier dans le presse-papier"
				>
					<i class="fas fa-copy"></i>
				</b-button>
			</b-col>
		</b-row>
		<b-row class="mt-3 mb-3">
			<b-col cols="11">
				<label class="label">Zone d'intervention (en km) </label>

					<b-form-input
						id="keywords-2"
						type="number"
						min="0"
						:class="classes"
						@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						name="currentPartnerFolder.sites.0.coverageArea"
						v-model="currentPartnerFolder.sites[0].coverageArea"
					></b-form-input>

			</b-col>
		</b-row>
		<b-row class="mt-3 mb-3">
			<b-col cols="11">

					<label class="label"
					>Villes et communes ciblées pour le référencement</label
					>
					<b-form-tags
						id="keywords-3"
						@input="
              onInputTagsChange(
                $event,
                currentPartnerFolder.sites[0],
                'seoCities'
              )
            "
						:tag-validator="validator"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						tag-variant="local-orange"
						size="md"
						placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
						:class="classes"
						remove-on-delete
						name="currentPartnerFolder.sites.0.seoCities"
						v-model="currentPartnerFolder.sites[0].seoCities"
					></b-form-tags>

			</b-col>
			<b-col
				cols="1"
				align-self="center"
				class="text-center"
				v-if="
          currentPartnerFolder.sites[0].seoCities &&
          currentPartnerFolder.sites[0].seoCities.length >= 1
        "
			>
				<b-button
					@click="
            uiActions.copy2clipboard(currentPartnerFolder.sites[0].seoCities)
          "
					size="md"
					class="button-copy"
					v-b-tooltip.hover
					title="Copier dans le presse-papier"
				>
					<i class="fas fa-copy"></i>
				</b-button>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {uiActions} from "@/helpers";
import {useDP} from "@/mixins/useDP";
import {BContainer, BRow,BButton,BCol} from "bootstrap-vue-3";

const store = useStore();
const {verifyFields, allowedToEdit} = useDP();

const previousEditedValue = ref(null);

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);

const updatePartnerPropertyFromForm = (value: any) => store.dispatch("account/updatePartnerPropertyFromForm", value);

const onBlur = (event: { target: { name: string | number } }, data: any) => {
	updatePartnerPropertyFromForm({
		event: event,
		provider: $refs[event.target.name],
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	});
	verifyFields();
};

const onInputTagsChange = (
	value: any,
	site: { [x: string]: any; id: any },
	offset: string | number
) => {
	let promise;
	if (site && !site.id) {
		site[offset] = value;
		promise = updatePartnerPropertyFromForm({
			data: {
				site: site,
			},
		});
	} else {
		promise = updatePartnerPropertyFromForm({
			data: {
				value: value,
				offset: offset,
				site: site,
			},
		});
	}

	promise.then(() => verifyFields());
};

const validator = (tag: string | any[]) => {
	return tag.length > 2;
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
