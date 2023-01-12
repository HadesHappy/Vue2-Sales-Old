<template>
	<b-col md="3" class="px-0 timeline-item-container">
		<b-row class="px-0">
			<b-col md="12" class="px-0">
				<div
					class="display-step-button"
					@click="isTimeLineAvailable && showPf(step, name)"
				>
					<div
						class="display-step-button-elements"
						:class="!isTimeLineAvailable ? 'unavailable-timeline' : ''"
					>
						<div
							v-if="isValidated"
							:class="`transmit-valid ${
                pfPreviewInformation.stepOwner === name && isPreview
                  ? 'active'
                  : ''
              }`"
						></div>
						<img
							v-else-if="
                props.step === nextLogicalStep || !!currentTimelineStep
              "
							alt="Etape en cours"
							class="timeline-step to-transmit"
							src="@/assets/circle-active-step-button.svg"
						/>
						<img
							v-else
							alt="Etape non validée"
							src="@/assets/circle-disabled-step-button.svg"
							class="timeline-step"
							v-b-tooltip.hover
							title="Étape non historisée"
						/>
						<div
							v-if="!isValidated && !isLast"
							class="timeline-line timeline-disabled"
						></div>
						<div
							v-else-if="isValidated && !isLast"
							class="timeline-line timeline-valid"
						></div>
						<div
							v-else-if="isCurrent && !isLast"
							class="timeline-line timeline-active"
						></div>
					</div>
					<div class="p-0 mt-5 step-text">
						<span class="step-level-text">Etape {{ props.step }}</span>
						<br/>
						<span class="step-profile-text">{{ name }}</span>
					</div>
				</div>
			</b-col>
		</b-row>
		<b-row class="btn-validate-container" v-if="isAllowedToTransmitPf">
			<b-col>
				<img
					v-if="isValidated"
					@click="transmitPf()"
					class="transmit-btn"
					src="@/assets/switch_on.svg"
				/>
				<img
					v-else
					class="transmit-btn"
					@click="transmitPf()"
					src="@/assets/switch_off.svg"
				/>
				<span :class="isValidated ? 'is-valid-text' : ''">
          {{ isValidated ? "DP validé" : "Je valide le DP" }}
        </span>
				<b-row
					v-if="
            isSalesmanStep &&
            isSalesmanCurrentUserStep &&
            countDownTime &&
            !isValidated
          "
					class="justify-center count-down"
				>
					<p class="count-down-value m-0">{{ formattedTime }}</p>
					<p class="count-down-text mb-0">Temps restant</p>
				</b-row>
			</b-col>
		</b-row>
	</b-col>
</template>

<script lang="ts" setup>
import {authDpHelper, normalizer} from "@/helpers";
import {ref, computed, onUnmounted} from "vue";
import {store} from "@/store";

let countDownTime = ref(null);

let props = defineProps({
	name: {
		type: String,
		require: true,
	},
	isLast: {
		type: Boolean,
		require: true,
	},
	step: {
		type: Number,
		require: true,
	},
});

let status = computed(() => store.state.account.status);
let timelineSteps = computed(() => store.state.account.timelineSteps);
let identity = computed(() => store.state.account.identity);
let currentPartnerFolder = computed(
	() => store.state.account.currentPartnerFolder
);
let salesforceUser = computed(() => store.state.account.salesforceUser);
let pfPreviewInformation = computed(
	() => store.state.account.pfPreviewInformation
);
let salesforce = computed(() => store.state.globalStore.salesforce);

let isPreview = () => {
	return pfPreviewInformation.value && pfPreviewInformation.value.isPreview;
};

let currentUserStep = computed(() => {
	return authDpHelper.getCurrentUserStep();
});

let isSalesmanStep = computed(() => {
	return 1 === props.step;
});
let isSalesmanCurrentUserStep = computed(() => {
	return 1 === currentUserStep.value;
});
let hasPartnerHistories = computed(() => {
	return !!(
		currentPartnerFolder.value &&
		currentPartnerFolder.value.partnerHistories &&
		currentPartnerFolder.value.partnerHistories.length
	);
});
let currentPartnerHistory = computed(() => {
	return hasPartnerHistories.value
		? currentPartnerFolder.value.partnerHistories.find(
			(partnerHistory: { userId: any }) =>
				partnerHistory.userId === salesforceUser.value.Id
		)
		: null;
});
let currentTimelineStep = computed(() => {
	return timelineSteps.value.find(
		(timeline: { step: number | undefined }) => props.step === timeline.step
	);
});
let isValidated = computed(() => {
	return currentTimelineStep.value && currentTimelineStep.value.isValidated;
});
let isTimeLineAvailable = computed(() => {
	return currentTimelineStep.value && currentTimelineStep.value.snapshot;
});
let isCurrent = computed(() => {
	return (
		undefined !== currentUserStep.value && currentUserStep.value === props.step
	);
});
let nextLogicalStep = computed(() => {
	if (!timelineSteps.value || !timelineSteps.value.length) {
		return 1;
	}

	return (
		Math.max(
			...timelineSteps.value.map(
				(timeline: { isValidated: any; step: any }) => {
					if (timeline.isValidated) {
						return timeline.step;
					}
				}
			)
		) + 1
	);
});
let isAllowedToTransmitPf = computed(() => {
	handleCountDown();
	return (
		salesforceUser.value &&
		currentPartnerFolder &&
		currentPartnerFolder.value.id &&
		isCurrent &&
		identity.value.allowedToEdit &&
		!status.value.isStopEditing &&
		authDpHelper.canTransmitPf()
	);
});
let formattedTime = computed(() => {
	if (
		!countDownTime.value.hours() &&
		!countDownTime.value.minutes() &&
		countDownTime.value.seconds()
	) {
		return `${countDownTime.value.seconds()}s`;
	}

	return `${countDownTime.value.hours()}h ${countDownTime.value.minutes()}m`;
});

onUnmounted(() => {
	window.myInterval && window.clearInterval(window.myInterval);
});

let updatePartnerPropertyFromForm = (data: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", data);
let setPreviewInformation = (value: any) =>
	store.commit("account/setPreviewInformation", value);

let showPf = (step: any, stepOwner: any) => {
	if (!timelineSteps.value.length) {
		return;
	}

	setPreviewInformation({
		isPreview: false,
		stepOwner: null,
		creationDate: null,
		updateDate: null,
		userFullname: null,
	});

	let currentTimeline = timelineSteps.value.find(
		(timeline: { step: any }) => timeline.step === step
	);
	if (currentTimeline) {
		store
			.dispatch("account/previewPfHistoryStep", {
				snapshot: currentTimeline ? currentTimeline.snapshot : null,
				isPreview: true,
				stepOwner,
				creationDate:
					currentTimeline && currentTimeline.creationDate
						? currentTimeline.creationDate
						: null,
				updateDate:
					currentTimeline && currentTimeline.updateDate
						? currentTimeline.updateDate
						: null,
				userFullname:
					currentTimeline && currentTimeline.userFullname
						? currentTimeline.userFullname
						: null,
			})
			.then(() => {
				store.dispatch(
					"alert/warn",
					{
						group: "general-error",
						type: "warn",
						message:
							"Dans ce mode, vous ne pouvez pas metre à jour le dossier partenaire courant",
						show: true,
						title: `Vous êtes en mode preview de l'étape "${stepOwner}"`,
					},
					{root: true}
				);
			});
	} else {
		store.dispatch(
			"alert/warn",
			{
				group: "general-error",
				type: "warn",
				message: "Cette étape n'est pas disponible",
				show: true,
				title: `Aucun preview pour l'étape "${stepOwner}"`,
			},
			{root: true}
		);
	}
};
let transmitPf = () => {
	if (!identity.value.allowedToEdit) {
		return;
	}

	let data = {};
	let partnerHistory = currentPartnerHistory;
	if (partnerHistory) {
		data = {
			partnerHistory,
			payload: normalizer.normalizePartnerHistory({
				snapshot: {
					currentPartnerFolder: currentPartnerFolder,
					salesforce: salesforce,
				},
				updateDate: new Date(),
				userId: salesforceUser.value.Id,
				isValidated: true,
			}),
		};
	} else {
		data = {
			partnerHistory: normalizer.normalizePartnerHistory({
				partnerFolder: currentPartnerFolder.value["@id"],
				userId: salesforceUser.value.Id,
				creationDate: new Date(),
				snapshot: {
					currentPartnerFolder: currentPartnerFolder,
					salesforce: salesforce,
				},
				isValidated: true,
			}),
		};
	}

	updatePartnerPropertyFromForm({data}).then(() => {
		if (
			isSalesmanStep.value &&
			isSalesmanCurrentUserStep &&
			window.myInterval
		) {
			window.clearInterval(window.myInterval);
		}
	});
};

let handleCountDown = () => {
	if (isSalesmanCurrentUserStep.value && isSalesmanStep) {
		if (
			salesforce.value.opportunity &&
			salesforce.value.opportunity.CreatedDate
		) {
			let start = momentBusinessDays(
					momentBusinessDays
						.utc(salesforce.value.opportunity.CreatedDate)
						.locale("fr")
				),
				end = start.businessAdd(1),
				now = momentBusinessDays();
			if (now.isAfter(end)) {
				store.dispatch("account/setIsStopEditing", true, {root: true});
			} else if (!status.value.isStopEditing) {
				countDownTime = momentBusinessDays.duration(
					end.diff(now, "milliseconds")
				);
				if (!window.myInterval) {
					window.myInterval = setInterval(() => {
						countDownTime = momentBusinessDays.duration(
							countDownTime.value - 1000,
							"milliseconds"
						);
						if (countDownTime.value > 0) {
							return;
						}

						clearInterval(window.myInterval);
						store.dispatch("account/setIsStopEditing", true, {
							root: true,
						});
					}, 1000);
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/TimeLine/timeline.scss";
</style>
