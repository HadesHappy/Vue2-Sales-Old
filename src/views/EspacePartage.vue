<template>
	<div class="espace-partage" @click="close_menu">
		<app-headerbuttons></app-headerbuttons>
		<b-container fluid class="bv-example-row">
			<b-row>
				<notifications
					group="success"
					position="bottom right"
					class="notification-container"
				/>
				<notifications
					group="error"
					position="bottom right"
					class="notification-container"
				/>
				<app-menuprofile
					v-if="isUser"
					class="hidden-for-mobile"
				></app-menuprofile>
				<app-menumobile class="menu-mobile"></app-menumobile>
				<b-col :lg="isUser ? 9 : 12" md="12" sm="12" class="dragdrop-container">
					<b-row>
						<b-col lg="8" md="6" sm="6" class="content-zone">
							<vue-progress-bar id="progress"></vue-progress-bar>
							<h2 class="text-center mb-2">Espace de partage</h2>
							<hr :class="{ uploading: isUploading }"/>
							<p class="text-center mb-3">
								Déposez ci-dessous tous les éléments utiles à la création de
								votre site internet : <br/>
								logo, photos, flyers, carte de visite, etc.
								<span class="max-size-upload-label"
								>(Taille maximale par fichier : 15 Mo)</span
								>
							</p>
							<div id="file-drag-drop" class="drop-zone">
								<a @click="add_files()">
									<form ref="fileform">
										<div v-if="0 === files.length">
											<img
												class="upload-logo"
												src="@/assets/upload-cloud.svg"
												width="50"
											/>
											<p class="drop-files">Déposez vos fichiers ici</p>
										</div>
										<div
											v-for="(file, key) in files"
											:key="key + forceReload"
											class="file-listing"
										>
											{{ file.name }}
											<a
												@click.stop="removeFile(key)"
												style="z-index: 4"
												v-if="false === file.uploaded || !isUploading"
											>
												<img
													class="delete-file cross-preview"
													src="@/assets/delete.png"
												/>
											</a>
											<span
												v-if="file.isUploading"
												class="uploading-file cross-preview"
											><i class="fas fa-fan"></i
											></span>
											<span
												v-if="file.uploaded"
												class="uploaded-file cross-preview"
											><i class="fas fa-check-circle"></i
											></span>
											<span
												v-if="false === file.uploaded"
												class="error-file cross-preview"
											><i class="fas fa-exclamation-circle"></i
											></span>
										</div>
									</form>
								</a>
								<a
									class="submit-button"
									:class="isUploading ? 'disabled' : ''"
									@click="submitFiles()"
									v-show="files.length > 0"
								>Envoyer</a
								>
							</div>
						</b-col>
						<b-col lg="4" md="6" sm="6" class="my-files-container px-2">
							<h2 class="text-center my-files-entitle">Mes fichiers</h2>
							<hr/>
							<fade-loader
								v-if="status.isPageLoading"
								:color="color"
								class="loader-accueil"
							></fade-loader>
							<div
								v-if="!status.isPageLoading && !status.isGetRecentFolderLoading"
								v-for="(folder, index) in folders"
								:key="folder.id"
							>
								<div class="folders_list">
                  <span
					  @click="list_files(folder.name, index, $event)"
					  class="folder-label"
				  >
                    <i class="fas fa-folder"></i> {{ folder.name }}
                  </span>
									<ul class="files_list">
										<li v-for="file in filesFromFolder[index]" :key="file.id">
											<a
												class="open-file"
												download
												v-if="!status.isPageLoading"
												@click="download_file(file, folder.name)"
											>
												<p class="filename">{{ file.name }}</p>
											</a>
										</li>
									</ul>
								</div>
								<hr v-if="!status.isPageLoading"/>
							</div>
						</b-col>
					</b-row>
				</b-col>
				<b-col lg="12" md="12" sm="12" hidden>
					<label>
						<input
							type="file"
							id="files"
							ref="files"
							multiple
							@change="handle_files_upload()"
							:accept="allowedUploadExtensions"
						/>
					</label>
				</b-col>
			</b-row>
		</b-container>
		<app-footer class="footer-profile"></app-footer>
	</div>
