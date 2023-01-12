import { createApp } from "vue";
// import { createPinia } from "pinia";

import App from "./App.vue";
import { store } from "./store";
import router from "./router";

import MainHeader from "@/components/MainHeader.vue";
import HeaderButtons from "@/components/HeaderButtons.vue";
import HeaderGeneral from "@/components/HeaderGeneral.vue";
import HeaderMenu from "@/components/HeaderMenu.vue";
import Footer from "@/components/Footer.vue";
import MenuFormation from "@/components/MenuFormation.vue";
import DropdownMenu from "@/components/DropdownMenu.vue";
import MenuMobile from "@/components/MenuMobile.vue";
import CustomerRef from "@/components/CustomerRef.vue";
import MenuProfile from "@/components/MenuProfile.vue";

import BootstrapVue3 from "bootstrap-vue-3";
import Notifications from "@kyvg/vue3-notification";
import VModal from "vue-final-modal";
import ReadMore from "./plugin/vue-read-more";
import VueGtag from "vue-gtag-next";
import DateRangePicker from "vue2-daterange-picker";
import Vue3Tour from "vue3-tour";
//import { ValidationProvider, extend } from "vee-validate";
//import * as rules from "vee-validate/dist/rules";
//import { messages } from "vee-validate/dist/locale/fr.json";
import { configure } from "vee-validate";
import vueDebounce from "vue-debounce";
import VueProgressBar from "@aacassandra/vue3-progressbar";
import VCalendar from "v-calendar";

import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
// import "v-calendar/dist/style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const app = createApp(App);

const options = {
	color: "#EC008C",
	failedColor: "#ea3356",
	thickness: "12px",
	transition: {
		speed: "1s",
		opacity: "0.8s",
		termination: 500,
	},
	autoRevert: true,
	location: "top",
	inverse: false,
};

// Object.keys(rules).forEach((rule) => {
// 	extend(rule, {
// 		...rules[rule], // copies rule configuration
// 		message: messages[rule], // assign message
// 	});
// });

// configure({
// 	classes: {
// 		valid: "is-valid",
// 		invalid: "is-invalid",
// 	},
// });

app.use(VCalendar, {
	firstDayOfWeek: 2,
});
app.use(Notifications);
app.use(BootstrapVue3, {
	BFormTags: {
		addButtonText: "Ajouter",
		invalidTagText: "Veuillez saisir au minimum 3 caractères",
		placeholder: "Ajouter un mot clé",
	},
	BFormDatepicker: {
		locale: "fr",
		startWeekDay: 1,
		placeholder: "Aucune date sélectionnée",
		labelNoDateSelected: "Aucune date sélectionnée",
		labelCurrentMonth: "Mois courant",
		labelPrevDecade: "Jour précédent",
		labelPrevMonth: "Moi précédent",
		labelPrevYear: "Année précédente",
		labelNextDecade: "Jour suivant",
		labelNextMonth: "Mois suivant",
		labelNextYear: "Année suivante",
		labelHelp: "Utilisez les flèches pour naviguer dans le calendrier",
	},
});
app.use(VModal);
app.use(VModal, { dialog: true });
app.use(ReadMore);
app.use(DateRangePicker);
app.use(Vue3Tour);
app.use(VueProgressBar, options);

app.use(VueGtag, {
	property: { id: import.meta.env.VUE_GOOGLE_ANALYTICS_ID },
	enabled: false,
});
app.use(vueDebounce, {
	listenTo: ["input"],
	defaultTime: "300ms",
});

app.component("app-mainheader", MainHeader);
app.component("app-headermenu", HeaderMenu);
app.component("app-headergeneral", HeaderGeneral);
app.component("app-menuprofile", MenuProfile);
app.component("app-footer", Footer);
app.component("app-headerbuttons", HeaderButtons);
app.component("app-menuformation", MenuFormation);
app.component("app-dropdownmenu", DropdownMenu);
app.component("app-menumobile", MenuMobile);
app.component("app-customerRef", CustomerRef);
//app.component("ValidationProvider", ValidationProvider);

app.use(router);
app.use(store);

app.mount("#app");
