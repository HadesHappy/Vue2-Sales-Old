import dayjs from "dayjs";

const months: string[] = [
	"Janvier",
	"Février",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Août",
	"Septembre",
	"Octobre",
	"Novembre",
	"Décembre",
];

export const dateHelpers = {
	format,
	strDateToObject,
	formatDropboxDate,
	dateToStringForInput,
	getNextDayDate,
	formatSFBriefDate,
	usToFrDate,
	fromMonthNumberToLabel,
	toISODate,
	months,
};

function format(dateStr: string) {
	const date = new Date(Date.parse(dateStr));

	return date.toLocaleDateString();
}

function toISODate(date: any) {
	return dayjs(date).format("YYYY-MM-DD");
}

function strDateToObject(stringDate: string) {
	if (!stringDate) {
		return null;
	}

	return new Date(stringDate);
}

function formatDropboxDate() {
	const date = new Date().toLocaleDateString();

	return date.split("/").join(".");
}

function dateToStringForInput(date: string) {
	const formatDate = new Date(date);
	return formatDate.toISOString().substr(0, 10);
}

/**
 * @param {Date} date
 * @returns {Date}
 */
function getNextDayDate(date) {
	date = new Date(date);
	return new Date(date.setDate(date.getDate() + 1));
}

function formatSFBriefDate(date) {
	return date ? dayjs(date).format("DD/MM/YYYY à HH[h]mm") : null;
}

function usToFrDate(date) {
	return date.substr(8, 2) + "/" + date.substr(5, 2) + "/" + date.substr(0, 4);
}

function fromMonthNumberToLabel(monthNumber) {
	return months[monthNumber];
}
