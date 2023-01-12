<template>
	<div class="audiencevisibilite">
		<header-buttons></header-buttons>
		<b-container fluid class="bv-example-row">
			<b-row>
				<notifications
						group="no-ticket"
						position="bottom right"
						class="notification-container"
				/>
				<menu-formation
						class="hidden-for-mobile margin-menu"
				></menu-formation>
				<menu-mobile class="menu-mobile"></menu-mobile>
				<fade-loader
						v-if="status.isPageLoading || status.isConnectingToAtInternet"
						color="#ec008c"
						class="loader-accueil"
				></fade-loader>
				<b-col v-else lg="9" md="12" sm="12" class="visibilty-container">
					<b-row class="audience-header">
						<b-col class="element" lg="4" sm="4" cols="12">
							<h2>Statistiques de mon site web</h2>
						</b-col>
						<b-col class="element" lg="4" sm="4" cols="12">
							<a
									v-if="websiteLink !== null"
									:href="websiteLink"
									target="_blank"
							>
								www.{{
									websiteLink.replace(/https?:\/\//, "").replace("/", "")
								}}
							</a>
							<a v-else-if="websiteLink === null">
								<div>Aucun site</div>
							</a
							><br/>
						</b-col>
						<b-col class="calendar-element" lg="4" md="4" sm="4">
							<b-row>
								<b-col sm="2">
									<img src="@/assets/calendar.svg"/>
								</b-col>
								<b-col sm="10" v-if="dateRange">
									<!--                  <date-range-picker-->
									<!--                    ref="picker"-->
									<!--                    :locale-data="{-->
									<!--                      firstDay: 0,-->
									<!--                      format: 'dd/mm/yyyy',-->
									<!--                      separator: ' - ',-->
									<!--                      applyLabel: 'Appliquer',-->
									<!--                      cancelLabel: 'Annuler',-->
									<!--                      weekLabel: 'S',-->
									<!--                      daysOfWeek: [-->
									<!--                        'Lun',-->
									<!--                        'Mar',-->
									<!--                        'Mer',-->
									<!--                        'Jeu',-->
									<!--                        'Ven',-->
									<!--                        'Sam',-->
									<!--                        'Dim',-->
									<!--                      ],-->
									<!--                      monthNames: [-->
									<!--                        'Jan',-->
									<!--                        'Fév',-->
									<!--                        'Mar',-->
									<!--                        'Avr',-->
									<!--                        'Mai',-->
									<!--                        'Jui',-->
									<!--                        'Jui',-->
									<!--                        'Aoû',-->
									<!--                        'Sep',-->
									<!--                        'Oct',-->
									<!--                        'Nov',-->
									<!--                        'Dec',-->
									<!--                      ],-->
									<!--                    }"-->
									<!--                    :ranges="ranges"-->
									<!--                    v-model="dateRange"-->
									<!--                    :minDate="null"-->
									<!--                    :maxDate="maxDate"-->
									<!--                    :opens="'left'"-->
									<!--                    :timePicker="false"-->
									<!--                    @update="updateChartsData()"-->
									<!--                    :closeOnEsc="true"-->
									<!--                  >-->
									<!--                    <template v-slot:input="picker" style="min-width: 350px">-->
									<!--                      <b-row>-->
									<!--                        <b-col sm="10">-->
									<!--                          {{ pickerStartDate }} - -->
									<!--                          {{ pickerEndDate }}-->
									<!--                        </b-col>-->
									<!--                        <b-col sm="2">-->
									<!--                          <img src="@/assets/arrow-multi-choice.svg" />-->
									<!--                        </b-col>-->
									<!--                      </b-row>-->
									<!--                    </template>-->
									<!--                  </date-range-picker>-->
								</b-col>
							</b-row>
						</b-col>
					</b-row>
					<b-row class="statistiques-container">
						<b-col sm="12">
							<b-row class="mt-2">
								<b-col sm="8">
									<b-row>
										<b-col sm="3" class="audience-element">
											<b-row>
												<img src="@/assets/uniq-visits.svg"/>
											</b-row>
											<b-row class="metric-value">
												{{ atInternetFields["m_visits"] || 0 }}
											</b-row>
											<b-row> Visites uniques</b-row>
										</b-col>
										<b-col sm="3" class="audience-element">
											<b-row>
												<img src="@/assets/clock.svg"/>
											</b-row>
											<b-row class="metric-value">
												{{
													atInternetFields["m_time_spent_per_visits"]
															? fromSecondsToFullTimeDescription(
																	atInternetFields["m_time_spent_per_visits"]
															)
															: 0
												}}
											</b-row>
											<b-row> Temps passé par visite</b-row>
										</b-col>
										<b-col sm="3" class="audience-element">
											<b-row>
												<img src="@/assets/message.svg"/>
											</b-row>
											<b-row class="metric-value">{{ nbrMsg }}</b-row>
											<b-row> Messages reçus</b-row>
										</b-col>
									</b-row>
									<b-row>
										<b-col sm="3" class="audience-element">
											<b-row>
												<img src="@/assets/file.svg"/>
											</b-row>
											<b-row class="metric-value">{{
													atInternetFields["m_page_views"] || 0
												}}
											</b-row>
											<b-row> Pages vues</b-row>
										</b-col>
										<b-col sm="3" class="audience-element">
											<b-row>
												<img src="@/assets/filesSet.svg"/>
											</b-row>
											<b-row class="metric-value">
												{{
													atInternetFields["m_page_views_per_visits"]
															? atInternetFields[
																	"m_page_views_per_visits"
																	].toFixed(2)
															: 0
												}}
											</b-row
											>
											<b-row> Pages vues par visite</b-row>
										</b-col>
										<b-col sm="3" class="audience-element">
											<b-row>
												<img src="@/assets/newsLetter.svg"/>
											</b-row>
											<b-row class="metric-value">{{
													webtool.newsletter.nbrUser
												}}
											</b-row>
											<b-row> Inscriptions newsletter</b-row>
										</b-col>
									</b-row>
								</b-col>
								<b-col sm="4">
									<b-row>
										<fade-loader
												v-if="status.isLoadingSources"
												color="#ec008c"
												class="loader-accueil"
										></fade-loader>
										<DoughnutChart
												v-else-if="
                        !status.isLoadingSources && doughnutChartDatas.length
                      "
												:datas="
                        doughnutChartDatas.map(
                          (doughnutChartData) => doughnutChartData.visits
                        )
                      "
												:labels="
                        doughnutChartDatas.map(
                          (doughnutChartData) => doughnutChartData.source
                        )
                      "
												:colors="
                        doughnutChartDatas.map((doughnutChartData) =>
                          fromLabelToColor(doughnutChartData.source)
                        )
                      "
												label="Source de trafic"
										/>
									</b-row>
								</b-col>
							</b-row>
							<b-row>
								<b-col sm="12" class="pl-0 mb-3">
									<fade-loader
											v-if="status.isLoadingVisits"
											color="#ec008c"
											class="loader-accueil"
									></fade-loader>
									<LineChart
											v-else-if="!status.isLoadingVisits && lineChartDatas.length"
											:datas="
                      lineChartDatas.map(
                        (lineCHartData) => lineCHartData.visits
                      )
                    "
											:labels="
                      lineChartDatas.map(
                        (lineCHartData) =>
                          lineCHartData.day ||
                          (lineCHartData.month
                            ? fromMonthNumberToLabel(lineCHartData.month - 1)
                            : lineCHartData.month)
                      )
                    "
											:label="formattedLabel"
											elementLabel="Nombre de visite"
									/>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</b-container>
		<footer :class="{ 'footer-auth': !partner.hasVisibility }"/>
	</div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import VueCircle from "vue2-circle-progress";
