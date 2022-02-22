import axios from "@/services/dashboard.service.js";
import setItemPerPage from "@/helpers/general.js";

const state = {
    reward: { data: [] },
    rewardHistory: [],
    redeem_airtime: [],
    page: 1,
    itemPerPage: 15,
    pageDetails: {},
};
const getters = {
    getRewards: (state) => {
        return state.reward
    }
};
const actions = {
    getReward(context) {
        return new Promise((resolve, reject) => {
            axios.get("/reward")
                .then(response => {
                    context.commit("setRewards", response.data)
                    resolve(response.data)

                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    redeemReward(context) {
        let redeemAirtime = (state.redeem_airtime !== "") ? `?reward_id=${state.redeem_airtime}` : ""
        return new Promise((resolve, reject) => {
            axios.post(`/reward/get${redeemAirtime}`)
                .then(response => {
                    context.commit("setRewards", response.data.data)
                    resolve(response.data.data)

                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    getHistory(context) {
        return new Promise((resolve, reject) => {
            axios.get("/reward/history")
                .then(response => {
                    context.commit("setHistory", response.data.data)
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

};
const mutations = {
    setRewards: (state, data) => {
        state.reward = data
    },
    setHistory: (state, status) => {
        state.rewardHistory = status
    },
    setRedeemAirtime: (state, value) => {
        state.redeem_airtime = value
    },
    setPageDetails: (state, data) => (state.pageDetails = data),
    setItemPerPage: (state, itemPerPage) => {
        state.itemPerPage = itemPerPage;
        let page = setItemPerPage(itemPerPage, state.pageDetails.per_page, state.pageDetails.from);
        state.page = page;
    },
    setPage: (state, page) => (state.page = page),
};
export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};