<template>
	<b-container fluid v-if="currentPartnerFolder">
		<!-- details -->
		<b-row class="mb-3">
			<b-col>
				<span class="form-description">Coordonnées</span>
				<span class="error">(Cocher les informations à afficher)</span>
			</b-col>
		</b-row>
		<b-row>
			<b-col md="6" sm="12">
				<b-row>
					<b-col sm="4">

							<label>
								<b-form-checkbox
									@change="
                    onBlur($event, {
                      site: currentPartnerFolder.sites[0],
                      type: 'bool',
                    })
                  "
									type="checkbox"
									name="currentPartnerFolder.sites[0].displayCompanyName"
									v-model="currentPartnerFolder.sites[0].displayCompanyName"
									:disabled="!allowedToEdit"
								>
									Enseigne
								</b-form-checkbox>
							</label>

					</b-col>
					<b-col sm="8">

							<div class="input-text">
								<b-form-input
									@focus="onFocus"
									@blur="onBlur($event, { account: salesforce.account })"
									type="text"
									:class="classes"
									name="salesforce.account.Name"
									v-model="salesforce.account.Name"
									:disabled="
                    !allowedToEdit ||
                    !currentPartnerFolder.sites[0].displayCompanyName
                  "
									:readonly="!allowedToEdit"
								></b-form-input>
								<TextLengthMessage
									:value="!salesforce || salesforce.account.Name"
									maxlength="255"
								/>
							</div>

					</b-col>
				</b-row>
			</b-col>
		</b-row>
		<b-row>
			<b-col md="6" sm="12">
				<b-row>
					<b-col sm="4">

							<label>
								<b-form-checkbox
									@change="
                    onBlur($event, {
                      site: currentPartnerFolder.sites[0],
                      type: 'bool',
                    })
                  "
									type="checkbox"
									name="currentPartnerFolder.sites[0].displayFirstname"
									v-model="currentPartnerFolder.sites[0].displayFirstname"
									:disabled="!allowedToEdit"
								>
									Prénom
								</b-form-checkbox>
							</label>

					</b-col>
					<b-col sm="8">

							<div class="input-text">
								<b-form-input
									@focus="onFocus"
									@blur="onBlur($event, { contact: salesforce.contact })"
									type="text"
									name="salesforce.contact.FirstName"
									:class="classes"
									v-model="salesforce.contact.FirstName"
									:disabled="
                    !allowedToEdit ||
                    !currentPartnerFolder.sites[0].displayFirstname
                  "
									:readonly="!allowedToEdit"
								></b-form-input>
								<TextLengthMessage
									:value="!salesforce || salesforce.account.FirstName"
									maxlength="255"
								/>
							</div>

					</b-col>
				</b-row>
				<b-row>
					<b-col sm="4">

							<label>
								<b-form-checkbox
									@change="
                    onBlur($event, {
                      site: currentPartnerFolder.sites[0],
                      type: 'bool',
                    })
                  "
									type="checkbox"
									name="currentPartnerFolder.sites[0].displayLastname"
									v-model="currentPartnerFolder.sites[0].displayLastname"
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
								>
									Nom
								</b-form-checkbox>
							</label>

					</b-col>
					<b-col sm="8">

							<div class="input-text">
								<b-form-input
									@focus="onFocus"
									@blur="onBlur($event, { contact: salesforce.contact })"
									type="text"
									name="salesforce.contact.LastName"
									:class="classes"
									v-model="salesforce.contact.LastName"
									:disabled="
                    !allowedToEdit ||
                    !currentPartnerFolder.sites[0].displayLastname
                  "
									:readonly="!allowedToEdit"
								></b-form-input>
								<TextLengthMessage
									:value="!salesforce || salesforce.contact.LastName"
									maxlength="255"
								/>
							</div>

					</b-col>
				</b-row>
			</b-col>
			<b-col md="6" sm="12">
				<b-row>
					<b-col sm="4">

							<label>
								<b-form-checkbox
									@change="
                    onBlur($event, {
                      site: currentPartnerFolder.sites[0],
                      type: 'bool',
                    })
                  "
									type="checkbox"
									name="currentPartnerFolder.sites[0].displayPhone"
									v-model="currentPartnerFolder.sites[0].displayPhone"
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
								>
									Téléphone fixe
								</b-form-checkbox>
							</label>

					</b-col>
					<b-col sm="8">

							<b-form-input
								@focus="onFocus"
								@blur="onBlur($event, { contact: salesforce.contact })"
								type="text"
								name="salesforce.contact.Phone"
								:class="classes"
								v-model="salesforce.contact.Phone"
								:disabled="
                  !allowedToEdit || !currentPartnerFolder.sites[0].displayPhone
                "
								:readonly="!allowedToEdit"
							></b-form-input>

					</b-col>
				</b-row>
				<b-row>
					<b-col sm="4">

							<label>
								<b-form-checkbox
									@change="
                    onBlur($event, {
                      site: currentPartnerFolder.sites[0],
                      type: 'bool',
                    })
                  "
									type="checkbox"
									name="currentPartnerFolder.sites[0].displayCellphone"
									v-model="currentPartnerFolder.sites[0].displayCellphone"
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
								>
									Téléphone portable
								</b-form-checkbox>
							</label>

					</b-col>
					<b-col sm="8">

							<b-form-input
								@focus="onFocus"
								@blur="onBlur($event, { contact: salesforce.contact })"
								type="text"
								name="salesforce.contact.MobilePhone"
								:class="classes"
								v-model="salesforce.contact.MobilePhone"
								:disabled="
                  !allowedToEdit ||
                  !currentPartnerFolder.sites[0].displayCellphone
                "
								:readonly="!allowedToEdit"
							></b-form-input>

					</b-col>
				</b-row>
			</b-col>
		</b-row>
		<b-row>
			<b-col md="6" sm="12">
				<b-row>
					<b-col sm="4">

							<label>
								<b-form-checkbox
									@change="
                    onBlur($event, {
                      site: currentPartnerFolder.sites[0],
                      type: 'bool',
                    })
                  "
									type="checkbox"
									name="currentPartnerFolder.sites[0].displayAddress"
									v-model="currentPartnerFolder.sites[0].displayAddress"
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
								>
									Adresse
								</b-form-checkbox>
							</label>

					</b-col>
					<b-col sm="8">

							<div class="input-text">
								<b-form-input
									@focus="onFocus"
									@blur="onBlur($event, { account: salesforce.account })"
									type="text"
									name="salesforce.account.BillingStreet"
									:class="classes"
									v-model="salesforce.account.BillingStreet"
									:disabled="
                    !allowedToEdit ||
                    !currentPartnerFolder.sites[0].displayAddress
                  "
									:readonly="!allowedToEdit"
								></b-form-input>
								<TextLengthMessage
									:value="!salesforce || salesforce.account.BillingStreet"
									maxlength="255"
								/>
							</div>

					</b-col>
				</b-row>
			</b-col>
			<b-col xl="6">
				<b-row>
					<b-col md="2" xl="4">

							<label>
								<b-form-checkbox
									@change="
                    onBlur($event, {
                      site: currentPartnerFolder.sites[0],
                      type: 'bool',
                    })
                  "
									type="checkbox"
									name="currentPartnerFolder.sites[0].displayAddressComplement"
									v-model="
                    currentPartnerFolder.sites[0].displayAddressComplement
                  "
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
								>
									Code postal / ville
								</b-form-checkbox>
							</label>

					</b-col>
					<b-col md="4" xl="8">
						<b-row>
							<b-col sm="4" md="4">

									<b-form-input
										@focus="onFocus"
										@blur="onBlur($event, { account: salesforce.account })"
										type="text"
										name="salesforce.account.BillingPostalCode"
										:class="classes"
										v-model="salesforce.account.BillingPostalCode"
										:disabled="
                      !allowedToEdit ||
                      !currentPartnerFolder.sites[0].displayAddressComplement
                    "
										:readonly="!allowedToEdit"
									></b-form-input>

							</b-col>
							<b-col sm="8" md="8">

									<div class="input-text">
										<b-form-input
											@focus="onFocus"
											@blur="onBlur($event, { account: salesforce.account })"
											type="text"
											name="salesforce.account.BillingCity"
											:class="classes"
											v-model="salesforce.account.BillingCity"
											:disabled="
                        !allowedToEdit ||
                        !currentPartnerFolder.sites[0].displayAddressComplement
                      "
											:readonly="!allowedToEdit"
										></b-form-input>
										<TextLengthMessage
											:value="!salesforce || salesforce.account.BillingCity"
											maxlength="40"
										/>
									</div>

							</b-col>
						</b-row>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
		<b-row class="my-3" align-v="center">
			<b-col>
				<span class="form-description">Réseaux sociaux</span>
				<span class="error">(Cocher les informations à afficher)</span>
			</b-col>
		</b-row>
		<!-- socialNetworks -->
		<b-row v-for="(item, index) in availableSocialNetworks" :key="item.name">
			<b-col sm="12" md="2">

					<b-form-checkbox
						@change="
              onSocialNetworkCheck($event, {
                socialNetwork: item,
                type: 'bool',
              })
            "
						type="checkbox"
						:name="`currentPartnerFolder.socialNetworks.${index}.display`"
						v-model="item.display"
						:option="item.name"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						{{ item.name }}
					</b-form-checkbox>

			</b-col>
			<b-col sm="12" md="4">

					<b-form-input
						@focus="onFocus"
						@blur="onSocialNetworkChange($event, { socialNetwork: item })"
						type="text"
						:class="classes"
						:name="`currentPartnerFolder.socialNetworks.${index}.url`"
						v-model="item.url"
						:disabled="!allowedToEdit || !item.display"
						:readonly="!allowedToEdit"
						:placeholder="item.display ? 'URL requise' : ''"
					></b-form-input>

			</b-col>
		</b-row>
		<b-row>
			<b-col sm="12" md="2">
				<b-form-checkbox
					type="checkbox"
					name="socialNetworks[other].display`"
					v-model="otherSocialNetworkDisplay"
					:disabled="!allowedToEdit"
					:readonly="!allowedToEdit"
				>
					Ajouter un autre site
				</b-form-checkbox>
			</b-col>
			<b-col sm="12" md="4">

					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="
                onSocialNetworkChange($event, {
                  socialNetwork: {
                    name: otherSocialNetworkName,
                    display: true,
                  },
                })
              "
							type="text"
							v-model="otherSocialNetworkName"
							name="socialNetworks[other].name"
							:placeholder="otherSocialNetworkDisplay ? 'Nom du site' : ''"
							:disabled="!allowedToEdit || !otherSocialNetworkDisplay"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage :value="otherSocialNetworkName" maxlength="40"/>
					</div>

			</b-col>
		</b-row>
		<b-row class="my-3">
			<b-col>
				<span class="form-description">Horaires d'ouverture</span>
			</b-col>
		</b-row>
		<!-- schedule -->
		<b-row :class="{ 'mb-3': !customChoiceError }">
			<b-col>

					<b-form-checkbox
						@change="
              onClientsNotWelcomeChecked($event, {
                site: currentPartnerFolder.sites[0],
                type: 'bool',
              })
            "
						type="checkbox"
						name="currentPartnerFolder.sites.0.clientsPhysicallyWelcome"
						v-model="clientsNotWelcome"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
						label="Le professionnel n'accueille pas de clients à l'adresse de son établissement"
					>
						Le professionnel n'accueille pas de client à l'adresse de son
						établissement
					</b-form-checkbox>

			</b-col>
		</b-row>
		<b-row v-if="customChoiceError" class="mb-2">
			<b-col>
				<small class="custom-error">
					Veuillez définir au moins une plage d'horaires ou sinon, cochez la
					case "Le professionnel n'accueille pas de client à l'adresse de son
					établissement".
				</small>
			</b-col>
		</b-row>

