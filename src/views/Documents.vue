<template>
  <div class="documents">
    <app-headerbuttons></app-headerbuttons>
    <b-container fluid class="bv-example-row">
      <b-row>
        <notifications
          group="no-ticket"
          position="bottom right"
          class="notification-container"
        />
        <app-menuprofile class="hidden-for-mobile margin-profile" />
        <app-menumobile class="menu-mobile"></app-menumobile>
        <fade-loader
          v-if="status.isPageLoading || status.isSalesforceDocumentsLoading"
          class="loader-site hidden-for-mobile"
          :color="color"
        ></fade-loader>
        <b-col
          lg="9"
          md="12"
          sm="12"
          v-if="!status.isPageLoading && !status.isSalesforceDocumentsLoading"
        >
          <hr />
          <b-row>
            <b-col
              offset-lg="8"
              lg="4"
              offset-md="6"
              md="6"
              offset-sm="6"
              sm="6"
            >
              <app-customerRef></app-customerRef>
            </b-col>
          </b-row>
          <b-row class="contracts-field">
            <b-col lg="8" md="12" sm="12" xs="12" cols="12">
              <b-row>
                <b-col lg="12">
                  <h2><strong>Contrats</strong></h2>
                </b-col>
                <b-col class="contracts">
                  <p v-if="0 === contracts.length">Pas de contrat</p>
                </b-col>
                <b-col
                  class="contracts"
                  v-for="(value, key) in contracts"
                  :key="key"
                  lg="12"
                  md="12"
                  sm="12"
                  xs="12"
                >
                  <b-row>
                    <b-col lg="6" md="6" sm="6" cols="6">
                      {{ contracts[key].type }} du {{ contracts[key].date }}
                    </b-col>
                    <b-col lg="6" md="6" sm="6" cols="6">
                      <a target="_blank" @click="downloadFile(contracts[key])">
                        <button class="black-button">T??l??charger</button>
                      </a>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
            <b-col lg="8" md="12" sm="12" xs="12" cols="12">
              <b-row>
                <b-col lg="12">
                  <h2><strong>Factures</strong></h2>
                </b-col>
                <b-col class="contracts">
                  <p v-if="0 === bills.length">Pas de facture</p>
                </b-col>
                <b-col
                  class="contracts"
                  v-for="(value, key) in bills"
                  :key="key"
                  lg="12"
                  md="12"
                  sm="12"
                  xs="12"
                >
                  <b-row>
                    <b-col lg="6" md="6" sm="6" cols="6">
                      {{ bills[key].type }} du {{ bills[key].date }}
                    </b-col>
                    <b-col lg="6" md="6" sm="6" cols="6">
                      <a target="_blank" @click="downloadFile(bills[key])">
                        <button class="black-button">T??l??charger</button>
                      </a>
                    </b-col>
                  </b-row>
                </b-col>
                <!-- <b-col class="contracts" v-for="(value, key) in allFacturesFile" :key="key" lg="12" md="12" sm="12" xs="12">
                                    <b-row>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            Facture du {{ allFacturesFile[key].date }}
                                        </b-col>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            <a target="_blank" @click="downloadFileFromContentDoc(allFacturesFile[key])">
                                                <button class="black-button">T??l??charger</button>
                                            </a>
                                        </b-col>
                                    </b-row>
                                </b-col> -->
              </b-row>
            </b-col>
            <b-col lg="8" md="12" sm="12" xs="12" cols="12">
              <b-row>
                <b-col lg="12">
                  <h2><strong>SEPA / RIB</strong></h2>
                </b-col>
                <b-col class="contracts" lg="12" md="12" sm="12">
                  <p
                    v-if="0 === sepas.length || 0 === ribs.length"
                    class="error"
                  >
                    Certaines informations sont manquantes. Merci de compl??ter
                    votre SEPA/RIB. Vous pouvez nous les envoyer par courrier
                    avec l'enveloppe qui vous a ??t?? fournie ou par mail ??
                    <a href="mailto:adv@local.fr">adv@local.fr</a>
                  </p>
                  <b-row>
                    <b-col
                      v-if="sepas.length > 0"
                      lg="6"
                      md="6"
                      sm="6"
                      cols="6"
                    >
                      Mon mandat SEPA
                    </b-col>
                    <b-col
                      v-if="sepas.length > 0"
                      lg="6"
                      md="6"
                      sm="6"
                      cols="6"
                      class="contracts"
                    >
                      <a
                        target="_blank"
                        @click="downloadFile(sepas[sepas.length - 1])"
                      >
                        <button class="black-button">T??l??charger</button>
                      </a>
                    </b-col>
                    <b-col lg="6" md="6" sm="6" xs="6"> Mon IBAN </b-col>
                    <b-col lg="6" md="6" sm="6" xs="6">
                      <a @click="toggleRib()" v-if="partner.hasRib">
                        <button
                          v-if="!showRib"
                          class="black-button"
                          v-bind:disabled="status.isRibLoading"
                        >
                          Consulter
                        </button>
                        <button
                          v-if="showRib"
                          class="black-button"
                          v-bind:disabled="status.isRibLoading"
                        >
                          Masquer
                        </button>
                      </a>
                      <a
                        v-if="ribs.length > 0"
                        target="_blank"
                        @click="downloadFile(ribs[ribs.length - 1])"
                      >
                        <button class="yellow-button">Voir le document</button>
                      </a>
                    </b-col>
                    <b-col class="marge"> </b-col>
                    <b-col lg="6" v-if="showRib">
                      <fade-loader
                        v-if="status.isRibLoading"
                        class="loader-site hidden-for-mobile"
                        :color="color"
                      ></fade-loader>
                      <div v-if="!status.isRibLoading" class="print-rib">
                        <p class="rib-title center">
                          IBAN - utilisation internationale
                        </p>
                        <b-row>
                          <b-col lg="9" offset-lg="1" class="sepa-nbr">
                            <span>{{ iban.substr(0, 4) }}</span>
                            <span>{{ iban.substr(4, 5) }}</span>
                            <span>{{ iban.substr(9, 5) }}</span>
                            <span>{{ iban.substr(14, 11) }}</span>
                            <span>{{ iban.substr(25, 2) }}</span>
                            <span></span>
                          </b-col>
                        </b-row>
                        <p class="rib-title sepa-nbr">
                          Bank Identification Code : {{ bic }}<br />
                          <span>Banque: {{ bankName }}</span>
                        </p>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <app-footer v-if="nbrFacture > 2"></app-footer>
    <app-footer v-if="nbrFacture < 3" class="footer-auth"></app-footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import { salesforceService } from "@/services";

