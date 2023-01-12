<template>
  <div class="demandes" @click="close_menu">
    <header-buttons />
    <b-container fluid class="bv-example-row">
      <notifications
        group="no-tickets"
        position="bottom right"
        class="notification-container"
      />
      <b-col lg="12" md="12" sm="12" class="header-ticket">
        <b-row>
          <menu-profile
            class="menu-asks hidden-for-mobile"
          ></menu-profile>
          <menu-profile class="menu-mobile"></menu-profile>
          <b-col lg="9" md="12" sm="12" class="tickets-button">
            <b-row>
              <b-col md="1" sm="12">
                <b-link href="/demandes/creer">
                  <div class="create_ticket_button">Créer une demande</div>
                </b-link>
              </b-col>
              <b-col offset-md="1" md="10" sm="12">
                <b-row>
                  <b-col
                    md="2"
                    sm="6"
                    class="sort-tickets-new hidden-for-mobile"
                  >
                    <b-link @click="displayNewTickets()">
                      <div class="sort-tickets-text">Nouveau</div>
                    </b-link>
                  </b-col>
                  <b-col
                    md="2"
                    sm="6"
                    class="sort-tickets-opened hidden-for-mobile"
                  >
                    <b-link @click="displayOpenedTickets()">
                      <div class="sort-tickets-text">Ouvert</div>
                    </b-link>
                  </b-col>
                  <b-col
                    md="2"
                    sm="6"
                    class="sort-tickets-pending hidden-for-mobile"
                  >
                    <b-link @click="displayPendingTickets()">
                      <div class="sort-tickets-text">En attente retour</div>
                    </b-link>
                  </b-col>
                  <b-col
                    md="2"
                    sm="6"
                    class="sort-tickets-done hidden-for-mobile"
                  >
                    <b-link @click="displayDoneTickets()">
                      <div class="sort-tickets-text">Terminé</div>
                    </b-link>
                  </b-col>
                  <b-col
                    md="2"
                    sm="6"
                    class="sort-tickets-closed hidden-for-mobile"
                  >
                    <b-link @click="displayClosedTickets()">
                      <div class="sort-tickets-text">Fermé</div>
                    </b-link>
                  </b-col>
                  <b-col
                    md="2"
                    sm="6"
                    class="sort-tickets-all hidden-for-mobile"
                  >
                    <b-link @click="displayAllTickets()">
                      <div class="sort-tickets-text-black">Tous</div>
                    </b-link>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <fade-loader
                v-if="
                  status.isSalesforceTicketsLoading ||
                  status.isSalesforceTicketThreadLoading
                "
                class="loader-demandes hidden-for-mobile"
                :color="color"
              ></fade-loader>
            </b-row>
            <b-row>
              <b-col
                sm="12"
                class="ticket-container"
                v-if="
                  commentsInterface &&
                  !status.isSalesforceTicketsLoading &&
                  !status.isSalesforceTicketThreadLoading
                "
              >
                <b-row @click="commentsInterface = false">
                  <b-col>
                    <img src="@/assets/left-arrow.png" class="left-arrow" />
                    <b class="left-arrow">Retour</b>
                  </b-col>
                </b-row>
                <b-row class="ticket-style tickets-subject">
                  <b-col
                    >Sujet : {{ formatTicketName(currentTicket.subject) }} |
                    {{ currentTicket.createdDate }}</b-col
                  >
                </b-row>
                <b-row>
                  <b-col v-html="currentTicket.description"></b-col>
                </b-row>
                <b-row class="ticket-style">
                  <b-col
                    v-for="(attachment, index) in currentTicket.attachments"
                    cols="12"
                    :key="`attachment-${index}`"
                  >
                    <a :href="attachment.href" target="_blank">
                      <img
                        src="@/assets/attachment.png"
                        :alt="attachment.text"
                        class="ticket-attachment"
                      />
                      {{ attachment.text }}
                    </a>
                  </b-col>
                </b-row>
              </b-col>
              <b-col
                sm="12"
                class="ticket-container"
                v-if="
                  !commentsInterface &&
                  !status.isSalesforceTicketsLoading &&
                  !status.isSalesforceTicketThreadLoading
                "
              >
                <div
                  @click="load_salesforce_thread(ticket)"
                  v-for="(ticket, index) in displayedTickets"
                  :key="index"
                  class="ticket-style main-subject"
                >
                  <b-row>
                    <b-col lg="9" sm="7" cols="12" class="tickets-subject">
                      Sujet : {{ formatTicketName(ticket.subject) }}
                      <span class="ticket-date">{{
                        ticket.createdDate ? `(${ticket.createdDate})` : ""
                      }}</span>
                    </b-col>
                    <b-col lg="3" sm="5" cols="12" class="tickets-status">
                      <span
                        v-bind:style="{ color: getStatusColor(ticket.status) }"
                        >{{ getStatusLabel(ticket.status) }}</span
                      >
                    </b-col>
                  </b-row>
                  <b-row
                    v-if="ticket.description"
                    class="mx-3"
                    v-html="ticket.description"
                  ></b-row>
                </div>
                <div
                  v-if="!displayedTickets.length"
                  class="ticket-style main-subject"
                >
                  Aucun ticket à afficher.
                </div>
              </b-col>
            </b-row>
            <div v-if="displayedTickets.length <= 9" class="margin"></div>
          </b-col>
        </b-row>
      </b-col>
    </b-container>
    <footer
      class="footer-auth"
      v-if="
        displayedTickets.length <= 5 &&
        !commentsInterface &&
        !status.isSalesforceTicketsLoading &&
        !status.isSalesforceTicketThreadLoading
      "
    ></footer>
    <footer
      v-if="
        (displayedTickets.length > 5 || commentsInterface) &&
        !status.isSalesforceTicketsLoading &&
        !status.isSalesforceTicketThreadLoading
      "
    ></footer>
  </div>
