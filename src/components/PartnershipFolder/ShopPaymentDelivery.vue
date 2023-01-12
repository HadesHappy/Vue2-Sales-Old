<template>
  <b-container fluid>
    <b-row class="mb-3">
      <b-col>
        <span class="form-description">Moyens de paiement</span>
      </b-col>
    </b-row>
    <!-- shopPaymentDeliveryForm -->
    <b-row class="mb-3">
      <b-col
        v-for="(paymentMethod, index) in shopPaymentMethods"
        :key="paymentMethod.value"
        lg="2"
        md="3"
      >
        <b-form-checkbox-group
          @change="
            onPaymentMethodChange($event, {
              partnerFolder: currentPartnerFolder,
            })
          "
          :name="`currentPartnerFolder.paymentModes[${index}].name`"
          :options="[paymentMethod]"
          v-model="checkedPaymentMethods"
          :disabled="!allowedToEdit"
          :readonly="!allowedToEdit"
          type="checkbox"
        ></b-form-checkbox-group>
      </b-col>
      <b-col sm="12" md="2" lg="2">
        <ValidationProvider
          name="nom de la banque"
          rules="min:3"
          ref="currentPartnerFolder.bankDescription"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            @focus="onFocus"
            @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
            type="text"
            :class="classes"
            name="currentPartnerFolder.bankDescription"
            v-model="currentPartnerFolder.bankDescription"
            :disabled="
              !allowedToEdit || -1 === checkedPaymentMethods.indexOf('Banque')
            "
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <span class="form-description">Livraison</span>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col id="payment-method" lg="2" md="3">
        <ValidationProvider
          name="Livraison possible"
          ref="currentPartnerFolder.partnerShop.deliveryAvailable"
          v-slot="{ classes, errors }"
        >
          <b-form-radio-group
            @change="
              onBlur($event, {
                partnerShop: currentPartnerFolder.partnerShop,
                type: 'bool',
              })
            "
            name="currentPartnerFolder.partnerShop.deliveryAvailable"
            v-model="currentPartnerFolder.partnerShop.deliveryAvailable"
            :options="yesNoOptions"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="checkbox"
          >
          </b-form-radio-group>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="(item, index) in shopDeliveryMethods"
        :key="item.value"
        md="2"
        lg="1"
        class="display-context"
      >
        <b-form-checkbox-group
          @change="
            onDeliveryMethodChange($event, {
              partnerFolder: currentPartnerFolder,
            })
          "
          v-model="checkedDeliveryMethods"
          :name="`currentPartnerFolder.deliveryModes[${index}].name`"
          :options="[item]"
          :disabled="!allowedToEdit"
          :readonly="!allowedToEdit"
          type="checkbox"
        ></b-form-checkbox-group>
      </b-col>
      <b-col
        v-if="isOtherDeliveryMethodChecked()"
        sm="12"
        md="12"
        lg="4"
        class="display-context__input"
      >
        <ValidationProvider
          name="Autre mode de livraison"
          rules="min:3"
          :ref="`currentPartnerFolder.deliveryModes[${getOtherDeliveryMethodIndex()}].name`"
          v-slot="{ classes, errors }"
        >
          <label class="label">Autre(s)</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onDeliveryMethodChange($event, {
                partnerFolder: currentPartnerFolder,
              })
            "
            type="text"
            :class="classes"
            :name="`currentPartnerFolder.deliveryModes[${getOtherDeliveryMethodIndex()}].name`"
            v-model="otherDeliveryMethod.name"
            :disabled="!allowedToEdit || !isOtherDeliveryMethodChecked()"
            :readonly="!allowedToEdit || !isOtherDeliveryMethodChecked()"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col cols="12">
        <ValidationProvider
          name="Adresse de retrait"
          rules="min:3"
          ref="atShopDeliveryMode.deliveryAddress"
          v-slot="{ classes, errors }"
        >
          <label class="label">Adresse de retrait</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onAtShopDeliveryModeChange($event, {
                partnerFolder: currentPartnerFolder,
              })
            "
            type="text"
            :class="classes"
            name="atShopDeliveryMode.deliveryAddress"
            v-model="deliveryAddress"
            :disabled="!allowedToEdit || !atShopDeliveryModeChecked"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col cols="12">
        <ValidationProvider
          name="Horaire de retrait"
          ref="atShopDeliveryMode.deliverySchudle"
          v-slot="{ classes, errors }"
        >
          <label class="label">Horaire de retrait</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onAtShopDeliveryModeChange($event, {
                partnerFolder: currentPartnerFolder,
              })
            "
            type="text"
            :class="classes"
            name="atShopDeliveryMode.deliverySchudle"
            v-model="deliverySchudle"
            :disabled="!allowedToEdit || !atShopDeliveryModeChecked"
            :readonly="!allowedToEdit"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col lg="4" md="6">
        <ValidationProvider
          name="Temps de préparation"
          ref="atShopDeliveryMode.preparationTime"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Temps de préparation (7 jours max soit 9 999 minutes)</label
          >
          <div class="d-inline-flex">
            <b-form-input
              @focus="onFocus"
              @blur="
                onAtShopDeliveryModeChange($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'int',
                })
              "
              type="number"
              :class="classes"
              name="atShopDeliveryMode.preparationTime"
              v-model="deliveryPreparationTime"
              :disabled="!allowedToEdit || !atShopDeliveryModeChecked"
              :readonly="!allowedToEdit"
            ></b-form-input>
            <span class="minutes">minutes</span>
          </div>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { validateSection } from "@/helpers";
