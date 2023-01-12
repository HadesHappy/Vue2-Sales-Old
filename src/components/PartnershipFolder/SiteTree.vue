<template>
	<b-container fluid>
		<b-row class="mb-3">
			<b-col lg="2" md="3">
				<span>Version étrangère souhaitée :</span>
			</b-col>
			<b-col lg="10" md="9">
				<b-row>
					<b-col
						class="languages mb-1"
						v-for="(availableLanguage, index) in availableLanguages"
						:key="availableLanguage.value"
						lg="3"
						md="4"
						sm="6"
					>
						<b-form-checkbox
							class="mb-1"
							:name="`currentPartnerFolder.sites.0.languages.${index}.language`"
							:disabled="true"
							:readonly="true"
							:value="availableLanguage.value"
							v-model="checkedLanguages"
							type="checkbox"
							help="Les contenus traduits sont fournis par le partenaire"
						>
							<img
								:src="`@/assets/flag-${availableLanguage.value}.png`"
							/>
						</b-form-checkbox>
						<div
							class="translations translations-group"
							v-if="isLanguageChecked[index]"
							v-for="(translateOption, index2) in translateOptions"
							:key="translateOption.value"
						>
							<b-form-radio-group
								:name="`currentPartnerFolder.sites.0.languages.${index2}.toTranslate`"
								:disabled="true"
								:readonly="true"
								:options="[translateOption]"
								v-model="toTranslate[availableLanguage.value]"
								type="checkbox"
							></b-form-radio-group>
						</div>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
		<!-- banner -->
		<b-row class="mb-3">
			<b-col>
        <span
		>Quelles informations souhaitez-vous indiquer dans le bandeau de votre
          site ?
          <span class="info-field">(Champ limité à 255 caractères)</span></span
		>
			</b-col>
		</b-row>
		<!-- include Banners component -->
		<Banners
			v-bind:verifyFields="verifyFields"
			:allowedToEdit="allowedToEdit"
		/>
		<!-- Keep SiteTree -->
		<b-row class="mb-3">
			<b-col cols="12">
					<b-form-checkbox
						@change="
              onBlur($event, {
                site: currentPartnerFolder.sites[0],
                type: 'bool',
              })
            "
						type="checkbox"
						name="currentPartnerFolder.sites.0.keepTree"
						v-model="keepTree"
						:disabled="!allowedToEdit"
						:readonly="!allowedToEdit"
					>
						Je ne souhaite pas modifier l'arborescence
					</b-form-checkbox>
			</b-col>
		</b-row>
		<b-row class="mb-3" v-if="!keepTree">
			<b-col>
				<span class="form-description">Arborescence</span>
			</b-col>
		</b-row>
		<b-row class="pages-container" v-if="!keepTree">
