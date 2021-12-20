import referralHttpClient from "@/services/dashboard.service.js";
import paymentHttpClient from "@/services/bank.service.js";

const state = {
    totalReferralEarnings: { total_reward: null },
    referralEarningList: [],
    referralEarningsPageDetails: {
        current_page: 1
    },
    referralList: [],
    searchReferral: [],
    referralPageDetails: {
        current_page: 1
    },
};
const getters = {};
const actions = {
    getTotalReferralEarnings(context) {
        return new Promise((resolve, reject) => {
            paymentHttpClient.get(`referral/total-reward`).then((response) => {
                context.commit("setTotalReferralEarnings", response.data.data);
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        })
    },
    getReferralEarningList(context) {
        return new Promise((resolve, reject) => {
            referralHttpClient.get(`referral/earnings?page=${state.referralEarningsPageDetails.current_page}`).then((response) => {
                context.commit("setReferralEarningList", response.data.data);
                context.commit("setReferralEarningsPageDetails", response.data.meta);
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    getReferralList(context) {
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");

        return new Promise((resolve, reject) => {
            referralHttpClient.get(`/referral?${page}&${perPage}`).then((response) => {
                context.commit('setReferral', response.data.data)
                context.commit("setReferralPageDetails", response.data.meta);
                resolve(response.data.data)
            })
                .catch((error) => {
                    context.commit('error', error)
                    reject(error.response)
                })
        })
    },

    getTotalReferral(context) {
        return new Promise((resolve, reject) => {
            referralHttpClient.get('/referral/total').then((response) => {
                context.commit('setReferral', response.data.data)
                resolve(response.data.data)
            })
                .catch((error) => {
                    context.commit('error', error)
                    reject(error.response)
                })
        })
    },

    getSearchReferral(context) {
        let referralSearch = ((state.searchReferral !== '') ? `query=${state.searchReferral}` : "");
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");

        return new Promise((resolve, reject) => {
            referralHttpClient.get(`/referral/search?${referralSearch}&${page}&${perPage}`).then((response) => {
                context.commit('setReferral', response.data.data)
                context.commit("setReferralPageDetails", response.data.meta);
                resolve(response.data.data)
            })
                .catch((error) => {
                    context.commit('error', error)
                    reject(error.response)
                })
        })
    },
};
const mutations = {
    //referral Earnings details
    setTotalReferralEarnings: (state, totalEarnings) => (state.totalReferralEarnings = totalEarnings),
    setReferralEarningList: (state, earningList) => (state.referralEarningList = earningList),
    setReferralEarningsPageDetails:  (state, referralEarningsPageDetails) => (state.referralEarningsPageDetails = referralEarningsPageDetails),
    setReferralEarningsPage: (state, page) => (state.referralEarningsPageDetails.current_page = page),
    //view referral details
    setReferralPageDetails: (state, referralPageDetails) => (state.referralPageDetails = referralPageDetails),
    setPage: (state, page) => (state.referralPageDetails.current_page = page),
    setReferral: (state, data) => state.referralList = data,
    filterByName: (state, data) => state.searchReferral = data,
};

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};