import {useDP} from "@/mixins/useDP";
import { useStore } from "vuex";
import {
  shopPaymentMethods,
  shopDeliveryMethods,
  yesNoOptions,
} from "@/Interface/partnershipFolderDatas";

let store = useStore();
let { allowedToEdit, verifyFields } = useDP();

let identity = computed(() => store.state.account.identity);
let opportunity = computed(() => store.state.account.opportunity);
let currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
let paymentModes = computed(() => store.state.globalStore.paymentModes);
let deliveryModes = computed(() => store.state.globalStore.deliveryModes);

let deliveryAddress = computed({
  get() {
    return atShopDeliveryMode.value
      ? atShopDeliveryMode.value.deliveryAddress
      : null;
  },
  set(val) {
    if (atShopDeliveryMode.value) {
      atShopDeliveryMode.value.deliveryAddress = val;
    }
  },
});
let deliverySchudle = computed({
  get() {
    let atShopDeliveryMode = findAtShopDeliveryMode();
    return atShopDeliveryMode ? atShopDeliveryMode.deliverySchudle : null;
  },
  set(val) {
    let atShopDeliveryMode = findAtShopDeliveryMode();
    if (atShopDeliveryMode) {
      atShopDeliveryMode.deliverySchudle = val;
    }
  },
});
let deliveryPreparationTime = computed({
  get() {
    return atShopDeliveryMode.value
      ? atShopDeliveryMode.value.preparationTime
      : null;
  },
  set(val) {
    if (atShopDeliveryMode.value) {
      atShopDeliveryMode.value.preparationTime = val;
    }
  },
});

let checkedPaymentMethods = ref([]);
let checkedDeliveryMethods = ref([]);
let pickUpAddress = ref([]);
let pickUpHours = ref([]);
let atShopDeliveryMode = ref({});
let atShopDeliveryModeChecked = ref(false);
let otherDeliveryMethod = ref({});

let updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
let getPaymentModes = () => store.dispatch("globalStore/getPaymentModes");

