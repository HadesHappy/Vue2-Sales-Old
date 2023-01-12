<template>
	<b-container fluid>
		<b-row class="my-3" v-if="displayEntitle">
			<b-col>Horaires exceptionnels</b-col>
		</b-row>
		<b-row
			class="mb-3"
			v-for="(item, index) in exceptionalDates"
			:key="`exceptional-date-${timestamp}-${index}`"
		>
			<b-col sm="12" md="3" lg="2">
				<label class="label">Date de début</label>
				<ValidationProvider
					name="startDate"
					rules="min:3|checkPeriodDates:@startDate,@endDate"
					:ref="`exceptionalDates[${index}].startDate`"
					v-slot="{ classes, errors }"
				>
					<b-form-datepicker
						@input="onExceptionalStartDateChange(item, index)"
						type="date"
						v-model="item.startDate"
						:class="classes"
						:name="`exceptionalDates[${index}].startDate`"
						:disabled="!isAllowedToEdit || isLoading[index]"
						:readonly="!isAllowedToEdit"
						:size="size || 'md'"
					></b-form-datepicker>
					<small :class="classes">{{ errors[0] }}</small>
				</ValidationProvider>
			</b-col>
			<b-col sm="12" md="3" lg="2">
				<label class="label">Date de fin</label>
				<ValidationProvider
					name="endDate"
					rules="min:3|checkPeriodDates:@startDate,@endDate"
					:ref="`exceptionalDates[${index}].endDate`"
					v-slot="{ classes, errors }"
				>
					<b-form-datepicker
						@input="onExceptionalEndDateChange(item, index)"
						type="date"
						v-model="item.endDate"
						:class="classes"
						:name="`exceptionalDates[${index}].endDate`"
						:disabled="!isAllowedToEdit || isLoading[index]"
						:readonly="!isAllowedToEdit"
						:size="size || 'md'"
					></b-form-datepicker>
					<small :class="classes">{{ errors[0] }}</small>
				</ValidationProvider>
			</b-col>
			<b-col sm="12" md="3" lg="2" v-if="enableReason">
				<label class="label">Motif</label>
				<ValidationProvider
					name="Motif"
					rules="min:3"
					:ref="`parentEntity.exceptionalDates[${index}].reason`"
					v-slot="{ classes, errors }"
				>
					<b-form-input
						@change="onReasonChange($event, index, item)"
						:class="classes"
						:name="`parentEntity.exceptionalDates[${index}].reason`"
						:disabled="!isAllowedToEdit || !item.id || isLoading[index]"
						:readonly="!isAllowedToEdit"
						v-model="item.reason"
					></b-form-input>
					<small :class="classes">{{ errors[0] }}</small>
				</ValidationProvider>
			</b-col>
			<b-col sm="12" md="3" lg="2" v-if="enableIsOpeningRange">
				<label class="label">Ouvert - Fermé</label>
				<ValidationProvider
					name="Ouverture/Fermeture exceptionnelle"
					rules="min:3"
					:ref="`parentEntity.exceptionalDates[${index}].isOpeningRange`"
					v-slot="{ classes, errors }"
				>
					<b-form-select
						@change="onOpenCloseChange(item, index)"
						:options="openCloseDate"
						:class="classes"
						:name="`parentEntity.exceptionalDates[${index}].isOpeningRange`"
						:disabled="!isAllowedToEdit || isLoading[index]"
						:readonly="!isAllowedToEdit"
						v-model="item.isOpeningRange"
					></b-form-select>
					<small :class="classes">{{ errors[0] }}</small>
				</ValidationProvider>
			</b-col>
			<b-col
				sm="2"
				md="2"
				lg="2"
				v-if="isAllowedToEdit"
				class="remove-opening-range"
			>
				<i
					v-if="!isLoading[index]"
					class="fas fa-trash remove-item-action"
					@click="onExceptionalDateRemove(item)"
					title="Supprimer cette plage horaire"
				></i>
				<i
					v-else
					class="fas fa-fan remove-item-action"
					title="Traitement en cours..."
				></i>
			</b-col>
		</b-row>
		<b-row v-if="isAllowedToEdit">
			<div
				class="float-left add-item-action ml-3 my-3"
				@click="onExceptionalDateAdd"
			>
				<i class="fas fa-plus"></i> Ajouter des horaires exceptionnels
			</div>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref} from "vue";