<!--			<draggable-->
<!--				class="draggable-tree"-->
<!--				:class="{ zone: drag }"-->
<!--				:list="siteTrees"-->
<!--				:disabled="!allowedToEdit && !isSiteTreeUpdating"-->
<!--				handle=".dnd-handle"-->
<!--				@start="drag = true"-->
<!--				@end="drag = false"-->
<!--				ghost-class="dnd-ghost"-->
<!--				@dragend="onDragAndDrop(siteTrees)"-->
<!--			>-->
<!--				<b-col-->
<!--					lg="3"-->
<!--					md="4"-->
<!--					sm="12"-->
<!--					class="page-item mb-3"-->
<!--					v-for="(item, index) in siteTrees"-->
<!--					:key="index"-->
<!--				>-->
<!--					<b-col class="mb-2 __title p-0">-->
<!--						<ValidationProvider-->
<!--							name="nom"-->
<!--							:rules="{-->
<!--                required: true,-->
<!--                min: 3,-->
<!--                max: 255,-->
<!--                expectedUniqueValues: { values: pageNames },-->
<!--              }"-->
<!--							:ref="`currentPartnerFolder.sites.0.siteTrees.${index}.name`"-->
<!--							v-slot="{ validate, classes, errors }"-->
<!--						>-->
<!--							<div class="input-text">-->
<!--								<b-form-input-->
<!--									type="text"-->
<!--									@focus="onFocus($event, index)"-->
<!--									@blur="onPageUpdate($event, { siteTree: item })"-->
<!--									:class="classes"-->
<!--									:disabled="!allowedToEdit || drag || isSiteTreeUpdating"-->
<!--									:readonly="!allowedToEdit"-->
<!--									:name="`currentPartnerFolder.sites.0.siteTrees.${index}.name`"-->
<!--									v-model="item.name"-->
<!--								></b-form-input>-->
<!--								<TextLengthMessage :value="item.name" maxlength="255"/>-->
<!--							</div>-->
<!--							<small :class="classes">{{ errors[0] }}</small>-->
<!--						</ValidationProvider>-->
<!--					</b-col>-->
<!--					<i-->
<!--						class="dnd-handle fas fa-arrows-alt"-->
<!--						v-if="allowedToEdit && !isSiteTreeUpdating"-->
<!--					></i>-->
<!--					<i-->
<!--						class="fas fa-trash"-->
<!--						v-if="-->
<!--              allowedToEdit &&-->
<!--              !isSiteTreeUpdating &&-->
<!--              siteTrees &&-->
<!--              siteTrees.length > 2-->
<!--            "-->
<!--						@click="onPageRemove(item, index)"-->
<!--					></i>-->
<!--					<i-->
<!--						class="fas fa-fan"-->
<!--						v-if="-->
<!--              allowedToEdit &&-->
<!--              isSiteTreeUpdating &&-->
<!--              (index === currentPageIndex || null === currentPageIndex)-->
<!--            "-->
<!--					></i>-->
<!--					<b-col class="mb-2 __description p-0">-->
<!--						<ValidationProvider-->
<!--							name="description"-->
<!--							rules="required|min:6"-->
<!--							:ref="`currentPartnerFolder.sites.0.siteTrees.${index}.description`"-->
<!--							v-slot="{ validate, classes, errors }"-->
<!--						>-->
<!--							<b-form-textarea-->
<!--								type="textarea"-->
<!--								v-if="allowedToEdit"-->
<!--								v-autoresize-->
<!--								@focus="onFocus($event, index)"-->
<!--								@blur="onPageUpdate($event, { siteTree: item })"-->
<!--								:class="classes"-->
<!--								rows="5"-->
<!--								:disabled="!allowedToEdit || drag || isSiteTreeUpdating"-->
<!--								:readonly="!allowedToEdit"-->
<!--								:name="`currentPartnerFolder.sites.0.siteTrees.${index}.description`"-->
<!--								v-model="item.description"-->
<!--								placeholder="Décrire le contenu de la page"-->
<!--							></b-form-textarea>-->
<!--							<div-->
<!--								class="pre-line-text"-->
<!--								v-else-if="-->
<!--                  !allowedToEdit && item.description && item.description.length-->
<!--                "-->
<!--							>-->
<!--								{{ item.description }}-->
<!--							</div>-->
<!--							<small :class="classes">{{ errors[0] }}</small>-->
<!--						</ValidationProvider>-->
<!--					</b-col>-->
<!--					<b-row class="__subpages px-3">-->
<!--						<b-form-group-->
<!--							label-cols="10"-->
<!--							label="Nombre de sous-pages"-->
<!--							label-align="right"-->
<!--							class="w-100"-->
<!--						>-->
<!--							<ValidationProvider-->
<!--								name="sous-pages"-->
<!--								rules="integer"-->
<!--								:ref="`siteTrees.${index}.subpagesQuantity`"-->
<!--								v-slot="{ validate, classes, errors }"-->
<!--							>-->
<!--								<b-form-input-->
<!--									type="number"-->
<!--									@focus="onFocus($event, index)"-->
<!--									@blur="onPageUpdate($event, { siteTree: item })"-->
<!--									:class="classes"-->
<!--									:disabled="!allowedToEdit || drag || isSiteTreeUpdating"-->
<!--									:readonly="!allowedToEdit"-->
<!--									:name="`siteTrees.${index}.subpagesQuantity`"-->
<!--									v-model="item.subpagesQuantity"-->
<!--									class="px-0"-->
<!--								></b-form-input>-->
<!--								<small :class="classes">{{ errors[0] }}</small>-->
<!--							</ValidationProvider>-->
<!--						</b-form-group>-->
<!--					</b-row>-->
<!--				</b-col>-->
<!--			</draggable>-->

			<b-col
				lg="3"
				md="4"
				sm="12"
				class="page-item sample-page mb-3"
				v-if="allowedToEdit"
				@click="onPageAdd"
			>
				<b-col class="mb-2 __title px-0 py-2">&nbsp;</b-col>
				<b-col class="mb-2 __description p-0">
					<i class="fas fa-plus"></i>
				</b-col>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {
	availableLanguages,
	translateOptions,
} from "@/Interface/partnershipFolderDatas";
import Banners from "@/components/PartnershipFolder/Banners.vue";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";

