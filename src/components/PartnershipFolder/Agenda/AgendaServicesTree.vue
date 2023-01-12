<template>
  <b-container fluid id="services-tree">
    <b-row class="my-3">
      <b-col sm="12" md="2">
        <label class="label">Votre entreprise propose :</label>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ValidationProvider
          name="Services"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.hasServices"
          v-slot="{ classes, errors }"
        >
          <label>
            <b-form-checkbox
              type="checkbox"
              @change="
                onBlur($event, {
                  agenda: currentPartnerFolder.agenda,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.agenda.hasServices"
              v-model="currentPartnerFolder.agenda.hasServices"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              des services effectués par une personne en particulier (ex. coupe
              faite par une coiffeuse, épilation faite par une esthéticienne,
              etc.)
            </b-form-checkbox>
          </label>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ValidationProvider
          name="Ressources"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.hasResource"
          v-slot="{ classes, errors }"
        >
          <label>
            <b-form-checkbox
              type="checkbox"
              @change="
                onBlur($event, {
                  agenda: currentPartnerFolder.agenda,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.agenda.hasResource"
              v-model="currentPartnerFolder.agenda.hasResource"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              une ressource à louer (ex. perceuse pour chantier, marteau
              piqueur, véhicule d’hôtel, etc.) ?
            </b-form-checkbox>
          </label>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="my-3" v-if="currentPartnerFolder.agenda.hasServices">
      <b-col>
        <span class="form-description">Services</span>
      </b-col>
    </b-row>
    <b-row
      class="pages-container"
      id="agenda-service-tree"
      v-if="currentPartnerFolder.agenda.hasServices"
    >
      <b-col
        lg="6"
        md="12"
        sm="12"
        class="page-item mb-3"
        v-for="(agendaService, index) in agendaServicesTree"
        :key="index"
      >
        <b-col class="mb-2 __title p-0">
          <span class="__title">Service {{ index !== 0 ? index : null }}</span>
        </b-col>
        <i
          class="fas fa-trash"
          v-if="allowedToEdit"
          @click="onPageRemove(agendaService, index, 'agendaService')"
        ></i>
        <b-col class="mb-2 __description">
          <b-row class="team__input-separator __description__service_name">
            <b-col sm="12" md="3">
              <label class="team__label">*Nom du service :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__service_name-input">
              <ValidationProvider
                name="Nom du service"
                rules="min:3"
                :ref="`currentPartnerFolder.agenda.agendaServices.${index}.name`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="onBlur($event, { agendaService: agendaService })"
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaServices.${index}.name`"
                  v-model="agendaService.name"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__service">
            <b-col sm="12" md="3">
              <label class="team__label">Description :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__service-input">
              <ValidationProvider
                name="Description"
                rules="min:3"
                :ref="`currentPartnerFolder.agenda.agendaServices.${index}.description`"
                v-slot="{ classes, errors }"
              >
                <b-form-textarea
                  type="textarea"
                  @focus="onFocus"
                  @blur="onBlur($event, { agendaService: agendaService })"
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaServices.${index}.description`"
                  v-model="agendaService.description"
                ></b-form-textarea>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__service_price">
            <b-col sm="12" md="3">
              <label class="team__label">*Prix :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__service_price-input">
              <ValidationProvider
                name="Prix"
                :rules="{ regex: /^-?\d*([\.,]\d+)?$/ }"
                :ref="`currentPartnerFolder.agenda.agendaServices.${index}.price`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  step="any"
                  @focus="onFocus"
                  @blur="
                    onPriceBlur($event, {
                      agendaService: agendaService,
                      type: 'float',
                    })
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaServices.${index}.price`"
                  v-model="agendaService.price"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <DurationField
            field-label="Durée"
            entity-name="agendaService"
            duration-value-field="duration"
            duration-unit-field="durationUnit"
            v-bind:entity="agendaService"
            v-bind:refresh-duration-field-component="
              refreshDurationFieldComponent
            "
            v-bind:required="true"
            :key="`agenda-service-duration-${durationFieldComponent}-${index}`"
          />
          <DurationField
            field-label="Temps intercalé"
            entity-name="agendaService"
            duration-value-field="gapTime"
            duration-unit-field="gapTimeUnit"
            v-bind:entity="agendaService"
            v-bind:refresh-duration-field-component="
              refreshDurationFieldComponent
            "
            v-bind:required="false"
            :key="`agenda-service-gap-time-${durationFieldComponent}-${index}`"
          />
        </b-col>
      </b-col>
      <b-col
        lg="6"
        md="12"
        sm="12"
        class="page-item sample-page mb-3"
        v-if="allowedToEdit"
      >
        <b-col
          class="mb-2 __title px-0 py-2"
          @click="onPageAdd('agendaServices')"
          >&nbsp;</b-col
        >
        <b-col
          class="mb-2 __description p-0"
          @click="onPageAdd('agendaServices')"
        >
          <i class="fas fa-plus"></i>
        </b-col>
      </b-col>
    </b-row>
    <b-row v-if="currentPartnerFolder.agenda.hasServices">
      <b-col>
        <p class="agenda__informations">
          Temps intercalé = temps nécessaire pour pouvoir honorer un 2ème rdv :
          (exemple : désinfecter la pièce, préparer la pièce entre 2 soins etc…)
        </p>
      </b-col>
    </b-row>
    <b-row class="my-3" v-if="currentPartnerFolder.agenda.hasResource">
      <b-col>
        <span class="form-description">Ressources</span>
      </b-col>
    </b-row>
    <b-row
      class="pages-container"
      id="resource-tree"
      v-if="currentPartnerFolder.agenda.hasResource"
    >
      <b-col
        lg="6"
        md="12"
        sm="12"
        class="page-item mb-3"
        v-for="(agendaResource, index) in agendaResourcesTree"
        :key="index"
      >
        <b-col class="mb-2 __title p-0">
          <span class="__title"
            >Ressource {{ index !== 0 ? index : null }}</span
          >
        </b-col>
        <i
          class="fas fa-trash"
          v-if="allowedToEdit"
          @click="onPageRemove(agendaResource, index, 'agendaResource')"
        ></i>
        <b-col class="mb-2 __description">
          <b-row class="team__input-separator __description__resource_name">
            <b-col sm="12" md="3">
              <label class="team__label">Nom :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__resource_name-input">
              <ValidationProvider
                name="Nom"
                rules="min:3"
                :ref="`currentPartnerFolder.agenda.agendaResources.${index}.name`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="onBlur($event, { agendaResource: agendaResource })"
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaResources.${index}.name`"
                  v-model="agendaResource.name"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__resource">
            <b-col sm="12" md="3">
              <label class="team__label">Description :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__resource-input">
              <ValidationProvider
                name="Description"
                rules="min:3"
                :ref="`currentPartnerFolder.agenda.agendaResources.${index}.description`"
                v-slot="{ classes, errors }"
              >
                <b-form-textarea
                  type="textarea"
                  @focus="onFocus"
                  @blur="onBlur($event, { agendaResource: agendaResource })"
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaResources.${index}.description`"
                  v-model="agendaResource.description"
                ></b-form-textarea>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__resource_number">
            <b-col sm="12" md="3">
              <label class="team__label">Nombre :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__resource__number-input">
              <ValidationProvider
                name="Nombre"
                rules="integer"
                :ref="`currentPartnerFolder.agenda.agendaResources.${index}.quantity`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="
                    onBlur($event, {
                      agendaResource: agendaResource,
                      type: 'int',
                    })
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaResources.${index}.quantity`"
                  v-model="agendaResource.quantity"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__resource_price">
            <b-col sm="12" md="3">
              <label class="team__label">Prix :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__resource_price-input">
              <ValidationProvider
                name="Prix"
                :rules="{ regex: /^-?\d*([\.,]\d+)?$/ }"
                :ref="`currentPartnerFolder.agenda.agendaResources.${index}.price`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  step="any"
                  @focus="onFocus"
                  @blur="
                    onPriceBlur($event, {
                      agendaResource: agendaResource,
                      type: 'float',
                    })
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaResources.${index}.price`"
                  v-model="agendaResource.price"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <DurationField
            field-label="Durée"
            entity-name="agendaResource"
            duration-value-field="duration"
            duration-unit-field="durationUnit"
            v-bind:entity="agendaResource"
            v-bind:refresh-duration-field-component="
              refreshDurationFieldComponent
            "
            v-bind:required="true"
            :key="`agenda-resource-gap-time-${durationFieldComponent}-${index}`"
          />
        </b-col>
      </b-col>
      <b-col
        lg="6"
        md="12"
        sm="12"
        class="page-item sample-page mb-3"
        v-if="allowedToEdit"
      >
        <b-col
          class="mb-2 __title px-0 py-2"
          @click="onPageAdd('agendaResources')"
          >&nbsp;</b-col
        >
        <b-col
          class="mb-2 __description p-0"
          @click="onPageAdd('agendaResources')"
        >
          <i class="fas fa-plus"></i>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";

import {
  agendaRoleList as agendaRoleListData,
  agendaTimeTypeList as agendaTimeTypeListData,
} from "@/Interface/partnershipFolderDatas";
import DurationField from "@/components/PartnershipFolder/DurationField.vue";
import {useDP} from "@/mixins/useDP";
import { computed, onMounted, ref } from "vue";

const store = useStore();
const { allowedToEdit } = useDP();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
const warn = computed(() => store.state.alertStore.warn);

const agendaRoleList = ref(agendaRoleListData);
const agendaTimeTypeList = ref(agendaTimeTypeListData);
const previousEditedValue = ref(null);
const agendaServicesTree = ref([]);
const agendaResourcesTree = ref([]);
const durationFieldComponent = ref(0);

onMounted(() => {
  refreshDurationFieldComponent();
});

const updatePartnerPropertyFromForm = (data: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", data);
const deletePartnerPropertyFromForm = (data: any) =>
  store.dispatch("account/deletePartnerPropertyFromForm", data);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (
  event: { target: { name: string | number } },
  data: {
    agendaService: { id: any; agenda: any };
    agendaResource: { id: any; agenda: any };
  }
) => {
  const provider = event.target ? ref[event.target.name] : null;
  if (data.agendaService && !data.agendaService.id) {
    data.agendaService.agenda = currentPartnerFolder.value.agenda["@id"];
  }
  if (data.agendaResource && !data.agendaResource.id) {
    data.agendaResource.agenda = currentPartnerFolder.value.agenda["@id"];
  }
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  }).then(() => {
    refreshDurationFieldComponent();
  });
};
const onPriceBlur = (event: { target: { value: any } }, data: any) => {
  let price;

  if (event.target) {
    price = event.target.value;
  }

  if (price) {
    price.replace(",", ".");
  }

  onBlur(event, data);
};
const onPageAdd = (relationName: string) => {
  const relatedEntity = currentPartnerFolder.value.agenda[relationName];
  if (relatedEntity.length && !relatedEntity[relatedEntity.length - 1].id) {
    let message, title;
    if ("agendaResources" === relationName) {
      message =
        "Veuillez remplir la dernière ressource avant d'en ajouter une autre.";
      title = "Vous ne pouvez pas ajouter de ressource";
    } else {
      message =
        "Veuillez remplir le dernier service avant d'en ajouter un autre.";
      title = "Vous ne pouvez pas ajouter de service";
    }
    store.dispatch(
      "alert/warn",
      {
        group: "auth-error",
        message: message,
        show: true,
        title: title,
        type: "error",
        duration: 3000,
      },
      { root: true }
    );
    return;
  }
  currentPartnerFolder.value.agenda[relationName].push({
    agenda: currentPartnerFolder.value.agenda["@id"],
  });
  refreshDurationFieldComponent();
};
const onPageRemove = (
  entity: { id: any },
  index: any,
  entityName: string | number
) => {
  if (entity && entity.id) {
    const data = {};
    data[entityName] = entity;
    deletePartnerPropertyFromForm({ data }).then(() => {
      refreshDurationFieldComponent();
    });
  } else {
    currentPartnerFolder.value.agenda[`${entityName}s`].splice(index, 1);
    refreshDurationFieldComponent();
  }
};
const getFloatValues = (relationName: string) => {
  return currentPartnerFolder.value.agenda[relationName].map(
    (item: { price: string }) => {
      if (item.price) {
        item.price = `${item.price}`.replace(".", ",");
      }
      return item;
    }
  );
};
const refreshDurationFieldComponent = () => {
  agendaServicesTree.value = getFloatValues("agendaServices");
  agendaResourcesTree.value = getFloatValues("agendaResources");
  durationFieldComponent.value++;
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
@import "@/assets/style/Pfolder/page-details.scss";
</style>
