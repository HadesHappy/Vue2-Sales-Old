<template>
	<div class="creer" @click="close_menu">
		<app-headerbuttons/>
		<b-container fluid class="bv-example-row">
			<b-col lg="12" md="12" sm="12" class="header-ticket">
				<b-row>
					<app-menuprofile
							class="menu-asks hidden-for-mobile"
					></app-menuprofile>
					<app-menumobile class="menu-mobile"></app-menumobile>
					<b-col lg="9" md="12" sm="12" class="create-ticket">
						<b-row
								class="ticket-form"
								:class="isSendingTicket ? 'disabled' : ''"
						>
							<b-col>
								<b-modal
										name="modal-input-creer"
										:adaptive="true"
										:max-width="300"
										:max-height="100"
								>
									<div class="modal-input">
										Merci de renseigner tous les champs.
									</div>
								</b-modal>
								<h2>Créer une nouvelle demande</h2>
								<br/>
								<b-form-input
										v-model="object"
										type="text"
										placeholder="Objet de la demande"
								>
								</b-form-input>
								<br/>
								<p>Votre demande concerne :</p>
								<b-form-select
										v-model="selectedType"
										:options="availableTypes"
										class="mb-3"

								>
								</b-form-select>
								<br/>
								<p>Détail de votre demande :</p>
								<fade-loader
										:color="color"
										class="ticket-spinner"
										v-if="isSendingTicket"
								></fade-loader>

									<b-form-textarea
											v-model="description"
											id="textarea1"
											placeholder="Description"
											rows="3"
											wrap="soft"
									>
									</b-form-textarea>
							</b-col>
						</b-row>
						<b-row>
							<vue-progress-bar id="progress-tickets"></vue-progress-bar>
						</b-row>

						<b-row>
							<button
									@click="add_files()"
									class="submit-button"
									:disabled="isSendingTicket || !formValid"
									:class="{ disabled: isSendingTicket || !formValid }"
							>
								Ajouter des fichiers
							</button>
							<button
									@click="validate_form()"
									class="validate-button submit-button"


							>
								Valider
							</button>
						</b-row>
						<b-row>
							<b-col md="6" offset-md="3" class="my-3">
								<b-row
										v-for="(file, key) in files"
										:key="key + forceReload"
										class="my-1"
								>
									<b-col md="9">{{ file.name }}</b-col>
									<b-col md="1">
                    <span v-if="file.uploaded" class="uploaded-file"
										><i class="fas fa-check-circle"></i
										></span>
										<span v-if="file.isUploading" class="uploading-file"
										><i class="fas fa-fan"></i
										></span>
										<span
												v-if="
                        false === file.uploaded && false === file.isUploading
                      "
												class="error-file"
										><i class="fas fa-exclamation-circle"></i
										></span>
									</b-col>
									<b-col
											md="2"
											v-if="false === file.uploaded || !isSendingTicket"
									>
										<img
												src="@/assets/delete.png"
												@click="remove_file(key)"
												class="delete-file"
										/>
									</b-col>
								</b-row>
							</b-col>
							<b-col md="2" hidden>
								<input
										type="file"
										id="files"
										ref="files"
										:accept="allowedUploadExtensions"
										multiple
										@change="handle_files_upload()"
								/>
							</b-col>
						</b-row>
					</b-col>
				</b-row>
			</b-col>
		</b-container>
		<footer></footer>
	</div>
</template>

<script lang="ts" setup>
import router from "@/router";
import {
	ticketHelpers,
	progressBar,
	dropboxHelper,
	readyState,
} from "@/helpers";
import {getAllowedExtensions} from "@/helpers/file.helper";
import {useStore} from "vuex";
import MenuMobile from "@/components/MenuMobile.vue";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import {computed, onMounted, ref, getCurrentInstance} from "vue";
import Footer from "@/components/Footer.vue";
import {BCol, BFormInput, BFormSelect, BFormTextarea, BModal, BRow} from "bootstrap-vue-3";

