<template>
	<b-container fluid v-if="currentPartnerFolder">
		<b-row class="mb-3">
			<b-col md="6">
				<b-row align-v="end">
					<b-col md="6">
							<label class="label">Couleur dominante</label>
							<div class="input-text">
								<b-form-input
									@focus="onFocus"
									@change="
                    onColorChange($event, {
                      site: currentPartnerFolder.sites[0],
                    })
                  "
									type="color"
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
									name="currentPartnerFolder.sites.0.mainColor"
									v-model="currentPartnerFolder.sites[0].mainColor"
								></b-form-input>
								<TextLengthMessage
									:value="!currentSite || currentSite.mainColor"
									maxlength="255"
								/>
							</div>
					</b-col>
					<b-col md="4" class="mb-2">
            <span>{{
					currentPartnerFolder.sites[0].mainColor
						? currentPartnerFolder.sites[0].mainColor
						: "Aucune couleur sélectionnée"
				}}</span>
					</b-col>
				</b-row>
			</b-col>
			<b-col md="6">
				<b-row align-v="end">
					<b-col md="6">
							<label class="label">Couleur secondaire</label>
							<div class="input-text">
								<b-form-input
									@focus="onFocus"
									@change="
                    onColorChange($event, {
                      site: currentPartnerFolder.sites[0],
                    })
                  "
									type="color"
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
									name="currentPartnerFolder.sites.0.secondaryColor"
									v-model="currentPartnerFolder.sites[0].secondaryColor"
								></b-form-input>
								<TextLengthMessage
									:value="!currentSite || currentSite.secondaryColor"
									maxlength="255"
								/>
							</div>
					</b-col>
					<b-col md="4" class="mb-2">
            <span>{{
					currentPartnerFolder.sites[0].secondaryColor
						? currentPartnerFolder.sites[0].secondaryColor
						: "Aucune couleur sélectionnée"
				}}</span>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
		<b-row class="mt-3 mb-3">
			<b-col md="6">
					<label class="label">Référence palette ou code couleur</label>
					<div class="input-text">
						<b-form-textarea
							@focus="onFocus"
							@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
							type="textarea"
							:class="classes"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
							name="currentPartnerFolder.sites.0.colorScheme"
							v-model="currentPartnerFolder.sites[0].colorScheme"
						></b-form-textarea>
						<TextLengthMessage
							:value="!currentSite || currentSite.colorScheme"
							maxlength="80"
						/>
					</div>
			</b-col>
			<b-col md="6">
x					<label class="label">Style de site</label>
					<div class="input-text">
						<b-form-textarea
							@focus="onFocus"
							@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
							type="textarea"
							:class="classes"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
							name="currentPartnerFolder.sites.0.siteStyle"
							v-model="currentPartnerFolder.sites[0].siteStyle"
						></b-form-textarea>
						<TextLengthMessage
							:value="!currentSite || currentSite.siteStyle"
							maxlength="255"
						/>
					</div>
			</b-col>
		</b-row>
		<b-row class="mt-3 mb-3">
			<b-col>
					<label class="label">Site référence demo.local.fr</label>
					<div class="input-text">
						<b-form-textarea
							@focus="onFocus"
							@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
							type="textarea"
							:class="classes"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
							name="currentPartnerFolder.sites.0.referenceDemo"
							v-model="currentPartnerFolder.sites[0].referenceDemo"
						></b-form-textarea>
						<TextLengthMessage
							:value="!currentSite || currentSite.referenceDemo"
							maxlength="255"
						/>
					</div>
			</b-col>
		</b-row>
		<b-row class="mt-3 mb-3">
			<b-col>
					<label class="label"
					>Motivation du professionnel / indications pour le graphiste</label
					>
					<b-form-textarea
						@focus="onFocus"
						v-if="allowedToEdit"
						rows="3"
						@blur="onBlur($event, { site: currentPartnerFolder.sites[0] })"
						type="textarea"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						name="currentPartnerFolder.sites.0.motivation"
						v-model="currentPartnerFolder.sites[0].motivation"
					></b-form-textarea>
					<div
						class="pre-line-text"
						v-else-if="
              !allowedToEdit &&
              currentPartnerFolder.sites[0].motivation &&
              currentPartnerFolder.sites[0].motivation.length
            "
					>
						{{ currentPartnerFolder.sites[0].motivation }}
					</div>
			</b-col>
		</b-row>
		<b-row class="mt-5">
			<b-col md="6">
					<label>
						<b-form-checkbox
							@change="
                onGraphicalElementChecked({
                  site: currentPartnerFolder.sites[0],
                  type: 'bool',
                  offset: 'withGoogleMap',
                  value: currentPartnerFolder.sites[0].withGoogleMap,
                })
              "
							type="checkbox"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
							name="currentPartnerFolder.sites.0.withGoogleMap"
							v-model="withoutGoogleMap"
						>
							Pas de Google Maps
						</b-form-checkbox>
					</label>
			</b-col>
			<b-col md="6">
					<label>
						<b-form-checkbox
							@change="
                onGraphicalElementChecked({
                  site: currentPartnerFolder.sites[0],
                  type: 'bool',
                  offset: 'withContactForm',
                  value: currentPartnerFolder.sites[0].withContactForm,
                })
              "
							type="checkbox"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
							name="currentPartnerFolder.sites.0.withContactForm"
							v-model="withoutContactForm"
						>
							Pas de formulaire de contact
						</b-form-checkbox>
					</label>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import autoresize from "@/directives/AutoResize.vue";
import {useDP} from "@/mixins/useDP";
import {useStore} from "vuex";
import {BCol, BContainer, BRow} from "bootstrap-vue-3";

const {verifyFields, allowedToEdit} = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);

const previousEditedValue = ref(null);

const withoutGoogleMap = computed({
	get() {
		return true !== currentPartnerFolder.value.sites[0].withGoogleMap;
	},
	set(val) {
		currentPartnerFolder.value.sites[0].withGoogleMap = false === val;
	},
});
const withoutContactForm = computed({
	get() {
		return true !== currentPartnerFolder.value.sites[0].withContactForm;
	},
	set(val) {
		currentPartnerFolder.value.sites[0].withContactForm = false === val;
	},
});

const updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: any } }) => {
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
	}).then(() => verifyFields());
};
const onColorChange = (
	event: { target: { name: string | number } },
	data: any
) => {
	const provider = ref[event.target.name];
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	}).then(() => verifyFields());
};
const onGraphicalElementChecked = (data: any) => {
	updatePartnerPropertyFromForm({
		data: data,
	}).then(() => verifyFields());
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
