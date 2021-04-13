import axios from "../../axios/dashboard"
import orderService from "../../axios/order"
import payment from "../../axios/bankServices"
import moment from "moment"

const state = {
    dashboardItems: [],
    dateRange: {
        startDate: moment(new Date()).format("L"),
        endDate: moment(new Date()).format("L"),
    },
};

const getters = {
    dashboard: state => state.dashboardItems

};

const actions = {
    getSellerPoint(context) {
        return new Promise((resolve, reject) => {
            axios.get('/leaderboard/seller/dashboard', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then((response) => {
                context.commit('setDashboard', response.data.data)
                resolve(response.data.data)
            })
                .catch((error) => {
                    context.commit('error', error)
                    reject(error.response)
                })
        })
    },

    searchSellerPoint(context) {
        let dateRange = ((state.dateRange.startDate || state.dateRange.endDate !== null) ? `created_between=${state.dateRange.startDate},${state.dateRange.endDate}` : "");

        return new Promise((resolve, reject) => {
            axios.get(`/leaderboard/seller/dashboard?${dateRange}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then((response) => {
                context.commit('setDashboard', response.data.data)
                resolve(response.data.data)
            }).catch((error) => {
                context.commit('error', error)
                reject(error.response)
            })
        })
    },

    getSellerRank(context) {
        return new Promise((resolve, reject) => {
            axios.get('/leaderboard/seller/rank', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then((response) => {
                context.commit('setDashboard', response.data.data)
                resolve(response.data.data)
            })
                .catch((error) => {
                    context.commit('error', error)
                    reject(error.response)
                })
        })
    },


    searchSellerRank(context) {
        let dateRange = ((state.dateRange.startDate || state.dateRange.endDate !== null) ? `created_between=${state.dateRange.startDate},${state.dateRange.endDate}` : "");

        return new Promise((resolve, reject) => {
            axios.get(`/leaderboard/seller/rank?${dateRange}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then((response) => {
                context.commit('setDashboard', response.data.data)
                resolve(response.data.data)
            }).catch((error) => {
                context.commit('error', error)
                reject(error.response)
            })
        })
    },

    getSellerTotalSale(context) {
        return new Promise((resolve, reject) => {
            orderService.get('/metrics/seller-total-sales', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then((response) => {
                context.commit('setDashboard', response.data.data)
                resolve(response.data.data)
            })
                .catch((error) => {
                    context.commit('error', error)
                    reject(error.response)
                })
        })
    },

    searchSellerTotalSales(context) {
        let dateRange = ((state.dateRange.startDate || state.dateRange.endDate !== null) ? `created_between=${state.dateRange.startDate},${state.dateRange.endDate}` : "");

        return new Promise((resolve, reject) => {
            orderService.get(`/metrics/seller-total-sales?${dateRange}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then((response) => {
                context.commit('setDashboard', response.data.data)
                resolve(response.data.data)
            }).catch((error) => {
                context.commit('error', error)
                reject(error.response)
            })
        })
    },

    getTotalRevenue(context, data) {
        let dateRange = ((state.dateRange.startDate || state.dateRange.endDate !== null) ? `created_between=${state.dateRange.startDate},${state.dateRange.endDate}` : "");

        return new Promise((resolve, reject) => {
            payment.get(`/metrics/${data.id}/total-revenue?${dateRange}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then((response) => {
                context.commit('setDashboard', response.data.data)
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
    setDashboard: (state, data) => state.dashboardItems = data,
    filterRange(state, dateRange) {
        state.dateRange = dateRange
    },


};

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}