let onFocus = (event: { target: { value: any } }) => {
  previousEditedValue = event.target.value;
};
let onBlur = (
  event: { target: { name: string | number } },
  data: { deliveryMode?: any; partnerShop?: any }
) => {
  let provider = ref[event.target.name];
  if (data.partnerShop && !data.partnerShop.id) {
    data.partnerShop.partnerFolder = currentPartnerFolder.value["@id"];
  }
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  }).then(() => verifyFields());
};
let onPaymentMethodChange = (
  event: any,
  data: { partnerFolder: any; offset: string; value: any[] }
) => {
  let newPaymentModes: (
    | { id: never; name?: undefined }
    | { name: never; id?: undefined }
  )[] = [];
  checkedPaymentMethods.value.forEach((checkedPaymentMethod) => {
    if (checkedPaymentMethod) {
      newPaymentModes.push(
        paymentModes[checkedPaymentMethod]
          ? { id: paymentModes[checkedPaymentMethod]["@id"] }
          : { name: checkedPaymentMethod }
      );
    }
  });
  if (data.partnerFolder) {
    data.offset = "paymentModes";
    data.value = newPaymentModes;
    updatePartnerPropertyFromForm({ data }).then(() => verifyFields());
  }
};
let onDeliveryMethodChange = (
  event: any,
  data: { partnerFolder: any; offset: string; value: any[] }
) => {
  let newDeliveryMethods: (
    | { id: any; name: any }
    | { name: any; id?: undefined }
    | { id: any; name?: undefined }
  )[] = [];
  atShopDeliveryModeChecked = false;
  checkedDeliveryMethods.value.forEach((checkedDeliveryMethod) => {
    if (!checkedDeliveryMethod) {
      return;
    }

    if ("Retrait en boutique" === checkedDeliveryMethod) {
      atShopDeliveryModeChecked = true;
    }

    let deliveryModeFound = currentPartnerFolder.value.deliveryModes.find(
      (item: { name: any }) => item.name === checkedDeliveryMethod
    );

    if ("Autre(s)" === checkedDeliveryMethod) {
      newDeliveryMethods.push(
        deliveryModeFound
          ? {
              id: deliveryModeFound["@id"],
              name: otherDeliveryMethod.value.name || "",
            }
          : {
              name: otherDeliveryMethod.value.name || "",
            }
      );
    } else {
      newDeliveryMethods.push(
        deliveryModeFound
          ? { id: deliveryModeFound["@id"] }
          : { name: checkedDeliveryMethod }
      );
    }
  });

  if (!atShopDeliveryModeChecked.value) {
    atShopDeliveryMode = {};
  }

  if (data.partnerFolder) {
    data.offset = "deliveryModes";
    data.value = newDeliveryMethods;
    updatePartnerPropertyFromForm({ data }).then(() => verifyFields());
  }
};
let onAtShopDeliveryModeChange = (event: any, data: any) => {
  onBlur(event, { deliveryMode: findAtShopDeliveryMode() });
};
let findAtShopDeliveryMode = () => {
  return currentPartnerFolder.value.deliveryModes.find(
    (item: { name: string }) => "Retrait en boutique" === item.name
  );
};
let isOtherDeliveryMethodChecked = () => {
  return -1 !== checkedDeliveryMethods.value.indexOf("Autre(s)");
};
let getOtherDeliveryMethodIndex = () => {
  if (isOtherDeliveryMethodChecked()) {
    return currentPartnerFolder.value.deliveryModes.indexOf(
      (deliveryMode: any) => deliveryMode === getOtherTypeOfDeliveryMethod()
    );
  }
  return -1;
};
let isDeliveryMethodExists = (deliveryName: string) => {
  return (
    undefined !==
    shopDeliveryMethods.find(
      (deliveryOption) => deliveryOption.value === deliveryName
    )
  );
};
let getOtherTypeOfDeliveryMethod = () => {
  return currentPartnerFolder.value.deliveryModes.find(
    (deliveryMode: any) => !isDeliveryMethodExists(deliveryMode)
  );
};
let validateFields = async (
  refs: any,
  entity: {
    currentPartnerFolder: {
      paymentModes: any;
      deliveryModes: any;
      bankDescription: any;
    };
  }
) => {
  if (!allowedToEdit) {
    return;
  }

  let isValid = await validateSection.validateRequiredFields(entity, refs);
  let { paymentModes, deliveryModes, bankDescription } =
    entity.currentPartnerFolder;
  let otherDeliveryMode = otherDeliveryMethod.value.name;

  let MIN_LENGTH_REQUIRED = 3;

  if (isValid) {
    paymentModes = paymentModes.filter(
      (item: { name: any }) => item && item.name
    );
    if (!paymentModes.length) {
      isValid = false;
    } else {
      // Need to have minimum one paymentMode selected and bankDescription filled by 3 chars min
      let paymentModesIsValid = paymentModes.some(
        (paymentMode: { name: string }) =>
          paymentMode.name && "Banque" !== paymentMode.name
      );
      let isBankChecked =
        -1 !==
        paymentModes.findIndex(
          (paymentMode: { name: string }) => "Banque" === paymentMode.name
        );
      if (!paymentModesIsValid) {
        if (
          !isBankChecked ||
          !bankDescription ||
          bankDescription.length < MIN_LENGTH_REQUIRED
        ) {
          isValid = null;
        }
      } else {
        if (
          isBankChecked &&
          (!bankDescription || bankDescription.length < MIN_LENGTH_REQUIRED)
        ) {
          isValid = null;
        }
      }
    }

    deliveryModes = checkedDeliveryMethods.value.filter((item) => item);
    if (!deliveryModes.length) {
      isValid = false;
    } else if (isValid) {
      // Need to have minimum one deliveryMode selected and otherDeliveryMode filled by 3 chars min
      let deliveryModeIsValid = deliveryModes.some(
        (deliveryMode: string) => "Autre(s)" !== deliveryMode
      );
      let isOtherDeliveryChecked =
        -1 !==
        deliveryModes.findIndex(
          (checkedDeliveryMethod: string) =>
            "Autre(s)" === checkedDeliveryMethod
        );
      if (!deliveryModeIsValid) {
        if (
          !isOtherDeliveryChecked ||
          !otherDeliveryMode ||
          otherDeliveryMode.length < MIN_LENGTH_REQUIRED
        ) {
          isValid = null;
        }
      } else {
        if (
          isOtherDeliveryChecked &&
          (!otherDeliveryMode || otherDeliveryMode.length < MIN_LENGTH_REQUIRED)
        ) {
          isValid = null;
        }
      }
    }
  }
  validateSection.displayColorStateOnSection("shop-payment-delivery", isValid);
};

onMounted(() => {
  if (!Object.keys(paymentModes).length) {
    getPaymentModes();
  }

  checkedPaymentMethods = currentPartnerFolder.value.paymentModes
    .filter((item: { [s: string]: unknown } | ArrayLike<unknown>) =>
      Object.values(item).length ? item : null
    )
    .map((checkedPaymentMode: { name: any }) => checkedPaymentMode.name);
  checkedDeliveryMethods =
    currentPartnerFolder.value &&
    currentPartnerFolder.value.deliveryModes.length
      ? currentPartnerFolder.value.deliveryModes.map((item: { name: any }) => {
          if (item.name && !isDeliveryMethodExists(item.name)) {
            otherDeliveryMethod = item;
            return "Autre(s)";
          }
          return item.name;
        })
      : [];
  atShopDeliveryMode = findAtShopDeliveryMode();
  if (atShopDeliveryMode.value) {
    atShopDeliveryModeChecked = true;
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
