<template>
  <div class="messages">
    <app-headerbuttons></app-headerbuttons>
    <b-container fluid class="bv-example-row">
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
        <b-col lg="9" class="messages-section">
          <b-form-select
            v-if="myWebsitesNames.length > 1"
            :disabled="pageLoading"
            @change="getMessagesList()"
            v-model="currentWebsite"
            :options="myWebsitesNames"
            class="mb-3 site-selector"
          ></b-form-select>
          <fade-loader
            v-if="pageLoading"
            class="loader-site hidden-for-mobile"
            :color="color"
          ></fade-loader>
          <div
            v-if="!pageLoading"
            v-for="message in messagesList"
            class="message-container"
            :key="message.id"
          >
            <b-row>
              <b-col lg="8" md="8" sm="12" class="tickets-subject"
                >Message de
                {{ message.content ? message.content["Email"] + " - " : ""
                }}{{ usToFrDate(message.createdAt.date) }}
                <img
                  v-if="message.nbAttachments == 1"
                  class="logo-attachment"
                  src="@/assets/attachment.png"
                  v-b-tooltip.hover
                  v-bind:title="message.nbAttachments + ' pièce jointe'"
                />
                <img
                  v-if="message.nbAttachments > 1"
                  class="logo-attachment"
                  src="@/assets/attachment.png"
                  v-b-tooltip.hover
                  v-bind:title="message.nbAttachments + ' pièces jointes'"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col
                cols="12"
                v-for="(index, content) in message.content"
                :key="content"
                v-if="message.content[content]"
              >
                <b>{{ content }}</b> :
                <read-more
                  v-if="message.content[content].length > 200"
                  class=""
                  more-str="Voir plus"
                  :text="message.content[content]"
                  less-str="Masquer"
                  :max-chars="280"
                ></read-more>
                <p v-else>{{ message.content[content] }}</p>
              </b-col>
              <b-col cols="12" v-if="message.nbAttachments > 0">
                <div class="attachment-title">
                  <strong>Pièces jointes :</strong>
                </div>
                <a
                  v-for="attachment in message.attachments"
                  :key="attachment.id"
                  class="attachment"
                  :href="attachment.href"
                  >{{ attachment.label }}</a
                >
              </b-col>
            </b-row>
          </div>
          <div v-if="messagesList.length < 4" class="margin-msg"></div>
        </b-col>
      </b-row>
    </b-container>
    <app-footer
      v-bind:class="{ 'footer-auth': messagesList.length < 4 }"
    ></app-footer>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { dateHelpers } from "@/helpers";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import { computed, onMounted, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";

let store = useStore();

let websiteLink = computed(() => store.state.globalStore.websiteLink);
let user = computed(() => store.state.account.user);

let messagesList = ref([]);
let nbrMsg = ref(0);
let myWebsitesNames = ref([]);
let currentWebsite = ref(null);
let messages = ref([]);
let cnt = ref(null);
let pageLoading = ref(true);
let color = ref("#ec008c");

onMounted(() => {
  new Promise((resolve) => {
    let interval = setInterval(() => {
      if (!websiteLink.value) {
        return;
      }
      window.clearInterval(interval);
      resolve(getMessagesList());
    }, 50);
  });
});

let getContactMessages = () =>
  store.dispatch("globalStore/getContactMessages");

let usToFrDate = (messageDate: any) => {
  return dateHelpers.usToFrDate(messageDate);
};

let getMessagesList = () => {
  pageLoading.value = true;
  return getContactMessages()
    .then((response) => {
      let siteNames = Object.keys(response);
      if (0 === siteNames.length) {
        pageLoading.value = false;
        notify({
          group: "no-ticket",
          title: "Pas de message",
          type: "warn",
          duration: 6000,
          text: "Vous n'avez aucun message.",
        });
        return 0;
      }
      let currentWebsite = websiteLink.value
        .replace(/https?:\/\//, "")
        .replace("/", "");
      messagesList.value = [];
      myWebsitesNames.value = [];
      for (let site in response) {
        myWebsitesNames.value.push(site);
      }
      if (!currentWebsite) {
        currentWebsite = currentWebsite || myWebsitesNames.value[0];
      }
      messagesList.value = response[currentWebsite];
      if (messagesList.value.length > 0) {
        messagesList.value.forEach((message) => {
          let attachments = message.attachments;

          message.nbAttachments = attachments.length;
          if (!message.nbAttachments) {
            return;
          }

          attachments.forEach((attachment) => {
            attachment.href =
              import.meta.env.VUE_WEBTOOL_BASE_URL +
              "/oauth/messages/" +
              message.id +
              "/attachments/" +
              attachment.filename +
              "?bearer=" +
              user.value.access_token;
          });
        });
      } else {
        notify({
          group: "no-ticket",
          title: "Pas de message",
          type: "warn",
          duration: 6000,
          text: "Vous n'avez aucun message.",
        });
      }

      return messagesList;
    })
    .finally(() => (pageLoading.value = false));
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/messages.scss";
</style>