<!--		<TimeRanges-->
<!--			parentEntityName="partnerFolder"-->
<!--			:parentEntity="currentPartnerFolder"-->
<!--			:timeRanges="currentPartnerFolder && currentPartnerFolder.openingRanges"-->
<!--			:allowedToEdit="allowedToEdit"-->
<!--			:verifyFields="verifyFields"-->
<!--		/>-->
		<b-row>
			<b-col class="my-3">
				<label class="label">Remarque à propos des horaires</label>

					<div class="input-text">
						<b-form-input
							@focus="onFocus"
							@blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
							type="text"
							:class="classes"
							name="currentPartnerFolder.aboutOpeningRange"
							v-model="currentPartnerFolder.aboutOpeningRange"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
						></b-form-input>
						<TextLengthMessage
							:value="
                !currentPartnerFolder || currentPartnerFolder.aboutOpeningRange
              "
							maxlength="255"
						/>
					</div>

			</b-col>
		</b-row>
		<ExceptionnalDates
			parentEntityName="partner"
			parentEntityPath="currentPartnerFolder"
			:allowedToEdit="allowedToEdit"
			:enableIsOpeningRange="true"
			:enableReason="false"
			:displayEntitle="true"
		/>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
//import { extend } from "vee-validate";
import {socialNetworkOptions as socialNetworkOptionsData} from "@/Interface/partnershipFolderDatas";
import TimeRanges from "@/components/PartnershipFolder/TimeRanges.vue";
import ExceptionnalDates from "./ExceptionnalDates.vue";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import {readyState, validateSection} from "@/helpers";
import {useDP} from "@/mixins/useDP";
import {BRow, BContainer, BCol, BFormCheckbox, BFormInput} from "bootstrap-vue-3";