import LineChart from "@/components/Charts/LinearChart.vue";
import DoughnutChart from "@/components/Charts/DoughnutChart.vue";
import {dateHelpers, chartsHelper} from "@/helpers";
import dayjs from "dayjs";
import DateRangePicker from "vue2-daterange-picker";
import {computed, onMounted, ref} from "vue";
import Footer from "@/components/Footer.vue";
import MenuFormation from "@/components/MenuFormation.vue";
import {BRow, BContainer, BCol} from "bootstrap-vue-3";
import MenuMobile from "@/components/MenuMobile.vue";
import HeaderButtons from "@/components/HeaderButtons.vue";
// import PerformanceHeader from './PerformanceHeader';
let store = useStore();

let partner = computed(() => store.state.globalStore.partner);
let status = computed(() => store.state.globalStore.status);
let webtool = computed(() => store.state.globalStore.webtool);
let websiteLink = computed(() => store.state.globalStore.websiteLink);
let filterAudienceRange = computed(() => store.state.globalStore.filterAudienceRange);
let atInternetInformation = computed(() => store.state.globalStore.atInternetInformation);
let atInternetVisitsData = computed(
		() => store.state.globalStore.atInternetVisitsData
);
let atInternetSourceData = computed(
		() => store.state.globalStore.atInternetSourceData
);
let formattedLabel = () => {
	return dateRange && dateRange.value
			? `Nombre de visites du ${formatDate(
					dateRange.value.startDate
			)} au ${formatDate(dateRange.value.endDate)}`
			: "";
};

