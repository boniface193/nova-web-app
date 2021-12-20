import axios from "../../services/dashboard.service.js";
import orderService from "../../services/order.service.js";
import payment from "../../services/bank.service.js";
import moment from "moment"

// const setItemPerPage = (itemPerPage, per_page, from_page) => {
//     let page = null;
//     if (itemPerPage > per_page) {
//         let range = Math.round(
//             (from_page - 1) / per_page
//         );
//         if (range < 0.5) {
//             page = range + 1;
//             return page;
//         } else {
//             page = range;
//             return page;
//         }
//     } else {
//         page = Math.round(
//             (from_page - 1) / itemPerPage + 1
//         );
//         return page
//     }
// }

const state = {
    dashboardItems: [],
    // page: 1,
    // itemPerPage: null,
    // pageDetails: {},
    dateRange: {
        startDate: moment(new Date()).format("L"),
        endDate: moment(new Date()).format("L"),
    },
    // referralList: [],
    // searchReferral: [],
};

const getters = {
    dashboard: state => state.dashboardItems,
    getReferrals: state => state.referralList

};

const actions = {
    getSellerPoint(context) {
        return new Promise((resolve, reject) => {
            axios.get('/leaderboard/seller/dashboard').then((response) => {
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
            axios.get(`/leaderboard/seller/dashboard?${dateRange}`).then((response) => {
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
            axios.get('/leaderboard/seller/rank').then((response) => {
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
            axios.get(`/leaderboard/seller/rank?${dateRange}`).then((response) => {
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
            orderService.get('/metrics/seller-total-sales').then((response) => {
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
            orderService.get(`/metrics/seller-total-sales?${dateRange}`).then((response) => {
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
            payment.get(`/metrics/${data.id}/total-revenue?${dateRange}`).then((response) => {
                context.commit('setDashboard', response.data.data)
                resolve(response.data.data)
            })
                .catch((error) => {
                    context.commit('error', error)
                    reject(error.response)
                })
        })
    },

    // getReferralList(context) {
    //     let page = ((state.page) ? `page=${state.page}` : "");
    //     let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");

    //     return new Promise((resolve, reject) => {
    //         axios.get(`/referral?${page}&${perPage}`).then((response) => {
    //             context.commit('setReferral', response.data.data)
    //             context.commit("setPageDetails", response.data.meta);
    //             resolve(response.data.data)
    //         })
    //             .catch((error) => {
    //                 context.commit('error', error)
    //                 reject(error.response)
    //             })
    //     })
    // },

    // getTotalReferral(context) {
    //     return new Promise((resolve, reject) => {
    //         axios.get('/referral/total').then((response) => {
    //             context.commit('setReferral', response.data.data)
    //             resolve(response.data.data)
    //         })
    //             .catch((error) => {
    //                 context.commit('error', error)
    //                 reject(error.response)
    //             })
    //     })
    // },

    // getSearchReferral(context) {
    //     let referralSearch = ((state.searchReferral !== null) ? `query=${state.searchReferral}` : "");
    //     let page = ((state.page) ? `page=${state.page}` : "");
    //     let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");

    //     return new Promise((resolve, reject) => {
    //         axios.get(`/referral/search?${page}&${perPage}&${referralSearch}`).then((response) => {
    //             context.commit('setReferral', response.data.data)
    //             resolve(response.data.data)
    //         })
    //             .catch((error) => {
    //                 context.commit('error', error)
    //                 reject(error.response)
    //             })
    //     })
    // },

};

const mutations = {
    setDashboard: (state, data) => state.dashboardItems = data,
    filterRange(state, dateRange) {
        state.dateRange = dateRange
    },
    setReferral: (state, data) => state.referralList = data,
    filterByName: (state, data) => state.searchReferral = data,
    // setItemPerPage(state, itemPerPage) {
    //     state.itemPerPage = itemPerPage;
    //     let page = setItemPerPage(itemPerPage, state.pageDetails.per_page, state.pageDetails.from);
    //     state.page = page;
    // },
    // setPage(state, page) {
    //     state.page = page
    // },
    // setPageDetails(state, data) {
    //     state.pageDetails = data
    // },


};

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}