let store = useStore();
let {allowedToEdit, verifyFields} = useDP();
//
// extend("expectedCheckedField", validateSection.expectedCheckedField);
// extend("requiredCheckedField", validateSection.requiredCheckedField);
// extend("expected", validateSection.expected);

let identity = computed(() => store.state.account.identity);
console.log('[COMPONENTSDISPLAY_INFORMATIONS]', store.state.account.currentPartner);
let currentPartnerFolder = computed(() => store.state.account.currentPartner);

let salesforce = computed(() => store.state.globalStore.salesforce);

let socialNetworkOptions = ref(socialNetworkOptionsData);
let availableSocialNetworks = ref([]);
let checkedSocialNetworks = ref([]);
let otherSocialNetworkDisplay = ref(false);
let otherSocialNetworkName = ref("");
let previousEditedValue = ref(null);
let customChoiceError = ref(false);

let clientsNotWelcome = computed({
	get() {
		return (
			true !== currentPartnerFolder.value.sites[0].clientsPhysicallyWelcome
		);
	},
	set(val) {
		currentPartnerFolder.value.sites[0].clientsPhysicallyWelcome =
			false === val;
	},
});

let updatePartnerPropertyFromForm = (value: any) => store.dispatch("account/updatePartnerPropertyFromForm", value);
let deletePartnerPropertyFromForm = () => store.dispatch("account/deletePartnerPropertyFromForm");

