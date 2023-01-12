import router from "@/router";
import {encryptorHelpers, requestHelpers, authDpHelper} from "@/helpers";
import {salesforceService} from "@/services";
import {getParsedLocalStorageItem} from "@/helpers/localStorage.helper";
import {store} from "@/store";

export const userService = {
	changePassword,
	checkToken,
	impersonateLogin,
	impersonateLogout,
	login,
	logout,
	me,
	refreshToken,
};

function changePassword(userId, data, token) {
	return requestHelpers.axiosInstance.patch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`,
		data,
		{
			headers: {
				Accept: "application/json",
				"Content-Type": "application/merge-patch+json",
				Authorization: "Bearer " + token,
			},
		}
	);
}

function checkToken() {
	const user = getParsedLocalStorageItem("user");
	if (user && user.access_token) {
		try {
			console.log(user.access_token);
			//const verify = encryptorHelpers.verifyToken(user.access_token);

			return true;
		} catch (error) {
			if ("TokenExpiredException" === error.name) {
				return refreshToken();
			} else {
				console.error(error);
			}
		}
	}

	return null;
}

function impersonateLogin(userId, email) {
	return requestHelpers.securedAxiosInstance
		.post(
			`${
				import.meta.env.VITE_API_BASE_URL
			}/api/users/${userId}/impersonate`,
			{email}
		)
		.then((impersonatedUser) => {
			if (impersonatedUser.access_token) {
				localStorage.setItem(
					"impersonatedUser",
					JSON.stringify(impersonatedUser)
				);
			}

			return impersonatedUser;
		});
}

function impersonateLogout() {
	localStorage.removeItem("impersonatedUser");
}

function me() {
	localStorage.removeItem("partnerHistoryContext");
	return requestHelpers.securedAxiosInstance
		.get(import.meta.env.VITE_API_BASE_URL + "/api/users/about/me")
		.then((pfUser) => {
			pfUser.allowedToEdit = authDpHelper.hasRoleToEditPartnerFolder(pfUser);
			localStorage.setItem("identity", JSON.stringify(pfUser));
			if (!authDpHelper.isUser(pfUser)) {
				const salesforceUser = getParsedLocalStorageItem("salesforceUser");
				if (salesforceUser && salesforceUser.Username === pfUser.email) {
					pfUser.salesforceUser = salesforceUser;
					return pfUser;
				}
				return salesforceService
					.getUserByUsername(pfUser.email)
					.then((sfUser) => {
						if (sfUser && sfUser.totalSize > 0) {
							pfUser.salesforceUser = sfUser.records[0];
							localStorage.setItem(
								"salesforceUser",
								JSON.stringify(pfUser.salesforceUser)
							);
						}

						return pfUser;
					});
			}

			return pfUser;
		});
}

function login(username, password) {

	return requestHelpers.axiosInstance
		.post(
			import.meta.env.VITE_LOCALETMOI_BASE_URL +
			"/localfr-api/generate-user-token",
			{
				username,
				password,
			}
		)
		.then((user) => {
			// login succesful if there is a token
			if (user.access_token) {
				localStorage.setItem("user", JSON.stringify(user));
			}

			return user;
		});
}

function refreshToken() {
	const user = getParsedLocalStorageItem("user");
	return requestHelpers.axiosInstance
		.post(
			import.meta.env.VITE_LOCALETMOI_BASE_URL +
			"/localfr-api/refresh-user-token",
			{
				user,
			}
		)
		.then((user) => {
			// refresh successfull if there is a token
			if (user.data.access_token) {
				localStorage.setItem("user", JSON.stringify(user.data));
				store.dispatch("account/setRefreshTokenTtl", user.expires);
				store.commit("account/updateUser", user.data);
			}
			return user;
		});
}

function logout() {
	// remove user from local storage to log user out
	localStorage.clear();
	router.push("/authentification");
}
