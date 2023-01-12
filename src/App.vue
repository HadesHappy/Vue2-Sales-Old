<template>
	<div id="app">
		<div
			:class="{ 'blur-content': null === performance && null === targeting }"
		>
			<LogoutModal v-if="isShowLogoutModal">{{ refreshTtl }}</LogoutModal>
			<router-view></router-view>
		</div>
		<Cookie />
	</div>
</template>

<script lang="ts" setup>
import LogoutModal from "@/components/LogoutModal.vue";
import Cookie from "@/views/Cookies/Cookie.vue";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import useCookie from "./mixins/useCookie";
import { useRoute } from "vue-router";
import { notify } from "@kyvg/vue3-notification";

const store = useStore();
const route = useRoute();

const { performance, targeting } = useCookie();

const refreshTtl = ref(null);

const targetingCookie = computed(
	() => store.state.account.status.targetingCookie
);

const showAlert = computed(() => store.state.alert.show);
const isLoggedIn = computed(() => store.state.account.status.loggedIn);
const refreshTokenTtl = computed(() => store.state.account.status.logoutModal.refreshTokenTtl);
const isShowLogoutModal = computed(
	() => store.state.account.status.logoutModal.isShowLogoutModal
);
const isRefreshToken = computed(
	() => store.state.account.status.logoutModal.refreshTokenTtlState
);

const clearAlert = () => store.dispatch("alert/clear");
const setIsShowLogoutModal = (value: boolean) =>
	store.dispatch("account/setIsShowLogoutModal", value);
const refreshTokenUpdated = () => store.dispatch("account/refreshTokenUpdated");
const logout = () => store.dispatch("account/logout");

const disableNotify = () => store.commit("alert/disableNotify");

const logoutAndClearInterval = () => {
	window.timeout && clearInterval(window.timeout);
	logout();
	setIsShowLogoutModal(false);
};
const startInterval = () => {
	window.timeout && clearInterval(window.timeout);
	window.timeout = setInterval(() => {
		if (isRefreshToken.value) {
			refreshTtl.value = refreshTokenTtl;
			refreshTokenUpdated(false);
			return;
		}

		if (refreshTtl.value) {
			refreshTtl.value--;
		}

		if (refreshTtl.value && refreshTtl.value <= 60) {
			setIsShowLogoutModal(true);
			return;
		}

		if (!isLoggedIn.value || 0 === refreshTtl.value) {
			logoutAndClearInterval();
		}
	}, 1000);
};

watch(route, (from, to) => {
	clearAlert();
});

watch(showAlert, () => {
	if (showAlert.value) {
		notify({
			group: store.state.alert.group,
			text: store.state.alert.message,
			title: store.state.alert.title,
			type: store.state.alert.type,
			duration: store.state.alert.duration,
		});
		disableNotify();
	}
});

watch(refreshTokenTtl, () => {
	refreshTtl.value = refreshTokenTtl.value || 0;
	if (!refreshTtl.value || !isLoggedIn.value) {
		logoutAndClearInterval();
		return;
	}

	startInterval();
});

watch(isLoggedIn, () => {
	!isLoggedIn.value && logoutAndClearInterval();
	isLoggedIn.value && startInterval();
});
</script>

<style lang="scss">
@import "@/assets/style/footer-header.scss";
@import "@/assets/style/menus.scss";
@import "@/assets/style/authentification.scss";
#app {
	font-family: Arial, "Avenir", Helvetica, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}

@media screen and (max-width: 578px) {
	.image-log {
		width: 100%;
	}
}

.text-right {
	text-align: right!important;
}
@media (min-width: 992px){
	.ml-lg-auto, .mx-lg-auto {
		margin-left: auto!important;
	}
}

.img-lock {
	bottom: 10px;
	left: 10px;
	position: fixed;
	margin-bottom: 6%;
	background: #f0f0f6;
	border-radius: 50%;
	text-align: center;
	width: 50px;
	height: 50px;
	padding: 5px;
}

.card {
	position: relative;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	min-width: 0;
	word-wrap: break-word;
	background-color: #fff;
	background-clip: border-box;
	border: 1px solid rgba(0,0,0,.125);
	border-radius: 0.25rem;
}
.btn-info {
	color: #000;
	background-color: #c2c2c2;
	border-color: #c2c2c2;
	padding: 1em!important;
	text-align: left!important;
}

.btn-info {
	color: #fff;
	background-color: gray;
	border-color: #17a2b8;
}
.card-body {
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	min-height: 1px;
	padding: 1.25rem;
}
</style>