const store = useStore();

const totalFilesNbr = ref(null);
const showRib = ref(false);
const nbrFacture = ref(0);
const nbrContract = ref(null);
const nbrSepa = ref(null);
const iban = ref("");
const bic = ref("");
const bankName = ref("");
const color = ref("#ec008c");

const status = computed(() => store.state.globalStore.status);
const salesforce = computed(() => store.state.globalStore.salesforce);
const documents = computed(() => store.state.globalStore.documents);
const partner = computed(() => store.state.globalStore.partner);

const bills = computed(() => {
  return documents.value.filter(
    (document: { type: string }) => "Facture / Avoir" === document.type
  );
});
const contracts = computed(() => {
  return documents.value.filter((document: { type: string }) =>
    /^Contrat( DocuSign)?$/.test(document.type)
  );
});
const ribs = computed(() => {
  return documents.value.filter(
    (document: { type: string }) => "RIB" === document.type
  );
});
const sepas = computed(() => {
  return documents.value.filter(
    (document: { type: string }) => "SEPA" === document.type
  );
});

onMounted(() => {
  new Promise((resolve) => {
    if (salesforce.value.account.Id) {
      resolve();
    }
  }).then(() => {
    getSalesforceDocuments({ accountId: salesforce.value.account.Id });
    getRib({ accountId: salesforce.value.account.Id });
  });
});

const getSalesforceDocuments = (account: any) =>
  store.dispatch("globalStore/getRib", account);
const getRib = (account: any) =>
  store.dispatch("globalStore/getSalesforceDocuments", account);

const downloadFile = (file: any) => {
  salesforceService.downloadFile(file).then(
    (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.documentName);
      document.body.appendChild(link);
      link.click();
    },
    (error) => {
      console.error(error.response.data);
    }
  );
};
const toggleRib = async () => {
  if (showRib.value) {
    iban.value = "";
    bic.value = "";
    bankName.value = "";
    showRib.value = false;
  } else {
    showRib.value = true;
    const rib = await getRib({
      accountId: salesforce.value.account.Id,
    });
    iban.value = rib.IBAN__c;
    bic.value = rib.Code_BIC__c;
    bankName.value = rib.Banque__c;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/documents.scss";
</style>
