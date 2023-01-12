import type { AlertStore } from "./typings/alertStore";

const defaultDuration = 10000;

const state = {
  duration: defaultDuration,
  group: null,
  message: null,
  show: false,
  title: null,
  type: null,
} as AlertStore;

const actions = {
  success({ commit } : any, options: any) {
    commit("success", options);
  },
  error({ commit } : any, options : any) {
    commit("error", options);
  },
  warn({ commit } : any, options : any) {
    commit("warn", options);
  },
  clear({ commit } : any) {
    commit("clear");
  },
};

const mutations = {
  success(state : any, options : any) {
    state.duration = options.duration || defaultDuration;
    state.group = options.group;
    state.message = options.message;
    state.show = true;
    state.title = options.title;
    state.type = "success";
  },
  error(state : any, options : any) {
    state.duration = options.duration || defaultDuration;
    state.group = options.group;
    state.message = options.message;
    state.show = true;
    state.title = options.title;
    state.type = "error";
  },
  warn(state: any, options: any) {
    state.duration = options.duration || defaultDuration;
    state.group = options.group;
    state.message = options.message;
    state.show = true;
    state.title = options.title;
    state.type = "warn";
  },
  clear(state : any) {
    state.duration = defaultDuration;
    state.group = null;
    state.message = null;
    state.show = false;
    state.title = null;
    state.type = null;
  },
  disableNotify(state: any) {
    state.show = false;
  },
};

export const alert = {
  namespaced: true,
  state,
  actions,
  mutations,
};