let notAvailable_1 = ref(true);
let lineChartDatas = ref([]);
let doughnutChartDatas = ref([]);
let dateRange = ref({});
let picker = ref(null);
let visitLoadingMsg = ref("chargement en cours ...");
let color = ref("#ec008c");
let atInternetAutoLogin = ref("");
let uberallLoading = ref(true);
let visitsLastMonth = ref(null);
let reloadingTime = ref(1);
let reloadingTime2 = ref(2);
let nbrMsg = ref(null);
let atInternetFields = ref({});
let ranges = ref({});
let maxDate = ref(new Date(new Date().setDate(new Date().getDate() - 1)));

onMounted(() => {
	let timeout = setInterval(() => {
		if (status.value.isPageLoading) {
			return;
		}
		clearInterval(timeout);

		getNewsletterNbr();
		getMessagesCount();
		connectToAtInternet().then(() => loadAtInternetData());
	}, 100);
});

let connectToAtInternet = () => store.dispatch("globalStore/connectToAtInternet");
let getNewsletterNbr = () => store.dispatch("globalStore/getNewsletterNbr");
let getCountContactMessages = () => store.dispatch("globalStore/getCountContactMessages");


let loadAtInternetData = () => {
	let today = new Date();
	let startDate = new Date();
	let yesterday = new Date();
	startDate.setMonth(startDate.getMonth() - 1);
	yesterday.setDate(today.getDate() - 1);
	dateRange.value = filterAudienceRange.value || {
		startDate: startDate,
		endDate: yesterday,
	};
	ranges.value = {
		Hier: [yesterday, yesterday],
		"7 derniers jours": [
			new Date(
					yesterday.getFullYear(),
					yesterday.getMonth(),
					yesterday.getDate() - 7
			),
			yesterday,
		],
		"30 derniers jours": [
			new Date(
					yesterday.getFullYear(),
					yesterday.getMonth(),
					yesterday.getDate() - 30
			),
			yesterday,
		],
		"Mois en cours": [
			new Date(yesterday.getFullYear(), yesterday.getMonth(), 1),
			new Date(),
		],
		"Mois dernier": [
			new Date(yesterday.getFullYear(), yesterday.getMonth() - 1, 1),
			new Date(yesterday.getFullYear(), yesterday.getMonth(), 0),
		],
		"Année courante": [new Date(yesterday.getFullYear(), 0, 1), yesterday],
	};
	updateChartsData();
};
let fromSecondsToFullTimeDescription = (seconds: any) => {
	let duration = dayjs.duration(seconds, "seconds");
	return dayjs.utc(duration.asMilliseconds()).format("HH:mm:ss");
};
let printVisitsStats = () => {
	if (
			atInternetVisitsData.value.Rows &&
			atInternetVisitsData.value.Rows.length
	) {
		let rows = atInternetVisitsData.value.Rows;
		lineChartDatas.value = rows.map((row) => ({
			month: row.d_time_month,
			day: row.evo_day ? dayjs(row.evo_day).format("DD-MM-YY") : null,
			visits: row.m_visits,
		}));
	}
	atInternetFields.value = Object.assign({}, atInternetVisitsData);
};
let printSourceStats = () => {
	if (atInternetSourceData.value.length) {
		doughnutChartDatas = atInternetSourceData.value.map((row) => ({
			source: row.d_source,
			visits: row.m_visits,
		}));
	}
};
let updateChartsData = () => {
	lineChartDatas.value = [];
	doughnutChartDatas.value = [];

	store.dispatch("globalStore/setFilterAudienceValue", dateRange).then(() => {
		let currentWebsite = websiteLink.value
				.replace(/https?:\/\//, "")
				.replace("/", "");
		if (atInternetInformation.value && atInternetInformation[currentWebsite]) {
			atInternetAutoLogin = atInternetInformation[currentWebsite].autologin_url;
			printVisitsStats();
			printSourceStats();
			notAvailable_1.value = false;
		} else {
			visitLoadingMsg.value = "Aucune donnée disponible.";
		}
	});

};
let getMessagesCount = () => {
	getCountContactMessages().then((response) => {
		for (let site in response) {
			nbrMsg.value += response[site];
		}
	});
};
let fromLabelToColor = (englishLabel) => {
	return chartsHelper.fromLabelToColor(englishLabel);
};
let fromMonthNumberToLabel = (monthNumber) => {
	return dateHelpers.fromMonthNumberToLabel(monthNumber);
};
let formatDate = (val) => {
	return val ? dayjs(val).format("DD/MM/YYYY") : "";
};

let pickerStartDate = computed(() => {
	return picker.value.startDate
			? dayjs(picker.value.startDate).format("DD/MM/YYYY")
			: "";
});

let pickerEndDate = computed(() => {
	return picker.value.endDate
			? dayjs(picker.value.endDate).format("DD/MM/YYYY")
			: "";
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/visibilite.scss";
</style>
