import {validateSection, readyState, authDpHelper} from "@/helpers";
//import { extend } from "vee-validate";
import {computed, getCurrentInstance, onMounted, watch} from "vue";
import {useStore} from "vuex";



// extend("expected", validateSection.expected);
// extend("expectedCheckedField", validateSection.expectedCheckedField);
// extend("requiredCheckedField", validateSection.requiredCheckedField);
// extend("expectedCheckbox", validateSection.expectedCheckboxValidator);
// extend("expectedFloat", validateSection.expectedFloat);
// extend("expectedValidPhone", validateSection.phoneValidator);

export const useDP = () => {
	const store = useStore();
	const updatePartnerPropertyFromForm = (data: any) =>
		store.dispatch("account/updatePartnerPropertyFromForm", data);

	const identity = computed(() => store.state.account.identity);
	const currentPartner = computed(() => store.state.account.currentPartner);
	const currentPartnerFolder = computed(
		() => store.state.account.currentPartnerFolder
	);
	const accountStatus = computed(() => store.state.account.accountStatus);
	const isClient = computed(() => { return authDpHelper.isUser(identity);});
	const currentSite = computed(() => {
		return currentPartnerFolder.value && currentPartnerFolder.value.sites
			? currentPartnerFolder.value.sites[0]
			: null;
	});

	const allowedToEdit = computed(() => {
		//console.log('DP mixngix', identity.value.allowedToEdit);
		return identity.value.allowedToEdit;
	});

	onMounted(() => {
		verifyFields();
	});

	const validateFields = async (
		refs: any,
		entity: any,
		componentName: string
	) => {
		if (!componentName) {
			return;
		}

		if (!allowedToEdit.value) {
			validateSection.displayColorStateOnSection(componentName, "reset");
			return;
		}

		validateSection.displayColorStateOnSection(
			componentName,
			await validateSection.validateRequiredFields(entity, refs)
		);
	};

	const verifyFields = () => {
		const componentName = getComponentName();
		return true;
		if (componentName) {
			validateFields(
				ref,
				{
					salesforce: this.salesforce,
					currentPartnerFolder: this.currentPartnerFolder,
				},
				componentName
			);
		}
	};

	const getComponentName = () => {
		const name = getCurrentInstance()?.type.__name
			.replace(/([a-z0-9]+)([A-Z0-9]+)/g, "$1-$2")
			.toLowerCase();
		return document.querySelector(`#${name}`) ? name : null;
	};

	const updatePartnerAndVerifyFields = (data: any) => {
		updatePartnerPropertyFromForm({data}).then(() => verifyFields());
	};

	watch(allowedToEdit, () => {
		validateSection.resetAllSections();
		verifyFields();
	});

	return {
		updatePartnerPropertyFromForm,
		identity,
		currentPartner,
		currentPartnerFolder,
		accountStatus,
		isClient,
		currentSite,
		allowedToEdit,
		validateFields,
		verifyFields,
		getComponentName,
		updatePartnerAndVerifyFields,
	};
}
