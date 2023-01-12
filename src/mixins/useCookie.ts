import {cookieService} from "../services";
import {useStore} from "vuex";
import {computed, onMounted, ref, type ComputedRef} from "vue";
import {useGtag} from "vue-gtag-next";

export default function () {
	const store = useStore();
	const gtag = useGtag();

	const cookieNames = ref(["performance", "targeting"]);
	const cookies = ref({});

	const performanceCookie = computed(
		() => store.state.account.status.performanceCookie
	);

	const targetingCookie: ComputedRef<boolean> = computed(
		() => store.state.account.status.targetingCookie
	);

	const performance = computed({
		get() {
			return performanceCookie.value;
		},
		set(value) {
			store.commit("account/setPerformanceCookie", value);
			refreshCookies();
			if (!value) {
				// https://github.com/MatteoGabriele/vue-analytics/issues/145 we have to remove the cookies manually
				// https://github.com/MatteoGabriele/vue-gtag/issues/44 we have to the cookies remove manually
				// https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out we have to the cookies remove manually
				$gtag.optOut();
				window[`ga-disable-${process.env.GOOGLE_ANALYTICS_ID}`] = true;
			} else {
				$gtag.optIn();
			}
		},
	});
	const targeting = computed({
		get() {
			return targetingCookie;
		},
		set(value) {
			refreshCookies();
			store.commit("account/setTargetingCookie", value);
		},
	});

	onMounted(() => {
		cookies.value = cookieService.getCookies();
		const cookiesKeys = Object.keys(cookies);
		// to test if the object is empty or not
		if (cookiesKeys.length) {
			// TO FIX MAX
			// cookiesKeys.forEach((key) => {
			// 	this[key] = cookies[key];
			// });
		}
	});

	const updateCookie = (cookieName: string, value: any) => {
		//cookieName = value;
		console.log(cookieName, value);
		cookieService.setCookie(cookieName, value);
	};

	const denyOrAcceptAllCookies = (value) => {
		cookieNames.value.forEach((cookieName) => {

			updateCookie(cookieName, value);
		});
	};

	const refreshCookies = () => {
		cookies.value = cookieService.getCookies();
	};

	return {
		gtag,
		performanceCookie,
		targetingCookie,
		performance,
		targeting,
		cookieNames,
		cookies,
		updateCookie,
		denyOrAcceptAllCookies,
		refreshCookies,
	};
}
