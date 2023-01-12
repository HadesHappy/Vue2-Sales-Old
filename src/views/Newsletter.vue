<template>
  <div class="messages">
    <app-headerbuttons></app-headerbuttons>
    <b-container fluid class="bv-example-row">
      <notifications
        group="success"
        position="bottom right"
        class="notification-container"
      />
      <notifications
        group="no-ticket"
        position="bottom right"
        class="notification-container"
      />
      <b-row>
        <app-menuformation
          class="hidden-for-mobile margin-menu"
        ></app-menuformation>
        <app-menumobile class="menu-mobile"></app-menumobile>
        <b-col lg="9" class="header-ticket">
          <!--  Modal to create a new subscription -->
          <modal name="modal-create-subscription" width="70%" height="560">
            <div class="create-subscription-modal">
              <h3>
                Ajouter un inscrit<span
                  ><img
                    class="button-close"
                    @click="closeModalCreateSubscription"
                    src="@/assets/close.png"
                /></span>
              </h3>
              <hr />
              <p>Prénom</p>
              <b-form-input
                v-model="newSubscription.firstName"
                type="text"
                required
                placeholder="Entrez un prénom"
              ></b-form-input
              ><br />
              <p>Nom</p>
              <b-form-input
                v-model="newSubscription.lastName"
                type="text"
                placeholder="Entrez un nom"
              ></b-form-input
              ><br />
              <p>
                Email*
                <span
                  v-if="!newSubscription.email"
                  class="error-for-subscription error-subscription"
                  >Champ obligatoire</span
                >
                <span
                  class="error-for-subscription error-subscription"
                  v-if="!isMailValid"
                >
                  Email invalide</span
                >
              </p>
              <b-form-input
                v-model="newSubscription.email"
                type="text"
                placeholder="Entrez un email"
              ></b-form-input
              ><br />
              <p>Téléphone</p>
              <b-form-input
                v-model="newSubscription.phone"
                type="text"
                placeholder="Entrez un numéro de téléphone"
              ></b-form-input>
              <br />
              <button
                @click="createSubscription()"
                class="subscription-btn"
                type="submit"
              >
                Ajouter
              </button>
            </div>
          </modal>
          <!-- End of Modal -->
          <!--  Modal to edit subscription -->
          <modal name="modal-edit-subscription" width="70%" height="580">
            <div class="create-subscription-modal">
              <h3>
                Modifier un inscrit
                <span
                  ><img
                    class="button-close"
                    @click="closeModalEditSubscription"
                    src="@/assets/close.png"
                /></span>
              </h3>
              <hr />
              <p>Prénom</p>
              <b-form-input
                v-model="newSubscription.firstName"
                type="text"
                required
                placeholder="Entrez un prénom"
              ></b-form-input
              ><br />
              <p>Nom</p>
              <b-form-input
                v-model="newSubscription.lastName"
                type="text"
                placeholder="Entrez un nom"
              ></b-form-input
              ><br />
              <p>
                Email*
                <span
                  v-if="!newSubscription.email"
                  class="error-for-subscription error-subscription"
                  >Champ obligatoire</span
                >
                <span
                  class="error-for-subscription error-subscription"
                  v-if="!isMailValid"
                >
                  Email invalide</span
                >
              </p>
              <b-form-input
                v-model="newSubscription.email"
                type="text"
                placeholder="Entrez un email"
              ></b-form-input
              ><br />
              <p>Téléphone</p>
              <b-form-input
                v-model="newSubscription.phone"
                type="text"
                placeholder="Entrez un numéro de téléphone"
              ></b-form-input>
              <br />
              <button
                @click="submitSubscription()"
                class="subscription-btn"
                type="submit"
              >
                Modifier
              </button>
            </div>
          </modal>
          <!-- End of Modal -->
          <b-col lg="12" class="subscription-list-container">
            <b-row>
              <b-col>
                <b-row>
                  <b-col>
                    <button
                      @click="openModalCreateSubscription"
                      class="subscription-btn add-subscription-btn"
                    >
                      Ajouter un inscrit
                    </button>
                  </b-col>
                  <b-col>
                    <b-form-select
                      v-if="myWebsitesNames.length > 1"
                      @change="getSubscriptions()"
                      v-model="currentWebsite"
                      :options="myWebsitesNames"
                      class="mb-3 site-selector"
                    ></b-form-select>
                  </b-col>
                  <b-col>
                    <button
                      @click="exportCsv"
                      class="subscription-btn export-btn"
                    >
                      Exporter en CSV
                    </button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <div class="hidden-for-mobile">
              <b-col>
                <b-row>
                  <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                    <b>Prénom</b>
                  </b-col>
                  <b-col class="cells top-line" lg="1" md="1" sm="2" cols="2">
                    <b>Nom</b>
                  </b-col>
                  <b-col
                    class="cells top-line mail-cell"
                    lg="3"
                    md="3"
                    sm="3"
                    cols="3"
                  >
                    <b>Email</b>
                  </b-col>
                  <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                    <b>Téléphone</b>
                  </b-col>
                  <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                    <b>Source</b>
                  </b-col>
                  <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                    <b>Action</b>
                  </b-col>
                </b-row>
              </b-col>
              <!-- desktop Version -->
              <p v-if="noSubscription" class="no-subscription">
                Vous n'avez aucun inscrit
              </p>
              <b-col
                v-for="subscription in allSubscriptions"
                :key="subscription.id"
              >
                <b-row class="line">
                  <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                    {{ subscription.firstName }}
                  </b-col>
                  <b-col lg="1" md="1" sm="1" cols="1" class="cells">
                    {{ subscription.lastName }}
                  </b-col>
                  <b-col lg="3" md="3" sm="3" cols="3" class="cells mail-cell">
                    {{ subscription.email }}
                  </b-col>
                  <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                    {{ subscription.phone }}
                  </b-col>
                  <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                    {{ subscription.source }}
                  </b-col>
                  <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                    <span
                      class="glyphicon glyphicon-pencil"
                      @click="editSubscription(subscription)"
                    ></span>
                    <img
                      @click="deleteSubscription(subscription)"
                      class="subscription-btn subscription-action-btn"
                      src="@/assets/delete.png"
                    />
                    <img
                      @click="editSubscription(subscription)"
                      class="subscription-btn subscription-action-btn"
                      src="@/assets/edit-pen.png"
                    />
                  </b-col>
                </b-row>
              </b-col>
            </div>
            <!-- End of desktop Version -->
            <!-- Mobile Version -->
            <div class="hidden-for-desktop">
              <b-col>
                <b-row>
                  <b-col
                    class="cells top-line mail-cell"
                    lg="7"
                    md="7"
                    sm="7"
                    cols="7"
                  >
                    <b>Email</b>
                  </b-col>
                  <b-col class="cells top-line" lg="5" md="5" sm="5" cols="5">
                    <b>Action</b>
                  </b-col>
                </b-row>
              </b-col>
              <b-col
                v-for="subscription in allSubscriptions"
                :key="subscription.id"
              >
                <b-row class="line">
                  <b-col lg="7" md="7" sm="7" cols="7" class="cells mail-cell">
                    {{ subscription.email }}
                  </b-col>
                  <b-col lg="5" md="5" sm="5" cols="5" class="cells">
                    <span
                      class="glyphicon glyphicon-pencil"
                      @click="editSubscription(subscription)"
                    ></span>
                    <img
                      @click="deleteSubscription(subscription)"
                      class="subscription-btn"
                      src="@/assets/delete.png"
                    />
                    <img
                      @click="editSubscription(subscription)"
                      class="subscription-btn"
                      src="@/assets/edit-pen.png"
                    />
                  </b-col>
                </b-row>
              </b-col>
            </div>
            <!-- End of Mobile Version -->
            <div
              v-if="messagesList.length <= 8"
              class="margin-subscription"
            ></div>
          </b-col>
        </b-col>
      </b-row>
    </b-container>
    <app-footer
      v-bind:class="{ 'footer-auth': messagesList.length <= 8 }"
    ></app-footer>
  </div>