</template>

<script lang="ts" setup>
import MenuMobile from "@/components/MenuMobile.vue";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import type { Ref } from "vue";
import MenuProfile from "@/components/MenuProfile.vue";
import {BCol, BRow, BContainer, BLink} from "bootstrap-vue-3";
import HeaderButtons from "@/components/HeaderButtons.vue";

const store = useStore();

const identity = computed(() => store.state.account.identity);
const currentPartner = computed(() => store.state.account.currentPartner);
const status = computed(() => store.state.globalStore.status);
const salesforceTickets = computed(() => store.state.globalStore.salesforceTickets);

const displayedTickets = ref([]);
const color = ref("#ec008c");
const commentsInterface = ref(false);
const currentTicket = ref({});
const currentUserId = ref("");
const ticketStatus: Ref<{
  Nouveau: {
    labels: string[];
    color: string;
  };
  Ouvert: {
    labels: string[];
    color: string;
  };
  "En attente retour": {
    labels: string[];
    color: string;
  };
  Terminé: {
    labels: string[];
    color: string;
  };
  Fermé: {
    labels: string[];
    color: string;
  };
}> = ref({
  Nouveau: {
    labels: ["Nouveau"],
    color: "#007bff",
  },
  Ouvert: {
    labels: ["Ouvert", "En pause", "Escalade"],
    color: "#faa61a",
  },
  "En attente retour": {
    labels: ["En attente", "Réponse Client"],
    color: "#ec008c",
  },
  Terminé: {
    labels: ["Résolu"],
    color: "#00cc99",
  },
  Fermé: {
    labels: ["Fermé"],
    color: "#009933",
  },
});

onMounted(() => {
  const base_url = `/#/demandes/attachment/`;
  const regex = new RegExp(`${base_url}`);
	console.log('mounted');
  getTickets({ accountId: currentPartner.value.company }).then(
    (result: any[]) => {

      result.map((ticket) => {
				console.log(ticket);
        ticket.rawDescription = ticket.description;
        const descriptionWithoutAttachment: any[] = [],
          attachments: any[] = [],
          description = ticket.description
            ? ticket.description.split("\n")
            : [];
        description.forEach((line: any) => {
          if (regex.test(line)) {
            const filepath = line.split("/");
            attachments.push({
              href: line,
              text: filepath[filepath.length - 1],
            });
          } else {
            descriptionWithoutAttachment.push(line);
          }
        });
        ticket.attachments = attachments;
        ticket.description = descriptionWithoutAttachment.join("<br />");

      });
    	displayedTickets.value = result;

    }
  );
});

const getTickets = (data: object) => {
  return store.dispatch("globalStore/getTickets", data);
};

const close_menu = () => {
	if (document.getElementById("mySidenav")) {
		document.getElementById("mySidenav").style.width = "0";
	}
};
const load_salesforce_thread = (ticketPassed) => {
  commentsInterface.value = true;
  currentTicket.value = ticketPassed;
};
const displayNewTickets = () => {
  displayedTickets.value = getTicketsByLabel("Nouveau");
};
const displayOpenedTickets = () => {
  displayedTickets.value = getTicketsByLabel("Ouvert");
};
const displayPendingTickets = () => {
  displayedTickets.value = getTicketsByLabel("En attente retour");
};
const displayDoneTickets = () => {
  displayedTickets.value = getTicketsByLabel("Terminé");
};
const displayClosedTickets = () => {
  displayedTickets.value = getTicketsByLabel("Fermé");
};
const displayAllTickets = () => {
  displayedTickets.value = salesforceTickets.value;
};
const getTicketsByLabel = (statusLabel: string) => {
  return salesforceTickets.value.filter(
    (ticket: any) =>
      -1 !== ticketStatus[statusLabel].labels.indexOf(ticket.status)
  );
};
const getStatusLabel = (label: string) => {
  let found;
  for (const key in ticketStatus) {
    found = ticketStatus[key]?.labels?.find((item: string) => item === label);
    if (found) {
      return key;
    }
  }
};
const getStatusColor = (label: string) => {
  let found;
  for (const key in ticketStatus) {
    found = ticketStatus[key]?.labels?.find((item: any) => item === label);
    if (found) {
      return ticketStatus[key].color;
    }
  }
};
const formatTicketName = (name: string) => {
	if(!name){
		return ;
	}
  return currentPartner.value.customerCode
    ? name.replace(
        new RegExp(`^${currentPartner.value.customerCode} (- )?`),
        ""
      )
    : name;
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/ticket.scss";
</style>