import autoresize from "@/directives/AutoResize.vue";
import draggable from "vuedraggable";
import {validateSection, readyState} from "@/helpers";
//import { extend } from "vee-validate";
import {useDP} from "@/mixins/useDP";
import {BCol, BRow,BContainer} from "bootstrap-vue-3";

let store = useStore();
let {allowedToEdit} = useDP();

//extend("expectedUniqueValues", validateSection.expectedUniqueValues);

let identity = computed(() => store.state.account.identity);
let opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);


let warn = computed(() => store.state.alertStore.warn);

let siteTrees = computed(() => {
	return currentPartnerFolder.value &&
	currentPartnerFolder.value.sites &&
	currentPartnerFolder.value.sites.length
		? currentPartnerFolder.value.sites[0].siteTrees
		: [];
});
let pageNames = computed(() => {
	return siteTrees.value.map((item: { name: any }) => item.name);
});

let drag = ref(false);
let checkedLanguages = ref([]);
let isLanguageChecked = ref([]);
let toTranslate = ref({});
let previousEditedValue = ref(null);
let keepTree = ref(null);
let isSiteTreeUpdating = ref(false);
let cutomErrors = ref([]);
let currentPageIndex = ref(null);

let updatePartnerPropertyFromForm = () =>
	store.dispatch("account/updatePartnerPropertyFromForm");
let deletePartnerPropertyFromForm = () =>
	store.dispatch("account/deletePartnerPropertyFromForm");
let getLanguages = () => store.dispatch("globalStore/getLanguages");