</template>

<script lang="ts" setup>
import { webtoolService } from "@/services";
import { notify } from "@kyvg/vue3-notification";
import { onMounted, ref } from "vue";

onMounted(() => {
  getSubscriptions();
});

let messagesList = ref([]);
let nbrMsg = ref(0);
let isMailValid = ref(true);
let allSubscriptions = ref([]);
let newSubscription = ref({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
});
let myWebsitesNames = ref([]);
let myWebsitesList = ref([]);
let currentWebsite = ref(null);
let currentWebsiteSiteId = ref([]);
let noSubscription = ref(false);
let selectedWebsite = ref(null);

let openModalCreateSubscription = () => {
  newSubscription.value = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  };
  $modal.show("modal-create-subscription");
};
let openModalEditSubscription = () => {
  newSubscription.value = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  };
  $modal.show("modal-edit-subscription");
};
let closeModalCreateSubscription = () => {
  $modal.hide("modal-create-subscription");
};
let closeModalEditSubscription = () => {
  $modal.hide("modal-edit-subscription");
};
let getSubscriptions = () => {
  allSubscriptions.value = [];
  noSubscription.value = false;

  return webtoolService
    .getSubscriptions()
    .then((response) => {
      myWebsitesNames.value = [];
      myWebsitesList.value = response;

      for (let site in response) {
        myWebsitesNames.value.push(site);
      }

      if (null === currentWebsite.value) {
        currentWebsite.value = myWebsitesNames.value[0];
      }

      selectedWebsite = currentWebsite;

      let listUser = response[currentWebsite];
      if (listUser && listUser.length > 0) {
        allSubscriptions = listUser;
      } else {
        noSubscription = true;
      }
    })
    .catch((error) => {
      let self = this;
      setTimeout(() => {
        notify({
          group: "no-ticket",
          title: "Service indisponible",
          type: "error",
          duration: 6000,
          text: "Impossible d'accéder à la liste de vos inscrits.",
        });
      }, 1500);
      console.warn(error);
    });
};
let editSubscription = (subscription: any) => {
  openModalEditSubscription();
  if (null === subscription.firstName) {
    subscription.firstName = "";
  }
  if (null === subscription.lastName) {
    subscription.lastName = "";
  }
  if (null === subscription.phone) {
    subscription.phone = "";
  }
  if (null === subscription.email) {
    subscription.email = "";
  }
  newSubscription.value = {
    firstName: subscription.firstName,
    lastName: subscription.lastName,
    phone: subscription.phone,
    email: subscription.email,
    id: subscription.id,
  };
};
let submitSubscription = () => {
  if (!newSubscription.value.email) {
    return 0;
  } else {
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        newSubscription.email
      )
    ) {
      isMailValid = false;
      return;
    }

    let newSubscription = {
      id: newSubscription.id,
      firstName: newSubscription.firstName,
      lastName: newSubscription.lastName,
      email: newSubscription.email,
      phone: newSubscription.phone,
    };

    webtoolService
      .updateSubscription(newSubscription)
      .then(() => {
        let name = newSubscription.email;
        closeModalEditSubscription();
        return webtoolService
          .getSubscription(newSubscription.id)
          .then((response) => {
            newSubscription = response;
            getSubscriptions();
            notify({
              group: "success",
              title: "Modification effectuée",
              type: "success",
              duration: 6000,
              text: name + " a été modifié avec succès !",
            });
          })
          .catch((error) => {
            console.warn(error);
            notify({
              group: "no-ticket",
              title: "Erreur dans la modification",
              type: "error",
              duration: 6000,
              text: name + " n'a été trouvé !",
            });
          });
      })
      .catch((error) => {
        console.warn(error);
        notify({
          group: "no-ticket",
          title: "Un problème est survenu",
          type: "error",
          duration: 6000,
          text: "Erreur dans l'envoi des données",
        });
      });
  }
};
let deleteSubscription = (subscription: any) => {
  return webtoolService
    .deleteSubscription(subscription.id)
    .then((response) => {
      notify({
        group: "success",
        title: "Supprimé !",
        type: "warn",
        duration: 6000,
        text: response,
      });
      getSubscriptions();
    })
    .catch((error) => {
      console.warn(error);
    });
};
let createSubscription = () => {
  if (!newSubscription.value.email) {
    return 0;
  } else {
    let currentWebsite = selectedWebsite;

    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        newSubscription.email
      )
    ) {
      isMailValid = false;
      return;
    }
    let newSubscription = {
      firstName: newSubscription.firstName,
      lastName: newSubscription.lastName,
      email: newSubscription.email,
      phone: newSubscription.phone,
      domainName: currentWebsite,
    };

    return webtoolService
      .createSubscription(newSubscription)
      .then((response) => {
        notify({
          group: "success",
          title: "Inscription effectuée",
          type: "success",
          duration: 6000,
          text: response,
        });
        isMailValid = true;
        newSubscription = {};
        closeModalCreateSubscription();
        getSubscriptions();
      })
      .catch((error) => {
        console.warn(error);
        notify({
          group: "no-ticket",
          title: "Inscription impossible",
          type: "error",
          duration: 6000,
          text: "Une erreur est survenu lors de l'inscription",
        });
      });
  }
};
let exportCsv = () => {
  webtoolService.exportCsv(selectedWebsite).then((response) => {
    let url = window.URL.createObjectURL(new Blob([response]));
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "rapport.csv");
    document.body.appendChild(link);
    link.click();
  });
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/newsletter.scss";
</style>
