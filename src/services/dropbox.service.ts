import {requestHelpers} from "@/helpers";
import {isFileAuthorized} from "@/helpers/file.helper";

export const dropboxService = {
	uploadFile,
	downloadFile,
	getFolder,
};

function getFolder(customerCode : any, companyName : any, subFolder = null, recent : boolean|null = null) {
	return requestHelpers.securedAxiosInstance.get(
		`${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/dropbox/folder`,
		{
			params: {
				customerCode: customerCode,
				companyName: companyName,
				subFolder: subFolder,
				recent: recent || false,
			},
		}
	);
}

function uploadFile(folderName : any, subFolder : any, file : any, message : any) {
	if (!isFileAuthorized(file)) {
		return Promise.reject("Le fichier envoyé n'est pas autorisé.");
	}

	const url = `${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/dropbox/file`;
	const fileName = file.name
		.replace(/[^a-zA-Z0-9_\.-]/g, "_")
		.replace(/_+/g, "_");
	const formData = new FormData();
	formData.append("file", file, fileName);
	formData.append("folderName", folderName);
	formData.append("subFolder", subFolder);
	formData.append("message", message);
	return requestHelpers.securedAxiosInstance.post(url, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

function downloadFile(customerCode: any, companyName: any, subFolder: any, filename : any) {
	filename = filename.replace(/[^a-zA-Z0-9_\.-]/g, "_").replace(/_+/g, "_");
	return requestHelpers.securedAxiosInstance.get(
		`${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/dropbox/file/${filename}`,
		{
			params: {
				customerCode: customerCode,
				companyName: companyName,
				subFolder: subFolder,
			},
			responseType: "blob",
		}
	);
}