</template>

<script lang="ts" setup>
import {dropboxService} from "@/services";
import {readyState, progressBar, dropboxHelper} from "@/helpers";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import {useStore} from "vuex";
import MenuMobile from "@/components/MenuMobile.vue";
import {getAllowedExtensions} from "@/helpers/file.helper";
import usePartner from "@/mixins/usePartner";
import {
	computed,
	getCurrentInstance,
	onBeforeUnmount,
	onMounted,
	ref,
} from "vue";
import {useRoute, useRouter} from "vue-router";

let internalInstance = getCurrentInstance();
let progress = internalInstance.appContext.config.globalProperties.$Progress;

let store = useStore();
let route = useRoute();
let router = useRouter();

let {
	websiteLink,
	customerCode,
	userEmail,
	displayPartnerFolder,
	isPageLoading,
} = usePartner();

let currentPartner = computed(() => store.state.account.currentPartner);
let identity = computed(() => store.state.account.identity);
let status = computed(() => store.state.globalStore.status);
let salesforce = computed(() => store.state.globalStore.salesforce);

let dragAndDropCapable = ref(false);
let files = ref([]);
let folders = ref([]);
let filesFromFolder = ref([]);
let color = ref("#ec008c");
let allowedUploadExtensions = ref(getAllowedExtensions().join(","));
let errorsUploading = ref(false);
let isUploading = ref(false);
let hasFolder = ref(true);
let defaultFolderPath = ref("");
let forceReload = ref(0);

onMounted(async () => {
	defaultFolderPath.value = await dropboxHelper.getFolderPath();
	let currentPartner = await readyState.getCurrentPartnerState();
	let salesforce = await readyState.getSalesforceState();
	if (
		!currentPartner ||
		!route.params.customerCode ||
		currentPartner.customerCode !== parseInt(route.params.customerCode)
	) {
		return router.push(isUser ? "/" : "/backoffice");
	}

	if (currentPartner && salesforce) {
		await list_folders();
		if (false === status.value.hasMostRecentFolder) {
			dropboxHelper.getMostRecentFolder(
				currentPartner.customerCode,
				salesforce.account.Name
			);
		}
	}

	dragAndDropCapable.value = determineDragAndDropCapable();
	if (dragAndDropCapable.value) {
		[
			"drag",
			"dragstart",
			"dragend",
			"dragover",
			"dragenter",
			"dragleave",
			"drop",
		].forEach(
			function (evt: any) {
				ref.fileform.addEventListener(
					evt,
					function (e: {
						preventDefault: () => void;
						stopPropagation: () => void;
					}) {
						e.preventDefault();
						e.stopPropagation();
					}.bind(this),
					false
				);
			}.bind(this)
		);
		ref.fileform.addEventListener(
			"drop",
			function (e: { dataTransfer: { files: string | any[] } }) {
				for (let i = 0; i < e.dataTransfer.files.length; i++) {
					files.value.push(e.dataTransfer.files[i]);
				}
			}.bind(this)
		);
	}
});

let uploadDropboxFile = store.dispatch("globalStore/uploadDropboxFile");

