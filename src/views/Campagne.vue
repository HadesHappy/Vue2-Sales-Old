<template>
	<div class="performance">
		<app-headerbuttons/>
		<notifications
			class="notification-container"
			group="campaign-notify"
			position="bottom right"
		/>
		<b-container fluid>
			<b-row>
				<app-menuformation
					class="hidden-for-mobile margin-menu"
				></app-menuformation>
				<app-menumobile class="menu-mobile"></app-menumobile>
				<fade-loader
					v-if="pageLoading"
					:color="color"
					class="loader-site hidden-for-mobile"
				></fade-loader>
				<b-col v-else class="margin-menu" lg="9" md="12" sm="12">
					<PerformanceHeader
						title="Mes rapports Google Ads"
						v-model="dateRange"
						@change="onDatePeriodChange($event)"
					/>
					<b-container fluid>
						<b-row class="statistiques-container pt-2">
							<b-col>
								<b-row class="px-3">
									<b-col class="px-1 py-3" md="4">
										<b-row>
											<b-col>
												<b-row
													class="campaign-element fix-height-120 mx-3 py-4 text-center"
												>
													<b-col cols="5" class="px-0">
														<img src="@/assets/eye.svg"/>
													</b-col>
													<b-col class="px-0">
                            <span class="metric-value">{{
									reportws.Impressions
								}}</span>
														<br/>
														<span class="metric-label">Impressions</span>
														<i
															class="fas fa-info picto-info"
															v-b-tooltip.hover
															title="Nombre de fois que la publicité a été affichée sur Google, sans clic du côté de l’utilisateur."
														></i>
													</b-col>
												</b-row>
											</b-col>
										</b-row>
									</b-col>
									<b-col class="px-1 py-3" md="4">
										<b-row>
											<b-col>
												<b-row
													class="campaign-element fix-height-120 mx-3 py-4 text-center"
												>
													<b-col cols="5" class="px-0">
														<img src="@/assets/mouse-pointer.svg"/>
													</b-col>
													<b-col class="px-0">
                            <span class="metric-value">{{
									reportws.Clicks
								}}</span>
														<br/>
														<span class="metric-label">Clics</span>
													</b-col>
												</b-row>
											</b-col>
										</b-row>
									</b-col>
									<b-col class="px-1 py-3" md="4">
										<b-row>
											<b-col>
												<b-row
													class="campaign-element fix-height-120 mx-3 py-4 text-center"
												>
													<b-col cols="5" class="px-0">
														<img src="@/assets/active-pointer.svg"/>
													</b-col>
													<b-col class="px-0">
                            <span class="metric-value"
							>{{ parseInt(reportws.CTR || 0) }}%</span
							>
														<br/>
														<span class="metric-label">Taux de clics</span>
														<i
															class="fas fa-info picto-info"
															v-b-tooltip.hover
															title="Rapport exprimé en pourcentage entre le nombre de clics et le nombre d’impressions."
														></i>
													</b-col>
												</b-row>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-row>
						<b-row class="statistiques-container pb-2">
							<b-col>
								<b-row class="px-3">
									<b-col class="px-1 py-3" md="7">
										<b-row>
											<b-col>
												<b-row class="campaign-element mx-3 py-4">
													<b-col
														cols="12"
														class="pb-3 text-center metric-title"
													>
														Top 10 des mots-clés les plus cliqués
													</b-col>
													<b-col cols="12">
														<b-table
															hover
															borderless
															small
															head-variant="light"
															table-variant="light"
															table-class="top-keywords-table"
															:items="topKeywords"
															:fields="topKeywordsFields"
														></b-table>
													</b-col>
												</b-row>
											</b-col>
										</b-row>
									</b-col>
									<b-col class="px-1 py-3" md="5">
										<b-row>
											<b-col>
												<b-row class="campaign-element mx-3 py-4 text-center">
													<b-col
														cols="12"
														class="pb-3 text-center metric-title"
													>
														Répartition par matériel (nb de clics)
													</b-col>
													<b-col cols="12" class="px-0">
														<DoughnutChart
															v-if="performancesByDeviceValues.length"
															:datas="performancesByDeviceValues"
															:labels="performancesByDeviceLabels"
															:colors="performancesByDeviceColors"
															:styles="performancesByDeviceStyles"
														/>
														<div
															align-v="center"
															class="total-device-clicks-container"
															v-b-tooltip.hover
															title="Nombre total de clicks"
														>
															{{ totalDeviceClicks }}
														</div>
													</b-col>
												</b-row>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-row>
						<b-row class="statistiques-container pb-2">
							<b-col>
								<b-row class="px-3">
									<b-col class="px-1 py-3">
										<b-row>
											<b-col>
												<b-row class="campaign-element mx-3 py-4">
													<b-col
														cols="12"
														class="pb-3 text-center metric-title"
													>
														Clics sur la période du
														{{ dateRangeData.startDate | date }} au
														{{ dateRangeData.endDate | date }} (par
														{{ linearChartPeriod }})
													</b-col>
													<b-col cols="12">
														<LinearChart
															v-if="linearChartDatas.length"
															:datas="
                                linearChartDatas.map((data) => data.clicks)
                              "
															:labels="
                                linearChartDatas.map(
                                  (item) => item.day || item.month
                                )
                              "
															elementLabel="Nombre de clics"
															:styles="linearChartStyles"
														/>
													</b-col>
												</b-row>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-row>
					</b-container>
				</b-col>
			</b-row>
		</b-container>
		<app-footer class="footer-auth"></app-footer>
	</div>
