<template>
	<b-col lg="3" md="12" sm="12">
		<div role="tablist">
			<b-card no-body class="mb-1">

				<b-button
						block
						v-b-toggle.accordion-left
						variant="info"
						class="menu-left-title "
						:class="{ 'current-section': current_section }"
				>Mon compte partenaire
				</b-button>
				<b-collapse
						v-model="visible"
						id="accordion-left"

				>
					<b-card-body>
						<router-link to="/profil" class="card-text">
							Mes coordonnées de facturation
						</router-link>
						<hr/>
						<router-link to="/documents" class="card-text">
							Mes documents
						</router-link>
						<hr
								v-if="
                currentPartner &&
                currentPartner.hasPartnerFolder &&
                salesforce.dpValidated.canEdit
              "
						/>
						<router-link
								to="/dossier-partenaire"
								class="card-text"
								v-if="
                currentPartner &&
                currentPartner.hasPartnerFolder &&
                salesforce.dpValidated.canEdit
              "
						>
							<span> Mon dossier partenaire </span>
						</router-link>
					</b-card-body>
				</b-collapse>
			</b-card>
		</div>
	</b-col>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {BButton, BCard, BCardBody, BCollapse, BCol} from "bootstrap-vue-3";

const store = useStore();
const route = useRoute();
const visible = true;
onMounted(() => {
	read_current_menu();
});

const currentPartner = computed(() => store.state.account.currentPartner);
const salesforce = computed(() => store.state.globalStore.salesforce);

const current_section = ref(true);

const read_current_menu = () => {
	if (route.path.includes("profil")) {
		current_section.value = true;
	} else if (route.path.includes("documents")) {
		current_section.value = true;
	} else if (route.path.includes("demandes")) {
		current_section.value = true;
	} else if (route.path.includes("dossier-partenaire")) {
		current_section.value = true;
	}
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/authentification.scss";
</style>