const store = useStore();

const internalInstance = getCurrentInstance();
const progress = internalInstance.appContext.config.globalProperties.$Progress;

const identity = computed(() => store.state.account.identity);
const currentPartner = computed(() => store.state.account.currentPartner);
const status = computed(() => store.state.globalStore.status);
const salesforce = computed(() => store.state.globalStore.salesforce);
const offers = computed(() => store.state.globalStore.offers);

let counter = ref(0);
let formValid: boolean = ref(false);
let subject = ref("corrections_bat__minime___30min_");
let description = ref("");
let files = ref([]);
let filesNameTab = ref([]);
let object = ref("");
let ticketTypes = ref(ticketHelpers.getTicketTypes());
let availableTypes = ref([]);
let selectedType = ref(null);
let allowedUploadExtensions = ref(getAllowedExtensions().join(","));
let isSendingTicket = ref(false);
let color = ref("#ec008c");
let errorOccured = ref(false);
let forceReload = ref(0);

let getSalesforceTicket = (value: any) => store.dispatch("globalStore/getSalesforceTicket", value);
let createSalesforceTicket = (value: any) => store.dispatch("globalStore/createSalesforceTicket", value);
let updateSalesforceTicket = (value: any) => store.dispatch("globalStore/updateSalesforceTicket", value);
let uploadDropboxFile = (value: any) => store.dispatch("globalStore/uploadDropboxFile", value);
let s3Upload = () => store.dispatch("globalStore/s3Upload");

const check_inputs = () => {
	if (
			!object.value ||
			"" === object.value ||
			!description.value ||
			"" === description.value.trim() ||
			!selectedType.value ||
			"" === selectedType.value
	) {
		formValid = false;
		return false;
	}
	formValid = true;
	return true;
};

const close_menu = () => {
	if (document.getElementById("mySidenav")) {
		document.getElementById("mySidenav").style.width = "0";
	}
};

const add_files = () => {
	ref.files.click();
};

