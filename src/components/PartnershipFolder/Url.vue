<template>
	<b-container fluid v-if="currentSite">
		<!-- form -->
		<b-row class="mb-4">
			<b-col lg="4" md="6">
				<label class="label">URL souhaitée</label>
				<div class="input-text">
					<b-input-group>
						<b-input-group-append>
							<b-input-group-text class="pr-0 domain-prefix">
								https://www.
							</b-input-group-text>
						</b-input-group-append>
						<div class="input-text-field">
							<b-form-input
								v-model="currentSite.domain"
								:class="false === isDomainAvailable ? 'is-invalid' : classes"
								class="pl-1"
								:disabled="!allowedToEdit"
								:readonly="!allowedToEdit"
								name="currentPartnerFolder.sites.0.domain"
								type="text"
								@blur="onBlur($event, { site: currentSite }, 'domain')"
								@focus="onFocus"
							></b-form-input>
							<TextLengthMessage
								:value="!currentSite || currentSite.domain"
								maxlength="255"
							/>
						</div>
					</b-input-group>
				</div>
				<vue-progress-bar
					id="domain-progress"
					v-if="isDomainProgressBarActive"
				/>
				<small v-if="false === isDomainAvailable" class="is-invalid">
					Le nom de domaine n'est pas disponible
				</small>
				<small v-if="isDomainAvailable && showIsAvailable" :class="classes">
					Le nom de domaine est disponible
				</small>
			</b-col>
			<b-col lg="4" md="6">
				<label class="label">URL existante</label>
				<div class="input-text">
					<b-form-input
						type="text"
						@focus="onFocus"
						@blur="onBlur($event, { site: currentSite })"
						name="currentPartnerFolder.sites.0.oldDomain"
						:class="classes"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						v-model="currentSite.oldDomain"
					></b-form-input>
					<TextLengthMessage
						:value="!currentSite || currentSite.oldDomain"
						maxlength="255"
					/>
				</div>
			</b-col>
			<b-col lg="4" md="6">
				<b-form-checkbox
					type="checkbox"
					@focus="onFocus"
					@change="
              onNeedTransferChange($event, { site: currentSite, type: 'bool' })
            "
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
					name="currentPartnerFolder.sites.0.needTransfer"
					v-model="currentSite.needTransfer"
				>
					URL à transférer
				</b-form-checkbox>
			</b-col>
		</b-row>
		<div v-if="currentSite.needTransfer">
			<b-row class="mb-4">
				<b-col md="1">
					<label>Registrar</label>
				</b-col>
				<b-col md="2">
					<b-form-radio-group
						type="radio"
						v-model="currentSite.registrar"
						name="currentPartnerFolder.sites.0.registrar"
						@focus="onFocus"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						@change="onBlur($event, { site: currentSite, type: 'bool' })"
					>
						<b-form-radio :value="true">OVH</b-form-radio>
						<b-form-radio :value="false">Autre</b-form-radio>
					</b-form-radio-group>
				</b-col>
				<b-col v-if="false === currentSite.registrar" md="3">
					<b-form-input
						v-model="currentSite.otherRegistrar"
						name="currentPartnerFolder.sites.0.otherRegistrar"
						type="text"
						@blur="onBlur($event, { site: currentSite })"
						@focus="onFocus"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					/>
				</b-col>
				<b-col md="6">
					Pour connaître votre registrar
					<a class="ml-2 redirect-link" :href="registrarUrl" target="_blank">
						<img alt="" src="@/assets/link-button.svg"/>
						<span class="text">CLIQUEZ ICI</span>
					</a>
				</b-col>
			</b-row>
			<b-row class="mb-4">
				<b-col>
					<label>Adresses mails associées</label>
					<b-row>
						<b-col md="1">
							<b-form-radio-group
								v-model="currentSite.registrarEmail"
								name="currentPartnerFolder.sites.0.registrarEmail"
								type="radio"
								@change="onBlur($event, { site: currentSite, type: 'bool' })"
								@focus="onFocus"
								:disabled="!allowedToEdit"
								:readonly="!allowedToEdit"
								stacked
							>
								<b-form-radio :value="true">Oui</b-form-radio>
								<b-form-radio :value="false">Non</b-form-radio>
							</b-form-radio-group>
						</b-col>
						<b-col v-if="currentSite.registrarEmail" md="4">
							<b-form-tags
								@input="
                    onTagsChange(
                      $event,
                      { site: currentSite },
                      'associatedEmails'
                    )
                  "
								:tag-validator="validator"
								:disabled="!allowedToEdit"
								:readonly="!allowedToEdit"
								tag-variant="local-orange"
								size="md"
								placeholder="Ajouter un mail. Valider à chaque fois avec la touche Entrer."
								:class="classes"
								remove-on-delete
								name="currentPartnerFolder.sites.0.associatedEmails"
								v-model="currentSite.associatedEmails"
								invalid-tag-text="L'email saisie n'est pas valide"
							></b-form-tags>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<b-row class="mb-4">
				<b-col>
					<p>Avez-vous un paramétrage spécifique pour vos emails ?</p>
					<p>
						(Exemple : cas d’adresses mails gérées chez Google ou Office 365,
						offre exchange, ou tout autre spécificité sur vos offres mails...)
					</p>
					<b-row class="mb-4">
						<b-col md="3">
							<b-form-radio-group
								v-model="currentSite.specificParameters"
								name="currentPartnerFolder.sites.0.specificParameters"
								type="radio"
								@change="onBlur($event, { site: currentSite, type: 'bool' })"
								@focus="onFocus"
								:disabled="!allowedToEdit"
								:readonly="!allowedToEdit"
								stacked
							>
								<b-form-radio :value="true">Oui</b-form-radio>
								<b-form-radio :value="false">Non</b-form-radio>
							</b-form-radio-group>
						</b-col>
					</b-row>
					<b-row v-if="currentSite.specificParameters">
						<b-col>
							<label>Sélectionnez votre service de messagerie</label>
							<b-row>
								<b-col md="2">
									<b-form-radio-group
										v-model="checkedParameter"
										name="currentPartnerFolder.sites.0.specificParameterDetails"
										:options="specificParameterChoices"
										type="radio"
										:disabled="!allowedToEdit"
										:readonly="!allowedToEdit"
										@change="onBlur($event, { site: currentSite })"
										@focus="onFocus"
										stacked
									>
									</b-form-radio-group>
								</b-col>
								<b-col
									v-if="'Autre' === checkedParameter"
									class="align-end"
									md="3"
								>
									<b-form-input
										v-model="otherSpecifics"
										name="currentPartnerFolder.sites.0.specificParameterDetails"
										type="text"
										:disabled="!allowedToEdit"
										:readonly="!allowedToEdit"
										@blur="
                        onBlur(
                          $event,
                          { site: currentSite },
                          'specificParameterOther'
                        )
                      "
										@focus="onFocus"
									/>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</div>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, getCurrentInstance, ref} from "vue";