//import { extend } from "vee-validate";

import {useStore} from "vuex";
import {openCloseDate as openCloseDateData} from "@/Interface/partnershipFolderDatas";
import {dateHelpers, validateSection} from "@/helpers";
import {useDP} from "@/mixins/useDP";

//extend("checkPeriodDates", validateSection.checkPeriodDates);

const store = useStore();
const {allowedToEdit} = useDP();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(() => store.state.account.currentPartner);

const props = defineProps([
	"parentEntityName",
	"parentEntityPath",
	"allowedToEdit",
	"enableIsOpeningRange",
	"enableReason",
	"size",
	"displayEntitle",
	"isOpeningRange",
]);

const isAllowedToEdit = computed(() => {
	return (
		(undefined !== allowedToEdit && allowedToEdit) ||
		(undefined === allowedToEdit && identity.value.allowedToEdit)
	);
});

const parentEntity = computed(() => {
	let entity = this;
	props.parentEntityPath
		.split(".")
		.forEach((offset: string | number) => {
			if(entity){
				entity = entity[offset];
			}
		});
	return entity;
});

const openCloseDate = ref(openCloseDateData);
let previousEditedValue = ref(null);
let exceptionalDates = ref([]);
const exceptionalOpeningRanges = ref([]);
const isLoading = ref([]);
let timestamp = ref(0);

const updatePartnerPropertyFromForm = () =>
	store.dispatch("account/updatePartnerPropertyFromForm");
const deletePartnerPropertyFromForm = () =>
	store.dispatch("account/deletePartnerPropertyFromForm");

