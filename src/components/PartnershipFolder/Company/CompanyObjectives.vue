<template>
  <b-container fluid  v-if="currentPartnerFolder">
    <!-- your objectives -->
    <b-row class="my-3">
      <b-col lg="12">
        <ValidationProvider
          name="Vision de l'entreprise"
          rules="min:3"
          ref="currentPartnerFolder.businessViews"
        >
          <label class="label">Vision de l'entreprise dans 4/5 ans</label>
          <b-form-textarea
            type="textarea"
            :class="classes"
            @focus="onFocus"
            @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
            rows="3"
            name="currentPartnerFolder.businessViews"
            v-model="currentPartnerFolder.businessViews"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-textarea>
          <small :class="classes"></small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col>
        <ValidationProvider
          name="Développement de l'entreprise"
          rules="min:3"
          ref="currentPartnerFolder.businessDevelopment"
        >
          <label class="label">Développement de l'entreprise</label>
          <b-form-textarea
            type="textarea"
            :class="classes"
            @focus="onFocus"
            @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
            rows="5"
            name="currentPartnerFolder.businessDevelopment"
            v-model="currentPartnerFolder.businessDevelopment"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-textarea>
          <small :class="classes"></small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col>
        <ValidationProvider
          name="Calcul marge"
          rules="numeric"
          ref="currentPartnerFolder.progressCheck"
          v-slot="{ classes, errors }"
        >
          <label class="label">Calcul marge de progression</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerFolder: currentPartnerFolder,
                type: 'int',
              })
            "
            type="text"
            :class="classes"
            name="currentPartnerFolder.progressCheck"
            v-model="currentPartnerFolder.progressCheck"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes"></small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <div>
      <b-row class="my-3">
        <b-col lg="4" md="5" sm="7">
          <span class="mr-3">Capacité à gérer plus de clients</span>
        </b-col>
        <b-col lg="1" md="2" sm="2">
          <ValidationProvider
            name="Manager plus de clientèle"
            :rules="{ required: false }"
            ref="currentPartnerFolder.manageMoreCustomers"
          >
            <b-form-radio
              type="radio"
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.manageMoreCustomers"
              v-model="currentPartnerFolder.manageMoreCustomers"
              :value="true"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              Oui
            </b-form-radio>
            <small :class="classes"></small>
          </ValidationProvider>
        </b-col>
        <b-col lg="1" md="2" sm="2">
          <ValidationProvider
            name="Manager plus de clientèle"
            :rules="{ required: false }"
            ref="currentPartnerFolder.manageMoreCustomers"
          >
            <b-form-radio
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.manageMoreCustomers"
              v-model="currentPartnerFolder.manageMoreCustomers"
              :value="false"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              Non
            </b-form-radio>
            <small :class="classes"></small>
          </ValidationProvider>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts" setup>
import {useDP} from "@/mixins/useDP";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const { allowedToEdit } = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(() => store.state.account.currentPartnerFolder);

const previousEditedValue = ref(null);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: any) => {
  const provider = ref[event.target.name];
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
