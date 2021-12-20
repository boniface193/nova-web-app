import Vue from "vue";
import Vuex from "vuex";
import onboarding from "./modules/onboarding";
import inventory from "./modules/inventory";
import orders from "./modules/orders"
import settings from "./modules/settings";
import reward from "./modules/reward";
import leaderboard from "./modules/leaderboard";
import bankService from "./modules/bankService";
import dashboard from "./modules/dashboard";
import referral from "./modules/referral";

// initial state
const initialState = {
  onboarding: onboarding.state,
  inventory: inventory.state,
  orders: orders.state,
  settings: settings.state,
  reward: reward.state,
  leaderboard: leaderboard.state,
  bankService: bankService.state,
  dashboard: dashboard.state,
  referral: referral.state
}

//Convert object in string 
const COPY = JSON.stringify(initialState);

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    onboarding: onboarding,
    inventory: inventory,
    orders: orders,
    settings: settings,
    reward: reward,
    leaderboard: leaderboard,
    bankService: bankService,
    dashboard: dashboard,
    referral: referral
  },
  mutations: {
    reset(state) {
      //Convert string in object 
      let copyState = JSON.parse(COPY);
      Object.keys(state).forEach(key => {
        Object.assign(state[key], copyState[key]);
      })
    }
  }
});
