import {createStore} from "vuex";

import {alert} from "./alert.store";
import {account} from "./account.store";
import {globalStore} from "./global.store";

export const store = createStore({
	modules: {
		account,
		alert,
		globalStore,
	},
});