import {useDP} from "@/mixins/useDP";
import {useStore} from "vuex";

import {validateSection, normalizer} from "@/helpers";
import {ovhService} from "@/services";
import {
	specificParameterChoices,
	registrarLevelsMapping,
} from "@/Interface/partnershipFolderDatas";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";

const internalInstance = getCurrentInstance();
const progress = internalInstance.appContext.config.globalProperties.$Progress;

const {allowedToEdit, verifyFields} = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);

const otherSpecificParams = ref(null);
const checkedParameter = ref(null);
const registrarUrl = ref(import.meta.env.VUE_REGISTRAR_URL);
const isDomainAvailable = ref(null);
const showIsAvailable = ref(false);
const mappingFields = ref({
	oldDomain: "URL_transferer__c",
	needTransfer: "NDD_transf_rer__c",
	registrar: "Registrar__c",
	otherRegistrar: "Registrar__c",
	registrarEmail: "Adresses_Mail_liees_coche__c",
	associatedEmails: "Adresses_Mail_liees__c",
	specificParameters: "Offres_sp_cifiques_exchange__c",
	specificParameterDetails: "Offres_sp_cifiques_autre__c",
	specificParameterOther: "Offres_sp_cifiques_autre__c",
});
const isDomainProgressBarActive = ref(false);
const previousEditedValue = ref(null);