let close_menu = () => {
	MenuMobile.methods.closeNav();
};
let extract_file_name = (fileName: any) => {
	return fileName.split("/")[fileName.split("/").length - 1].substr(13);
};
let add_files = () => {
	ref.files.click();
};
let handle_files_upload = () => {
	let uploadedFiles = ref.files.files;
	for (let i = 0; i < uploadedFiles.length; i++) {
		files.value.push(uploadedFiles[i]);
	}
};
let determineDragAndDropCapable = () => {
	let div = document.createElement("div");
	return (
		("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
		"FormData" in window &&
		"FileReader" in window
	);
};
let removeFile = (key: any) => {
	files.value.splice(key, 1);
};
let submitFiles = async () => {
	if (!files.value.length || isUploading) {
		return;
	}
	isUploading = true;
	let folderName = defaultFolderPath;
	let subFolder = dropboxHelper.getElementsFolderName();
	progress.start();
	progress.pause();

	let formData = new FormData();
	files.value.forEach((file, i) => formData.append(`files[${i}]`, file));

	if (!status.value.isDropboxEmailSent) {
		dropboxHelper.sendEmailForMultipleFoldersFound("drop-element");
	}

	let percentPerFile = progressBar.getPercentagePerFile(files.value.length);
	let round = 0;
	let filesSent = [];

	let newFolderPath = dropboxHelper.retrieveMostRecentBasePath();
	let message = dropboxHelper.getMultipleFoldersMessage();

	let folderPathFound = newFolderPath || folderName;

	for (let i = 0; i < files.value.length; i++) {
		let file = files[i];
		file.isUploading = true;
		forceReload.value++;
		progress.set(round);

		try {
			let result = await uploadDropboxFile({
				folderName: folderPathFound,
				subFolder,
				file,
				message,
			});
			if (result.name) {
				file.uploaded = true;
				filesSent.push(file.name);
				round += percentPerFile;
				progress.set(round);
				progress.pause();
			} else {
				file.uploaded = false;
				errorsUploading.value = true;
			}
		} catch (e) {
			file.uploaded = false;
			errorsUploading.value = true;
		}
		file.isUploading = false;
		forceReload.value++;
	}

	if (
		!errorsUploading.value &&
		status &&
		status.value.isSalesforceProductionValidated
	) {
		dropboxHelper.notifyUploadedFiles(
			"drop-element",
			filesSent,
			dropboxHelper.getFolderNameForNotifyUploadedFiles(folderPathFound)
		);
	}

	let resetting;
	if (errorsUploading.value) {
		progress.setColor("red");
		resetting = new Promise((resolve) =>
			setTimeout(() => {
				progress.hide();
				progress.set(0);
				resolve();
			}, 10000)
		);
	} else {
		progress.finish();
		resetting = Promise.resolve();
	}
	resetting.then(async () => {
		files.value = [];
		folders.value = [];
		filesFromFolder.value = [];
		progress.setColor("#ec008c");
		errorsUploading.value = null;
		isUploading.value = false;
		filesSent = [];
		await list_folders();
	});
};
let list_folders = async () => {
	folders.value = [];
	await dropboxService
		.getFolder(currentPartner.value.customerCode, salesforce.value.account.Name)
		.then((folders) => {
			folders.forEach((folder: any) => {
				folders.push(folder);
			});
		});
};
let list_files = async (
	subFolder: any,
	index: any,
	event: {
		currentTarget: { firstChild: any; tagName: string };
		target: {
			classList: {
				remove: (arg0: string) => void;
				add: (arg0: string) => void;
			};
		};
	}
) => {
	let folder = event.currentTarget.firstChild;

	if ("span" === event.currentTarget.tagName.toLowerCase()) {
		folder.classList.toggle("fa-folder-open");
		event.target.classList.remove("empty-files");
	} else {
		folder.classList.toggle("fa-folder");
	}

	$set(filesFromFolder, index, []);

	if ("fas fa-folder fa-folder-open" === folder.className) {
		await dropboxService
			.getFolder(
				currentPartner.value.customerCode,
				salesforce.value.account.Name,
				subFolder
			)
			.then((files) => {
				if (!files.length) {
					event.target.classList.add("empty-files");
				}

				$set(filesFromFolder, index, files);
			});
	}
};
let download_file = async (file: { name: string }, subFolder: any) => {
	await dropboxService
		.downloadFile(
			currentPartner.value.customerCode,
			salesforce.value.account.Name,
			subFolder,
			file.name
		)
		.then((data) => {
			let url = window.URL.createObjectURL(new Blob([data]));
			let link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", file.name);
			document.body.appendChild(link);
			link.click();
		});
};

onBeforeUnmount(() => {
	if (dragAndDropCapable.value) {
		[
			"drag",
			"dragstart",
			"dragend",
			"dragover",
			"dragenter",
			"dragleave",
			"drop",
		].forEach((el) => {
			ref.fileform.removeEventListener(
				el,
				(e: { preventDefault: () => void; stopPropagation: () => void }) => {
					e.preventDefault();
					e.stopPropagation();
				},
				true
			);
		});
	}
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/dragdrop.scss";
@import "@/assets/style/progress-bar.scss";
</style>