</template>

<script lang="ts" setup>
import axios from "axios";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import Site from "@/views/Site.vue";
import {adplorerService} from "@/services";

import {useStore} from "vuex";
import {computed, onMounted, ref, inject} from "vue";
import {readyState} from "@/helpers";
import PerformanceHeader from "@/components/PerformanceHeader.vue";
import {dateHelpers} from "../helpers";
import DoughnutChart from "@/components/Charts/DoughnutChart.vue";
import LinearChart from "@/components/Charts/LinearChart.vue";
import dayjs from "dayjs";
import {getLocalStorageItem} from "@/helpers/localStorage.helper";

const store = useStore();

const vueModal = inject("$vfm");

const isAdplorerCustomer = ref(true);
const reportws = ref({});
const topKeywords = ref([]);
const topKeywordsFields = ref([
	{
		key: "Termes de recherche",
		tdClass: () => "text-left",
		thClass: "py-2",
	},
	{
		key: "Impressions",
		thClass: "py-2",
	},
	{
		key: "Clics",
		thClass: "py-2",
	},
]);
const availableDevices = ref({
	Desktop: "Ordinateurs",
	Mobile: "Smartphones",
	Tablet: "Tablettes",
});
const availableColorsByDevice = ref({
	Desktop: "#ec008c",
	Mobile: "#faa61a",
	Tablet: "#bcbdc0",
});
const firstDate = ref(new Date());
const secondDate = ref(new Date());
const demoType = ref("Visibilité");
const time1 = ref("Matin");
const time2 = ref("Matin");
const error = ref(false);
const pageLoading = ref(true);
const color = ref("#ec008c");
let performancesByDeviceValues = ref([]);
let performancesByDeviceLabels = ref([]);
let performancesByDeviceColors = ref([]);
let totalDeviceClicks = ref(0);
let dateRangeData = ref({});
let linearChartDatas = ref([]);
let linearChartStyles = ref({
	width: "100%",
});

onMounted(() => {
	pageLoading.value = true;
	const now = new Date();
	dateRange.value = {
		startDate: new Date().setMonth(now.getMonth() - 1),
		endDate: now,
	};
	readyState
		.getSalesforceState()
		.then(() => loadAdwordsData())
		.then(() => getUberallListings())
		.finally(() => (pageLoading.value = false));
});