const onFocus = (event: { target: { value: any } }) => {
	previousEditedValue = event.target.value;
};
const onReasonChange = (
	event: { target: { value: null } },
	index: string | number,
	data: { reason: any; openingRange: any; payload: { reason: any } }
) => {
	if (previousEditedValue.value !== event.target.value) {
		isLoading[index] = true;
	}

	const openingRanges = [];
	const period = exceptionalDates[index];
	const startDate = new Date(period.startDate);
	const endDate = period.endDate ? new Date(period.endDate) : startDate;
	let nextDate = startDate;
	while (0 >= nextDate - endDate) {
		const openingRange = findOpeningRangeByDate(
			nextDate,
			period.isOpeningRange
		);
		openingRange.reason = data.reason;
		openingRanges.push(openingRange);
		nextDate = dateHelpers.getNextDayDate(nextDate);
	}

	Promise.all(
		openingRanges.map((openingRange) => {
			data.openingRange = openingRange;
			data.payload = {
				reason: openingRange.reason,
			};
			updatePartnerPropertyFromForm({data});
		})
	).finally(() => {
		isLoading[index] = false;
		refreshTimestamp();
	});
};
const onExceptionalDateAdd = () => {
	exceptionalDates.value.push({
		startDate: null,
		endDate: null,
		isOpeningRange: undefined === isOpeningRange || isOpeningRange,
	});
};
const onExceptionalStartDateChange = (
	period: { endDate: any; startDate: any },
	index: any
) => {
	if (!period.endDate) {
		period.endDate = period.startDate;
	}

	if (!isPeriodDatesValid(period, index)) {
		return;
	}

	onExceptionalDateChange(index);
};
const onExceptionalEndDateChange = (
	period: { startDate: any; endDate: any },
	index: any
) => {
	if (!period.startDate) {
		period.startDate = period.endDate;
	}

	if (!isPeriodDatesValid(period, index)) {
		return;
	}

	onExceptionalDateChange(index);
};
const onExceptionalDateChange = (index: string | number) => {
	const newOpeningRanges: { date: string; isOpeningRange: any }[] = [];
	const parentId = parentEntity.value["@id"];
	isLoading[index] = true;
	refreshTimestamp();

	// Manage new exceptional dates to add
	exceptionalDates.value.forEach((period) => {
		if (!period.startDate || !period.endDate) {
			return;
		}

		const startDate = new Date(period.startDate);
		const endDate = period.endDate ? new Date(period.endDate) : startDate;
		let nextDate = startDate;

		while (0 >= nextDate - endDate) {
			if (!findOpeningRangeByDate(nextDate, period.isOpeningRange)) {
				const newOpeningRange = {
					date: new Date(nextDate).toISOString(),
					isOpeningRange: period.isOpeningRange,
				};
				newOpeningRange[parentEntityName] = parentId;
				newOpeningRanges.push(newOpeningRange);
			}
			nextDate = dateHelpers.getNextDayDate(nextDate);
		}
	});

	// Manage useless exceptional dates to remove
	const oldOpeningRanges: any[] = [];
	getExceptionalOpeningRanges().forEach((openingRange: any) => {
		if (!isOpeningRangeSelected(openingRange)) {
			oldOpeningRanges.push(openingRange);
		}
	});

	Promise.all([
		...newOpeningRanges.map((openingRange) =>
			updatePartnerPropertyFromForm({
				data: {
					openingRange,
					parentEntityName: parentEntityName,
				},
				showNotification: false,
			})
		),
		...oldOpeningRanges.map((openingRange) =>
			deletePartnerPropertyFromForm({
				data: {
					openingRange,
					parentEntityName: parentEntityName,
				},
				showNotification: false,
			})
		),
	])
		.then(() => onUpdateSuccessed())
		.catch((err) => onUpdateFailed(err))
		.finally(() => {
			isLoading[index] = false;
			refreshTimestamp();
		});
};
const onOpenCloseChange = (
	period: {
		startDate: string | number | Date;
		endDate: string | number | Date;
		isOpeningRange: any;
	},
	index: any
) => {
	if (!isPeriodDatesValid(period, index)) {
		return;
	}

	const startDate = new Date(period.startDate);
	const endDate = period.endDate ? new Date(period.endDate) : startDate;
	let nextDate = startDate;
	const openingRangesToRemove = [];

	while (0 >= nextDate - endDate) {
		const openingRange = findOpeningRangeByDate(
			nextDate,
			!period.isOpeningRange
		);
		if (openingRange) {
			openingRange.isOpeningRange = period.isOpeningRange;
			openingRangesToRemove.push(openingRange);
		}
		nextDate = dateHelpers.getNextDayDate(nextDate);
	}

	Promise.all(
		openingRangesToRemove.map((openingRange) => {
			updatePartnerPropertyFromForm({
				data: {
					offset: "isOpeningRange",
					value: openingRange.isOpeningRange,
					openingRange,
					parentEntityName: parentEntityName,
				},
				showNotification: false,
			});
		})
	)
		.then(() => onUpdateSuccessed())
		.catch((err) => onUpdateFailed(err))
		.finally(() => refreshTimestamp());
};
const onExceptionalDateRemove = (period: {
	startDate: string | number | Date;
	endDate: string | number | Date;
	isOpeningRange: any;
}) => {
	const startDate = new Date(period.startDate);
	const endDate = period.endDate ? new Date(period.endDate) : startDate;
	let nextDate = startDate;
	const openingRangesToRemove = [];

	while (0 >= nextDate - endDate) {
		const openingRange = findOpeningRangeByDate(
			nextDate,
			period.isOpeningRange
		);
		if (openingRange) {
			openingRangesToRemove.push(openingRange);
		}
		nextDate = dateHelpers.getNextDayDate(nextDate);
	}

	Promise.all(
		openingRangesToRemove.map((openingRange) =>
			deletePartnerPropertyFromForm({
				data: {
					openingRange,
					parentEntityName: parentEntityName,
				},
				showNotification: false,
			})
		)
	)
		.then(() => onUpdateSuccessed())
		.catch((err) => onUpdateFailed(err))
		.finally(() => refreshTimestamp());
};
const initializeOpeningRanges = () => {
	let exceptionalDates: any[] = [];
	let periodIndex = 0;
	[true, false].forEach((isOpeningRange) => {
		const openingRanges = getExceptionalOpeningRanges(isOpeningRange);
		let nextDate: number | Date | null = null;
		const initializePeriod = function (item: { date: string | number | Date }) {
			const currentDate = new Date(item.date);
			exceptionalDates[periodIndex] = {
				...item,
				startDate: currentDate,
				endDate: currentDate,
			};
			nextDate = dateHelpers.getNextDayDate(currentDate);
		};

		if(openingRanges){
			openingRanges.forEach((item: { date: string | number | Date }) => {
				const currentDate = new Date(item.date);
				if (null === nextDate) {
					// Initialize first start date with first date
					initializePeriod(item);
					return;
				}

				if (0 === currentDate - nextDate) {
					// if the next date is this current date, so it could be the end date of this period.
					exceptionalDates[periodIndex].endDate = item.date;
					nextDate = dateHelpers.getNextDayDate(currentDate);
				} else {
					// otherwise, the current date is a start date of a new period.
					periodIndex++;
					initializePeriod(item);
				}
			});
		}


		if (exceptionalDates.length) {
			periodIndex++;
		}
	});

	exceptionalDates = exceptionalDates.sort(
		(a, b) => new Date(a.startDate) - new Date(b.startDate)
	);
};
const findOpeningRangeByDate = (
	date: string | number | Date,
	isOpeningRange: boolean
) => {
	const timestamp = new Date(date).getTime();
	return getExceptionalOpeningRanges().find(
		(item: { date: string; isOpeningRange: any }) =>
			new Date(item.date.replace(/T.*/, "")).getTime() === timestamp &&
			item.isOpeningRange === isOpeningRange
	);
};
const getExceptionalOpeningRanges = (
	isOpeningRange: boolean | null | undefined
) => {
	if(parentEntity.value){
		parentEntity.value.openingRanges
			.filter(
				(item: { date: any; isOpeningRange: any }) =>
					!!item.date &&
					(null === isOpeningRange ||
						undefined === isOpeningRange ||
						isOpeningRange === item.isOpeningRange)
			)
			.sort(
				(
					a: { date: string | number | Date },
					b: { date: string | number | Date }
				) => new Date(a.date) - new Date(b.date)
			);
	}
};
const isPeriodDatesValid = (
	period: {
		startDate: string | number | Date;
		endDate: string | number | Date;
		isOpeningRange: any;
	},
	indexToExclude: number
) => {
	if (!period.startDate || !period.endDate) {
		return false;
	}

	const startDate = new Date(period.startDate).getTime();
	const endDate = new Date(period.endDate).getTime();
	const isOpen = period.isOpeningRange;

	if (startDate > endDate) {
		return false;
	}

	const hasConflict = exceptionalDates.value.some((item, index) => {
		// Ignore this itself item (this item is the same as the given period)
		if (index === indexToExclude) {
			return false;
		}

		// Ignore this item => it's a not already saved new one
		if (!item.startDate || !item.endDate) {
			return false;
		}

		const itemStartDate = new Date(item.startDate).getTime();
		const itemEndDate = new Date(item.endDate).getTime();

		return (
			item.isOpeningRange === isOpen &&
			((itemStartDate <= endDate && endDate <= itemEndDate) || // the given period endDate is inside this item range
				(itemStartDate <= startDate && startDate <= itemEndDate) || // the given period startDate is inside this item range
				(startDate <= itemStartDate && itemEndDate <= endDate)) // the given period includes this item range
		);
	});

	if (hasConflict) {
		store.dispatch(
			"alert/error",
			{
				group: "general-error",
				message:
					"Vous avez des conflits dans la période sélectionnée.<br /><strong>Enregistrement impossible !</strong>",
				show: true,
				title: "Période en chevauchement",
				type: "error",
			},
			{root: true}
		);
	}

	return !hasConflict;
};
const isOpeningRangeSelected = (openingRange: {
	date: string;
	isOpeningRange: any;
}) => {
	const timestamp = new Date(openingRange.date.replace(/T.*/, "")).getTime();

	return exceptionalDates.value.some((period) => {
		const startTimestamp = new Date(period.startDate).getTime();
		const endTimestamp = period.endDate
			? new Date(period.endDate).getTime()
			: startTimestamp;

		return (
			timestamp >= startTimestamp &&
			timestamp <= endTimestamp &&
			period.isOpeningRange === openingRange.isOpeningRange
		);
	});
};
const onUpdateSuccessed = () => {
	initializeOpeningRanges();
	store.dispatch(
		"alert/success",
		{
			group: "general-error",
			type: "success",
			message: "Donnée sauvegardée !",
			show: true,
			title: "Envoyé !",
		},
		{root: true}
	);
};
const onUpdateFailed = (err: any) => {
	console.error(err);
	store.dispatch(
		"alert/error",
		{
			group: "general-error",
			message: "Impossible de mettre à jour les informations du partenaire.",
			show: true,
			title: "Erreur",
			type: "error",
		},
		{root: true}
	);
};
const refreshTimestamp = () => {
	timestamp = new Date().getTime();
};

onMounted(() => {
	refreshTimestamp();
	nextTick(() => {
		initializeOpeningRanges();
	});
});
</script>
