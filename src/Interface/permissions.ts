export const allowedRolesToEditPartnerFolder = [
	"ROLE_SALESMAN",
	"ROLE_CRP",
	"ROLE_MANAGER",
	"ROLE_DEV_ADMIN",
	"ROLE_SUPER_ADMIN",
];

export const allowedRolesToTransmitPartnerFolder = [
	{
		status: "salesman",
		step: 1,
		roles: [
			"Commercial",
			"Directeur Régional",
			"Directeur Commercial",
			"Chef de Groupe",
			"Directeur d'Agence",
			"charge_relations_partenaires",
		],
	},
	{
		status: "assistant",
		step: 2,
		roles: ["Assistante Commerciale"],
	},
	{
		status: "planning",
		step: 3,
		roles: ["Planification"],
	},
	{
		status: "cpw",
		step: 4,
		roles: [
			"CPW",
			"CPW & SAV",
			"Chargé de Référencement",
			"Graphiste",
			"Chargé E-commerce",
			"chargée d'ordonnancement",
			"Coach Graphiste",
			"Coach E-commerce",
			"Coach traffic Manager",
			"Coach CPW",
			"Coach CPW & SAV",
			"Manager",
		],
	},
];

export const byPassRulesToEditDP = ["SI", "Marketing", "Développeur"];