let onFocus = (event: { target: { value: null } }) => {previousEditedValue.value = event.target.value;};
let onBlur = (event: { target: { name: string | number } }, data: any) => {
	let provider = ref[event.target.name];
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	});
	verifyFields();
};
let onClientsNotWelcomeChecked = (
	event: any,
	data: { offset: string; value: any }
) => {
	data.offset = "clientsPhysicallyWelcome";
	data.value = currentPartnerFolder.value.sites[0].clientsPhysicallyWelcome;
	updatePartnerPropertyFromForm({
		data: data,
	});
	verifyFields();
};
let onSocialNetworkCheck = (event: any, data: any) => {
	onSocialNetworkChange(event, data);
};
let onSocialNetworkChange = (
	event: any,
	data: { socialNetwork: { display: any; url: string } }
) => {
	if (
		!data.socialNetwork.display ||
		(data.socialNetwork.display && "" !== data.socialNetwork.url)
	) {
		persistSocialNetwork(event, data);
	}
};
let persistSocialNetwork = (
	event: { target: { name: string | number } },
	data: {
		socialNetwork: { id: any; partnerFolder: any; display: any; url: any };
		payload: { display: any; url: any };
	}
) => {
	if (data.socialNetwork && !data.socialNetwork.id) {
		data.socialNetwork.partnerFolder = currentPartnerFolder.value["@id"];
	}
	data.payload = {
		display: data.socialNetwork.display,
		url: data.socialNetwork.url,
	};
	let provider = ref[event.target.name] || false;
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	}).then(() => {
		initializeSocialNetworks();
		verifyFields();
	});
};
let initializeSocialNetworks = () => {
	let availableSocialNetworks: any[] = [];

	if(currentPartnerFolder && currentPartnerFolder.value){
		socialNetworkOptions.value.forEach((item) => {
			let found = currentPartnerFolder.value.socialNetworks.find(
				(partnerSocialNetwork: { name: string }) =>
					partnerSocialNetwork.name &&
					partnerSocialNetwork.name.toLowerCase() === item.value.toLowerCase()
			);
			if (found) {
				availableSocialNetworks.push(found);
			} else {
				availableSocialNetworks.push({
					name: item.value,
				});
			}
		});

		currentPartnerFolder.value.socialNetworks.forEach(
			(item: { name: string | undefined }) => {
				let found =
					undefined !== item.name
						? availableSocialNetworks.find(
							(availableSocialNetwork) =>
								availableSocialNetwork.name.toLowerCase() ===
								item.name.toLowerCase()
						)
						: null;
				if (undefined !== item.name && !found) {
					availableSocialNetworks.push(item);
				}
			}
		);

		availableSocialNetworks = availableSocialNetworks;
	}

};
let validateFields = async (
	refs: any,
	entity: {
		currentPartnerFolder: {
			openingRanges: any[];
			sites: { clientsPhysicallyWelcome: any }[];
			socialNetworks: any[];
		};
	}
) => {
	if (!allowedToEdit) {
		validateSection.displayColorStateOnSection("display-informations", "reset");
		return;
	}

	let timeRanges = entity.currentPartnerFolder.value.openingRanges.filter(
		(openingRange: { dayOfWeek: any }) => openingRange.dayOfWeek
	);
	let clientsPhysicallyWelcome =
		!entity.currentPartnerFolder.value.sites[0].clientsPhysicallyWelcome;
	let isValid = await validateSection.validateRequiredFields(entity, refs, [
		"socialNetworks",
		"contact.MobilePhone",
		"contact.Phone",
	]);

	if (isValid) {
		if (!clientsPhysicallyWelcome && !timeRanges.length) {
			let addTimeRangeButton = document.querySelector("#add-time-range");
			if (addTimeRangeButton && !customChoiceError.value) {
				addTimeRangeButton.click();
			}
			customChoiceError.value = true;
			isValid = false;
		}

		if (
			(!clientsPhysicallyWelcome && timeRanges.length) ||
			(clientsPhysicallyWelcome && !timeRanges.length)
		) {
			isValid = true;
			customChoiceError.value = false;
		}
	}

	if (isValid) {
		let isSocialNetworkValid =
			!entity.currentPartnerFolder.value.socialNetworks.length ||
			entity.currentPartnerFolder.value.socialNetworks.every(
				(socialNetwork: { display: any; url: any }) => {
					return (
						!socialNetwork.display ||
						(socialNetwork.display && !!socialNetwork.url)
					);
				}
			);

		if (!isSocialNetworkValid) {
			isValid = null;
		}
	}

	validateSection.displayColorStateOnSection("display-informations", isValid);
};

onMounted(async () => {
	if(currentPartnerFolder && currentPartnerFolder.value){
		initializeSocialNetworks();
		currentPartnerFolder.value.openingRanges =
			currentPartnerFolder.value.openingRanges.filter(
				(item: { dayOfWeek: any }) => item.dayOfWeek
			);
	}
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