const validate_form = async () => {
	console.log('validation');
	isSendingTicket = true;
	const button : any = document.querySelector(".validate-button");
	if (true === button.disabled) {
		return;
	}
	toggleSubmitButton(true);
	formValid = check_inputs();
	if (!formValid) {
		toggleSubmitButton(false);
		isSendingTicket = false;
		return false;
	}

	//$modal.show("sending-ticket");
	const data = {
		accountId: salesforce.value.account.Id || currentPartner.value.company,
		cms: getCms(),
		contactId: salesforce.value.contact.Id,
		origin: "Formulaire",
		subject: `${currentPartner.value.customerCode} ${object.value}`,
		type: ticketHelpers.findTicketType(
				selectedType,
				status.value.isWebsiteOnline
		),
		category: ticketHelpers.findTicketCategory(
				selectedType,
				status.value.isWebsiteOnline
		),
		description: description,
		priority: "normal",
	};

	progress.start();
	progress.pause();

	const newFolderPath = dropboxHelper.retrieveMostRecentBasePath();
	const message = dropboxHelper.getMultipleFoldersMessage();

	const folderPathFound = newFolderPath || `${currentPartner.value.customerCode} ${salesforce.value.account.Name}`;

	const percentPerFile = progressBar.getPercentagePerFile(files.value.length);
	let round = 0;
	let ticketPath = `G:${folderPathFound}`;

	createSalesforceTicket({data})
			.then((ticketId) => getSalesforceTicket({ticketId}))
			.then(async (response) => {
				const ticketFolderName = `TICKET ${response.CaseNumber}`;
				if (files.value.length) {
					ticketPath = `${ticketPath}/${ticketFolderName}`;
				}

				const initializeFormData = new FormData();
				for (let i = 0; i < files.value.length; i++) {
					const file = files[i];
					initializeFormData.append("files[" + i + "]", file);
				}
				for (let i = 0; i < files.value.length; i++) {
					const file = files[i];
					file.isUploading = true;
					file.isUploadFailed = false;
					forceReload.value++;
					progress.set(round);

					try {
						const result = await uploadDropboxFile({
							folderName: folderPathFound,
							subFolder: ticketFolderName,
							file: file,
							message: message,
						});

						if (result.name) {
							const filepath = result.path_display.replace(
									import.meta.env.VITE_DROPBOX_FOLDER,
									""
							);
							filesNameTab.value.push(
									encodeURI(
											`${
													import.meta.env.VITE_LOCALETMOI_BASE_URL
											}/#/demandes/attachment${filepath}`
									)
							);

							file.uploaded = true;
							round += percentPerFile;

							progress.set(round);
							progress.pause();
						} else {
							errorOccured = true;
							file.uploaded = false;
							file.isUploadFailed = true;
						}
					} catch (e) {
						errorOccured = true;
						file.uploaded = false;
						file.isUploadFailed = true;
					}

					file.isUploading = false;
					forceReload.value++;
				}
				if (errorOccured.value) {
					progress.setColor("red");
				} else {
					progress.finish();
				}

				return response;
			})
			.then((response) => {
				const dataToUpdate = {
					description: `${description.value}\n\n${filesNameTab.value.join("\n")}`,
					R_pertoire_partenaire_r_seau__c: `${ticketPath}`.replaceAll("/", "\\"),
				};
				return updateSalesforceTicket({
					ticketId: response.Id,
					data: dataToUpdate,
				}).then((response) => {
					setTimeout(() => {
						progress.hide();
						progress.revertColor();
						toggleSubmitButton(false);
						isSendingTicket = false;
						router.push("/demandes");
					}, 3000);
				});
			});

	if (!status.value.isDropboxEmailSent) {
		dropboxHelper.sendEmailForMultipleFoldersFound("ticket");
	}
};
const handle_files_upload = () => {
	const uploadedFiles = ref.files.files;
	for (let i = 0; i < uploadedFiles.length; i++) {
		files.value.push(uploadedFiles[i]);
	}
};
const remove_file = (file: any) => {
	files.value.splice(file, 1);
};
const getCms = () => {
	let cms;
	if (offers.value && offers.value.length) {
		const avalaibleOffers = offers.value.filter(
				(offer: any) => !/^R?ABADW/.test(offer.productCode)
		);
		if (avalaibleOffers.length) {
			cms = avalaibleOffers[0].cms;
		}
	}

	return cms;
};
const toggleSubmitButton = (disable: boolean) => {
	const inputs = ["input", "select", "textarea", "button"]
			.map((item) => `.create-ticket ${item}`)
			.join(",");
	document
			.querySelectorAll(inputs)
			.forEach((button) => (button.disabled = disable));
};
const handleTicketDescriptionError = (errors) => {
	formValid = check_inputs() && errors && !errors.length;
	if (errors && errors.length) {
		toggleSubmitButton(false);
		isSendingTicket = false;
		errors[0] = "Veuillez compléter votre demande afin de pouvoir la soumettre (20 caractères minimum).";
		return errors[0];
	}
};

onMounted(async () => {
	// const timeout = window.setInterval(() => {
	// 	if (status.value.isPageLoading) {
	// 		return;
	// 	}
	// 	window.clearInterval(timeout);
	// 	availableTypes.value = ticketHelpers.getAvailableTicketTypes(status.value.isWebsiteOnline) as any[];
	// }, 100);
	availableTypes.value = ticketHelpers.getAvailableTicketTypes(status.value.isWebsiteOnline) as any[];

	if (false === status.value.hasMostRecentFolder) {
		const currentPartner = await readyState.getCurrentPartnerState();
		const salesforce = await readyState.getSalesforceState();
		if (false === status.value.hasMostRecentFolder) {
			dropboxHelper.getMostRecentFolder(
					currentPartner.customerCode,
					salesforce.account.Name
			);
		}
	}
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/ticket.scss";
</style>
