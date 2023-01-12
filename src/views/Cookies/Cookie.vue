<template>
	<div>
		<div v-if="!hide" class="cookie">
			<b-row class="justify-center">
				<b-col lg="4" md="5" sm="6" xs="12">
					<b-row>
						<h3 class="cookie-default-title">
							La protection de vos données personnelles est notre priorité
						</h3>
						<p>
							Nous utilisons des cookies pour vous proposer une expérience de
							navigation de qualité sur notre site Web.
						</p>
					</b-row>
				</b-col>
				<b-col lg="4" md="5" sm="6" xs="12">
					<b-row>
						<b-col>
							<button
								class="btn-cookie-action custom-accept-all mb-3 black"
								@click="denyOrAcceptAllCookies(true);hide = true;"
							>
								<img
									alt="Accepter tout les cookies"
									class="picto-checked"
									src="@/assets/cookies/check-mark.png"
								/>
								TOUT ACCEPTER
							</button>
						</b-col>
					</b-row>
					<b-row>
						<b-col md="6" sm="12">
							<button
								class="btn-cookie-action"
								@click="denyOrAcceptAllCookies(false);hide = true;"
							>
								TOUT REFUSER
							</button>
						</b-col>
						<b-col md="6" sm="12">
							<button class="btn-cookie-action" @click="displayModal">
								PERSONNALISER
							</button>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</div>
		<CookieModal/>
		<div
			v-if="null !== performance && null !== targeting"
			class="img-lock"
			:class="{
        'no-margin-bottom': 'BackOfficePartnershipFolder' === route.name,
      }"
			role="button"
			@click="displayModal"
		>
			<img alt="cookie-lock" src="@/assets/cookies/locked.png"/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import CookieModal from "@/components/Cookies/CookieModal.vue";
import useCookie from "@/mixins/useCookie";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const {performance, targeting, denyOrAcceptAllCookies} = useCookie();

const hide = ref(false);

const displayModal = () => {
	hide.value = true;
	$bvModal.show("cookie-modal");
};

onMounted(() => {
	console.log(performance);
	hide.value = null !== performance.value && null !== targeting.value;
	hide.value = true // TODO:  for now
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/cookie.scss";
</style>
