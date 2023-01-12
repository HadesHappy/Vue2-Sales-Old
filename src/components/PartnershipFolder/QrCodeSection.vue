<template>
	<b-container fluid v-if="currentPartnerFolder">
		<b-row class="mb-3">
			<b-col sm="5">
				<label class="label"
				>Souhaitez-vous que l'on crée un QR Code pour permettre à vos clients
					de consulter votre carte en ligne ?</label
				>

				<b-form-select
					@change="
              onBlur($event, {
                opportunity: salesforce.opportunity,
                type: 'bool',
              })
            "
					@focus="onFocus"
					:class="classes"
					name="salesforce.opportunity.QR_Code__c"
					v-model="isQRCodeActive"
					:options="yesNoOptions"
					:disabled="!identity.allowedToEdit"
					:readonly="!identity.allowedToEdit"
				></b-form-select>
				<small :class="classes"></small>
			</b-col>
		</b-row>
		<b-row v-if="isQRCodeActive">
			<b-col md="3" sm="6" class="ml-3">
				<b-row>
          <span>
            À quelle date pensez-vous nous communiquer votre carte ?
          </span>
				</b-row>
				<b-row>
          <span class="sub-text"
		  >(Sensibiliser sur la qualité des éléments à transmettre)</span
		  >
				</b-row>
			</b-col>
			<b-col md="3" sm="6">
				<ValidationProvider
					name="Date de transmission de la carte"
					ref="currentPartnerFolder.partnerHotelResto.cardSendDate"

				>
					<b-form-input
						@focus="onFocus"
						@blur="
              onBlur($event, {
                partnerHotelResto: currentPartnerFolder.partnerHotelResto,
              })
            "
						v-model="cardSendDate"
						name="currentPartnerFolder.partnerHotelResto.cardSendDate"
						:class="classes"
						type="date"
						:disabled="!identity.allowedToEdit"
						:readonly="!identity.allowedToEdit"
					></b-form-input>
					<small :class="classes"></small>
				</ValidationProvider>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {yesNoOptions as yesNoOptionsInterface} from "@/Interface/partnershipFolderDatas";
import {dateHelpers, validateSection} from "@/helpers";
import {computed, onMounted, ref} from "vue";
import {useDP} from "@/mixins/useDP";

const store = useStore();
const {verifyFields} = useDP();

let yesNoOptions = ref(yesNoOptionsInterface);
let qrCodeActive = ref(null);
let previousEditedValue = ref(null);

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(() => store.state.account.currentPartnerFolder);
const status = computed(() => store.state.globalStore.status);
const salesforce = computed(() => store.state.globalStore.salesforce);

const updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);

const isQRCodeActive = computed({
	set(value: any) {
		qrCodeActive.value = value;
		salesforce.value.opportunity.QR_Code__c = value;
	},
	get() {
		return qrCodeActive;
	},
});

const cardSendDate = computed({
	get() {
		return currentPartnerFolder.value.partnerHotelResto.cardSendDate
			? dateHelpers.dateToStringForInput(
				currentPartnerFolder.value.partnerHotelResto.cardSendDate
			)
			: null;
	},
	set(value) {
		return (currentPartnerFolder.value.partnerHotelResto.cardSendDate = value);
	},
});

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
	}).then(() => verifyFields());
};
const validateFields = (refs: any, entity: any) => {
	if (!identity.value.allowedToEdit) {
		return;
	}

	let isValid = "reset";
	if (isQRCodeActive.value) {
		isValid = cardSendDate.value ? true : null;
	}

	validateDisplayColor(isValid);
};
const validateDisplayColor = (isValid: string) => {
	return validateSection.displayColorStateOnSection("qr-code-section", isValid);
};

onMounted(() => {
	qrCodeActive = status.value.isQrcodeEnabled;
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
