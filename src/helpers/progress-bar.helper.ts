export const progressBar = {
	getPercentagePerFile,
};

function getPercentagePerFile(fileLength: number) {
	return 100 / fileLength;
}