const currentPartner = computed(() => store.state.account.currentPartner);
const salesforce = computed(() => store.state.globalStore.salesforce);
const dateRange = computed({
	get: () => {
		return dateRangeData;
	},
	set: (value) => {
		dateRangeData.value = value;
	},
});
const performancesByDeviceStyles = computed(() => {
	return {
		width: "100%",
		height: "390px",
		padding: "0",
	};
});
const linearChartPeriod = computed(() => {
	const {endDate, startDate} = dateRangeData.value || {};
	if (!endDate || !startDate) {
		return "jour";
	}

	const dayDiff = parseInt(
		(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
	);

	return dayDiff > 183 ? "mois" : "jour";
});

// TODO
// filters: {
//     date: (val) => (val ? dayjs(val).format("DD/MM/YYYY") : ""),
//   },

const getUberallListings = () =>
	store.dispatch("globalStore/getUberallListings");

const open_modal = () => {
	vueModal.show("demo-campaign");
};
const close_modal = () => {
	$modal.hide("demo-campaign");
};
const send_demo = () => {
	const agency = Site.methods.make_agency_email(
		getLocalStorageItem("agenceName")
	);
	const firstDate =
		firstDate.getMonth() +
		1 +
		"/" +
		firstDate.getDate() +
		"/" +
		firstDate.getFullYear() +
		" " +
		time1.value;
	const secondDate =
		secondDate.getMonth() +
		1 +
		"/" +
		secondDate.getDate() +
		"/" +
		secondDate.getFullYear() +
		" " +
		time2.value;
	if (firstDate === secondDate) {
		error.value = true;
	} else {
		error.value = false;
		axios
			.post(
				import.meta.env.VUE_LOCALETMOI_BASE_URL + "/api/mandrill/demo",
				{
					agency: agency,
					sageCode: getLocalStorageItem("sageCode"),
					fromEmail: getLocalStorageItem("login"),
					firstDate: firstDate,
					secondDate: secondDate,
					demoType: demoType,
				},
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			)
			.then((response) => {
				$modal.hide("demo-campaign");
				store.dispatch("alert/success", {
					group: "campaign-notify",
					title: "Merci !",
					type: "success",
					duration: 10000,
					text: "Votre demande de démo a bien été envoyée !",
				});
			})
			.catch((error) => {
				console.warn("error " + error);
			});
	}
};
const onDatePeriodChange = (dateRange: { startDate: any; endDate: any }) => {
	loadAdwordsData(
		dateHelpers.toISODate(dateRange.startDate),
		dateHelpers.toISODate(dateRange.endDate)
	);
};
const loadAdwordsData = (
	startDate: string | undefined,
	endDate: string | undefined
) => {
	performancesByDeviceValues = [];
	performancesByDeviceLabels = [];
	linearChartDatas = [];

	return adplorerService
		.getAdwordsData(
			currentPartner.value.customerCode,
			salesforce.value.account.Agence__c,
			startDate || dateHelpers.toISODate(dateRangeData.value.startDate),
			endDate || dateHelpers.toISODate(dateRangeData.value.endDate)
		)
		.then((response) => {
			if (response && response.isAdplorerCustomer) {
				reportws.value = response;
				topKeywords.value = (response.TopKeywords || []).map(
					(item: { KeywordText: any; Impressions: any; Clicks: any }) => {
						return {
							"Termes de recherche": item.KeywordText,
							Impressions: item.Impressions,
							Clics: item.Clicks,
						};
					}
				);
				const performancesByDevice =
					(response || {}).PerformanceDataByEndDevice || [];
				performancesByDevice.forEach(
					(item: { Clicks: string; Device: string | number }) => {
						performancesByDeviceValues.value.push(item.Clicks);
						performancesByDeviceLabels.value.push(
							availableDevices[item.Device]
						);
						performancesByDeviceColors.value.push(
							availableColorsByDevice[item.Device]
						);
						totalDeviceClicks.value += parseInt(item.Clicks);
					}
				);
				linearChartDatas = response.ClicksByDay.map(
					(data: {
						Month: number;
						Date: string | number | Date | dayjs.Dayjs | null | undefined;
						Clicks: any;
					}) => ({
						month: data.Month
							? dateHelpers.fromMonthNumberToLabel(data.Month - 1)
							: data.Month,
						day: data.Date ? dayjs(data.Date).format("DD-MM-YY") : null,
						clicks: data.Clicks,
					})
				);
			} else {
				store.dispatch("alert/warn", {
					group: "campaign-notify",
					title: "Campagne Google Ads",
					type: "warn",
					duration: 10000,
					text: "Aucune donnée sur votre campagne Google Ads.",
				});
			}
		})
		.catch((error) => {
			console.warn(error);
			store.dispatch("alert/error", {
				group: "campaign-notify",
				title: "Campagne Google Ads",
				type: "error",
				duration: 5000,
				text: "Service indisponible.",
			});
		});
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/campagne.scss";
</style>