let onFocus = (event: { target: { value: any } }, index: any) => {
	previousEditedValue = event.target.value;
	currentPageIndex = index;
};
let onBlur = (
	event: { target: { name: string | number } },
	data: { siteTree: { id: any; site: any; position: number } }
) => {
	if (isSiteTreeUpdating.value) {
		return;
	}

	isSiteTreeUpdating = true;
	let provider = ref[event.target.name];
	if (data.siteTree && !data.siteTree.id) {
		data.siteTree.site = currentPartnerFolder.value.sites[0]["@id"];
		if (
			1 === currentPartnerFolder.value.sites[0].siteTrees.length &&
			!currentPartnerFolder.value.sites[0].siteTrees[0]["@id"]
		) {
			data.siteTree.position = 1;
		}
	}
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	})
		.then(() => {
			initializeRelations();
			verifyFields();
		})
		.finally(() => (isSiteTreeUpdating = false));
};
let onPageUpdate = (
	event: { target: { value: null; name: string | number } },
	data: { siteTree: { id: any; site: any; position: number } }
) => {
	if (isSiteTreeUpdating.value) {
		return;
	}
	if (previousEditedValue.value === event.target.value) {
		return;
	}

	isSiteTreeUpdating = true;
	let provider = ref[event.target.name];
	let isNewPage = data.siteTree && !data.siteTree.id;
	if (isNewPage) {
		data.siteTree.site = currentPartnerFolder.value.sites[0]["@id"];
		if (
			1 === currentPartnerFolder.value.sites[0].siteTrees.length &&
			!currentPartnerFolder.value.sites[0].siteTrees[0]["@id"]
		) {
			data.siteTree.position = 1;
		}
	}
	let updatePromise = updatePartnerPropertyFromForm({
		event: event,
		provider: provider[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	});
	if (isNewPage) {
		updatePromise
			.then(() => {
				initializeRelations();
				verifyFields();
			})
			.finally(() => (isSiteTreeUpdating = false));
	} else {
		initializeRelations();
		verifyFields();
		isSiteTreeUpdating = false;
	}
};
let onPageAdd = () => {
	currentPartnerFolder.value.sites[0].siteTrees.push({
		name: null,
		description: null,
		subpagesQuantity: null,
		position: Math.max(
			currentPartnerFolder.value.sites[0].siteTrees.length,
			...currentPartnerFolder.value.sites[0].siteTrees.map(
				(item: { position: number }) => item.position + 1
			)
		),
	});
	initializeRelations();
	verifyFields();
};
let onPageRemove = (siteTree: { id: any }, index: any) => {
	if (isSiteTreeUpdating.value) {
		return;
	}

	if (siteTree && siteTree.id) {
		isSiteTreeUpdating = true;
		deletePartnerPropertyFromForm({
			data: {siteTree: siteTree},
			showNotification: false,
		})
			.then(() => {
				isSiteTreeUpdating = false;
				return onDragAndDrop(currentPartnerFolder.value.sites[0].siteTrees);
			})
			.then(() => {
				initializeRelations();
				verifyFields();
			})
			.finally(() => (isSiteTreeUpdating = false));
	} else {
		if (
			!currentPartnerFolder.value.sites[0].siteTrees ||
			currentPartnerFolder.value.sites[0].siteTrees.length <= 2
		) {
			store.dispatch("alert/warn", {
				group: "general-error",
				type: "warn",
				message:
					"Veuillez saisir un titre ainsi qu'une description pour cette page.",
				show: true,
				title: "Vous ne pouvez pas supprimer une page vide",
			});
		} else {
			currentPartnerFolder.value.sites[0].siteTrees.splice(index, 1);
			onDragAndDrop(currentPartnerFolder.value.sites[0].siteTrees);
		}
	}
};
let onDragAndDrop = (siteTrees: any[]) => {
	if (!allowedToEdit || isSiteTreeUpdating) {
		return;
	}

	currentPageIndex = null;
	isSiteTreeUpdating = true;
	return Promise.all(
		siteTrees.map((siteTree: { id: any; position: any }, index: any) => {
			if (!siteTree.id) {
				siteTree.position = index;
			}

			if (siteTree.position === index) {
				return Promise.resolve();
			}

			siteTree.position = index;

			return updatePartnerPropertyFromForm({
				data: {
					siteTree,
					payload: {
						position: index,
					},
				},
				showNotification: false,
			});
		})
	)
		.then(() => {
			initializeRelations();
			store.dispatch("alert/success", {
				group: "general-error",
				type: "success",
				message: "Données correctement mises à jour !",
				show: true,
				title: "Données sauvegardées !",
			});
		})
		.finally(() => {
			isSiteTreeUpdating = false;
			verifyFields();
		});
};
let initializeRelations = () => {
	currentPartnerFolder.value.sites[0].siteTrees.sort(
		(a: { position: number }, b: { position: number }) =>
			a.position - b.position
	);
};

let validateFields = async (
	refs: any,
	entity: { currentPartnerFolder: any; salesforce?: unknown }
) => {
	if (!allowedToEdit) {
		validateSection.displayColorStateOnSection("site-tree", "reset");
		return;
	}


	let isValid = await validateSection.validateRequiredFields(entity, refs);
	let siteTrees = [];
	if(entity.currentPartnerFolder && entity.currentPartnerFolder.value) {
		let siteTrees = entity.currentPartnerFolder.value.sites[0].siteTrees;
	}

	if (isValid) {
		let isBannerValid = entity.currentPartnerFolder.value.sites[0].banners.some(
			(banner: { leftContent: any; centerContent: any; rightContent: any }) =>
				banner.leftContent || banner.centerContent || banner.rightContent
		);
		if (false === isBannerValid) {
			isValid = null;
		}

		if (
			!validateSection.isUnique(
				siteTrees.map((item: { name: any }) => item.name)
			)
		) {
			isValid = null;
		}

		if (siteTrees.length < 3) {
			isValid = null;
		}
	}

	if (!keepTree.value) {
		let validate;
		for (let i = 0; i < siteTrees.length; i++) {
			let siteTree = siteTrees[i];
			if (!siteTree.name || siteTree.name.length < 3) {
				validate = await ref[
					`currentPartnerFolder.value.sites.0.siteTrees.${i}.name`
					][0].validate();
				isValid = validate.valid;
			}
			if (!siteTree.description || siteTree.description.length < 20) {
				validate = await ref[
					`currentPartnerFolder.value.sites.0.siteTrees.${i}.description`
					][0].validate();
				isValid = validate.valid;
			}
		}
	}

	validateSection.displayColorStateOnSection("site-tree", isValid);
};
let verifyFields = async () => {
	return validateFields(ref, {
		currentPartnerFolder: currentPartnerFolder,
	});
};

onMounted(() => {
	Promise.all([readyState.getSalesforceState()]).then(([salesforce]) => {
		currentPartnerFolder.value.sites[0].languages.forEach(
			(item: { language: string | number; toTranslate: any }) => {
				checkedLanguages.value.push(item.language);
				toTranslate[item.language] = item.toTranslate;
			}
		);
		isLanguageChecked = availableLanguages.map(
			(language) => -1 !== checkedLanguages.value.indexOf(language.value)
		);
		keepTree = currentPartnerFolder.value.sites[0].keepTree;
		initializeRelations();

		validateFields(ref, {
			salesforce,
			currentPartnerFolder: currentPartnerFolder,
		});
	});
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/page-details.scss";
</style>