const salesforce = computed(() => store.state.globalStore.salesforce);

const otherSpecifics = computed({
	get() {
		return otherSpecificParams;
	},
	set(value) {
		otherSpecificParams.value = value;
	},
});
const currentSite = computed(() => {
	if (currentPartnerFolder.value && currentPartnerFolder.value.sites.length) {
		if (isOtherParametersChecked()) {
			checkedParameter.value = "Autre";
			otherSpecificParams.value =
				currentPartnerFolder.value.sites[0].specificParameterDetails;
		} else {
			checkedParameter.value =
				currentPartnerFolder.value.sites[0].specificParameterDetails;
		}
	}
	return currentPartnerFolder.value && currentPartnerFolder.value.sites.length
		? currentPartnerFolder.value.sites[0]
		: null;
});

const updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: any } }) => {
	previousEditedValue.value = event.target.value;
};
const onBlur = (event: any, data: any, offset = null) => {
	if (offset && "domain" === offset) {
		if (
			!currentSite.value ||
			!currentSite.value.domain ||
			previousEditedValue.value === currentSite.value.domain
		) {
			return;
		}

		isDomainAvailable.value = null;
		isDomainProgressBarActive.value = true;
		progress.start();
		checkDomainAvailability()
			.then((isAvailable) => {
				if (isAvailable) {
					showIsAvailable.value = true;
					setTimeout(() => {
						showIsAvailable.value = false;
					}, 60000);
					updateAndVerifyFields(event, data);
				}
			})
			.catch((error) => {
				progress.fail();
				console.error(error);
				store.dispatch(
					"alert/error",
					{
						group: "auth-error",
						message:
							"Une erreur s'est produite lors de la vérification du nom de domain",
						show: true,
						title: "Erreur d'API",
						type: "error",
					},
					{root: true}
				);
			})
			.finally(() => {
				progress.finish();
				isDomainProgressBarActive.value = false;
			});
	} else {
		updateAndVerifyFields(event, data, offset);
	}
};
const updateAndVerifyFields = (
	event: { target: { name: string | number } },
	data: any,
	offset: null | undefined
) => {
	const provider = ref[event.target.name];
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	});
	updateRegistrarTask(event, data, offset);
	verifyFields();
};
const onTagsChange = (
	value: any,
	data: { value: any; offset: any },
	offset: any
) => {
	data.value = value;
	data.offset = offset;
	updatePartnerPropertyFromForm({data});
	updateRegistrarTask(event, data, offset);
};
const onNeedTransferChange = (
	event: { target: { checked: any } },
	data: any
) => {
	onBlur(event, data);
	updatePartnerPropertyFromForm({
		data: {
			opportunity: salesforce.value.opportunity,
			offset: "Domaine_transf_rer__c",
			value: event.target.checked,
		},
		showNotification: false,
	});
};
const validateFields = async (
	refs: { [x: string]: { validate: () => any } },
	entity: { currentPartnerFolder: { sites: { oldDomain: any; domain: any }[] } }
) => {
	if (!allowedToEdit) {
		validateSection.displayColorStateOnSection("url", "reset");
		return;
	}
	let isValid = true;

	const {oldDomain, domain} = entity.currentPartnerFolder.sites[0];
	if (!oldDomain && !domain) {
		await refs["currentPartnerFolder.sites.0.domain"].validate();
		await refs["currentPartnerFolder.sites.0.oldDomain"].validate();
		isValid = false;
	}

	validateSection.displayColorStateOnSection("url", isValid);
};
const validator = (tag: string) => {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		tag
	);
};
const isOtherParametersChecked = () => {
	if (
		!(currentPartnerFolder.value && currentPartnerFolder.value.sites.length)
	) {
		return;
	}

	const specificParams =
		currentPartnerFolder.value.sites[0].specificParameterDetails;
	return (
		specificParams &&
		!specificParameterChoices.some(
			(specificParameterChoice) =>
				specificParameterChoice.value === specificParams
		)
	);
};
const checkDomainAvailability = () => {
	return ovhService
		.checkDomainAvailability(currentSite.value.domain)
		.then((response) => {
			isDomainAvailable.value = response && response.available;
			return isDomainAvailable;
		});
};
const updateRegistrarTask = (
	event: Event | undefined,
	data: { type: string },
	offset: string
) => {
	if (
		!salesforce.value ||
		!salesforce.value.taskTracking ||
		!salesforce.value.taskTracking.Id
	) {
		return;
	}

	offset = offset || event.target.name.split(".").slice(-1)[0];
	const fieldname = mappingFields[offset];
	if (!fieldname) {
		return;
	}

	const dataToUpdate = {
		taskTracking: salesforce.value.taskTracking,
		offset: fieldname,
	};
	let value = event.target.value;

	switch (offset) {
		case "registrar":
			const isOvh = normalizer.booleanNormalizer(value);
			value = isOvh
				? "OVH"
				: currentPartnerFolder.value.sites[0].otherRegistrar;
			delete data.type;
			break;
		case "registrarEmail":
			const hasRegistrarEmail = normalizer.booleanNormalizer(value);
			if (hasRegistrarEmail) {
				updatePartnerPropertyFromForm({
					data: {
						taskTracking: salesforce.value.taskTracking,
						offset: mappingFields.value.associatedEmails,
						value:
							currentPartnerFolder.value.sites[0].associatedEmails.join(", "),
						showNotification: false,
					},
					showNotification: false,
				});
			}
			break;
		case "associatedEmails":
			value = currentPartnerFolder.value.sites[0].associatedEmails.join(", ");
			break;
		case "needTransfer":
			if (event.target.checked) {
				updatePartnerPropertyFromForm({
					data: {
						taskTracking: salesforce.value.taskTracking,
						offset: mappingFields.value.oldDomain,
						value: currentPartnerFolder.value.sites[0].oldDomain,
					},
					showNotification: false,
				});
			}
			break;
		case "specificParameters":
			const hasSpecificParameters = normalizer.booleanNormalizer(value);
			updatePartnerPropertyFromForm({
				data: {
					taskTracking: salesforce.value.taskTracking,
					offset: mappingFields.value.specificParameterDetails,
					value: hasSpecificParameters
						? currentPartnerFolder.value.sites[0].specificParameterDetails
						: null,
				},
				showNotification: false,
			});
			break;
		case "specificParameterDetails":
			const isOtherSpecificParameters = "Autre" === value;
			updatePartnerPropertyFromForm({
				data: {
					taskTracking: salesforce.value.taskTracking,
					offset: mappingFields.value.specificParameterOther,
					value: isOtherSpecificParameters ? null : value,
				},
				showNotification: false,
			});
			return;
	}

	if (data.type) {
		dataToUpdate.type = data.type;
		if ("bool" === data.type) {
			if ("checkbox" === event.target.type) {
				value = event.target.checked;
			}
			value = normalizer.booleanNormalizer(value);
		}
	}

	if (["registrar", "registrarEmail", "specificParameters"].includes(offset)) {
		let {registrar} = currentPartnerFolder.value.sites[0];
		const {registrarEmail, specificParameters} =
			currentPartnerFolder.value.sites[0];
		registrar = registrar ? "OVH" : "other";
		const level =
			registrarLevelsMapping.findIndex((expectedValues) => {
				return (
					(undefined === expectedValues.registrar ||
						("OVH" === expectedValues.registrar) === ("OVH" === registrar)) &&
					(undefined === expectedValues.registrarEmail ||
						expectedValues.registrarEmail === registrarEmail) &&
					expectedValues.specificParameters === specificParameters
				);
			}) + 1;
		if (level > 0) {
			dataToUpdate.payload = {
				Niveau_de_Transfert__c: `Niveau ${level}`,
			};
			dataToUpdate.payload[fieldname] = value;
		}
	}
	dataToUpdate.value = value;

	updatePartnerPropertyFromForm({
		data: dataToUpdate,
		showNotification: false,
	});
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
