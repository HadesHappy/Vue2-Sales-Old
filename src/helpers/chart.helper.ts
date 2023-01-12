export const chartsHelper = {
	fromLabelToColor,
};

const sourcesColors: { [key: string]: string } = {
	"Sites affluents": "#F7A600",
	"Accès Direct": "#FFA5DA",
	Moteurs: "#E40087",
	Webmails: "#F8D38F",
};

function fromLabelToColor(englishLabel: string) {
	return sourcesColors[englishLabel];
}
