<template>
  <b-container fluid class="modal-report-container">
    <b-modal
      id="modal-report"
      :adaptative="true"
      size="lg"
      centered
      :title="
        status.reportHasBeenSent ? 'Erreur signalée' : 'Signaler une erreur'
      "
      no-close-on-esc
      no-close-on-backdrop
    >
      <fade-loader
        color="#ec008c"
        class="ticket-spinner"
        v-if="isSendingReport"
      ></fade-loader>
      <b-row>
        <b-col class="mb-3">
          <label class="label text-medium">
            {{
              status.reportHasBeenSent
                ? "Types d'erreurs signalés"
                : "Sélectionner le type d'erreur à signaler"
            }}
          </label>
          <ValidationProvider
            name="Type d'erreur"
            rules="required"
            ref="salesforce.opportunity.Signalement__c"
            v-slot="{ validate, classes, errors }"
          >
            <b-form-checkbox-group
              v-model="Signalement__c"
              @change="onChange"
              :options="availableSignalementTypes"
              name="salesforce.opportunity.Signalement__c"
              stacked
              :disabled="isSendingReport"
              :readonly="isSendingReport"
            ></b-form-checkbox-group>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="label text-medium">Commentaires</label>
          <ValidationProvider
            name="Commentaires"
            rules="required"
            ref="salesforce.opportunity.Signalement_Commentaire__c"
            v-slot="{ validate, classes, errors }"
          >
            <b-form-textarea
              @focus="onFocus"
              @keypress="onChange"
              v-model="salesforce.opportunity.Signalement_Commentaire__c"
              name="salesforce.opportunity.Signalement_Commentaire__c"
              id="textarea"
              rows="3"
              :class="classes"
              :disabled="isSendingReport"
              :readonly="isSendingReport"
            >
            </b-form-textarea>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-col>
      </b-row>
      <template #modal-footer>
        <b-row>
          <b-col>
            <b-button
              class="send-report mt-2"
              :class="{ disabled: !formValid || isSendingReport }"
              :disabled="!formValid || isSendingReport"
              @click="sendReport($event)"
            >
              {{
                status.reportHasBeenSent
                  ? "Mettre à jour"
                  : "Envoyer le signalement"
              }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";

import { salesforceService } from "@/services";

let store = useStore();

let salesforce = computed(() => store.state.globalStore.salesforce);
let status = computed(() => store.state.globalStore.status);

let Signalement__c = computed({
  get() {
    return salesforce.value.opportunity.Signalement__c
      ? salesforce.value.opportunity.Signalement__c.split(";")
      : [];
  },
  set(val) {
    salesforce.value.opportunity.Signalement__c = (val || []).join(";");
  },
});

let availableSignalementTypes = ref([]);
let formValid = ref(false);
let isSendingReport = ref(false);
let previousEditedValue = ref(null);

onMounted(async () => {
  availableSignalementTypes.value = (
    await salesforceService.getSignalementTypes()
  ).map((value: any) => {
    return { text: value, value: value };
  });
  formValid =
    null !== Signalement__c.value &&
    null !== salesforce.value.opportunity.Signalement_Commentaire__c;
});

let updatePartnerPropertyFromForm = (valu: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", valu);

let onFocus = (event: { target: { value: any } }) => {
  previousEditedValue.value = event.target.value;
};
let onChange = () => {
  formValid =
    Signalement__c.value.length &&
    salesforce.value.opportunity.Signalement_Commentaire__c &&
    salesforce.value.opportunity.Signalement_Commentaire__c.length;
};
let sendReport = ($event: { preventDefault: () => void }) => {
  $event.preventDefault();
  if (!formValid.value) {
    store.dispatch(
      "alert/error",
      {
        group: "auth-error",
        message: "Le formulaire n'est pas valide",
        show: true,
        title: "Erreur dans le formulaire",
        type: "error",
      },
      { root: true }
    );
    cancel();
  }

  let data = {
    payload: {
      Signalement__c: salesforce.value.opportunity.Signalement__c,
      Signalement_Commentaire__c:
        salesforce.value.opportunity.Signalement_Commentaire__c,
    },
    opportunity: salesforce.value.opportunity,
  };

  updatePartnerPropertyFromForm({ data }).then(() => {
    isSendingReport = false;
    $bvModal.hide("modal-report");
    store.dispatch("globalStore/setReportHasBeenSent", true);
  });
};
let cancel = () => {
  isSendingReport = false;
  $bvModal.hide("modal-report");
};
</script>
