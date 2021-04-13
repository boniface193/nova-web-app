import axios from "@/axios/order.js";

// set the number of item you want to show on table
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

//holds the state properties
const state = {
    orders: [],
    searchOrder: false,
    searchValue: "",
    // page: 1,
    // itemPerPage: null,
    pageDetails: {},
    filter: {
        minPrice: 0,
        maxPrice: 0,
        paid: false,
        unpaid: false,
        delivered: false,
        notDelivered: false,
        selectedOptions: [],
    },
    dateRange: {
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    },
    selectedReferences: [],
    doNothing: null,
};
//returns the state properties
const getters = {
    orders(state) {
        return state.orders
    },
    searchOrder(state) {
        return state.searchOrder
    }
};

//take actions 
const actions = {
    getOrders(context) {
        return new Promise((resolve, reject) => {
            axios.get("/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
                .then(response => {
                    context.commit("setOrders", response.data.data)
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response.data.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    filterGetOrders(context) {
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let dateRange = ((state.dateRange.startDate || state.dateRange.endDate !== null) ? `created_between=${state.dateRange.startDate},${state.dateRange.endDate}` : "");
        let priceRange = ((state.filter.maxPrice) ? `price_between=${state.filter.minPrice},${state.filter.maxPrice}` : "");
        let paid = ((state.filter.selectedOptions.includes('paid')) ? `paid=${true}` : "");
        let unpaid = ((state.filter.selectedOptions.includes('unpaid')) ? `unpaid=${true}` : "");
        let delivered = ((state.filter.selectedOptions.includes('delivered')) ? `delivered=${true}` : "");
        let notDelivered = ((state.filter.selectedOptions.includes('notDelivered')) ? `not_delivered=${true}` : "");
        return new Promise((resolve, reject) => {
            axios.get(`/orders?${dateRange}&${priceRange}&${paid}&${unpaid}&${delivered}&${notDelivered}&${perPage}&${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }).then(response => {
                    context.commit("setOrders", response.data.data);
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    // get order details
    getOrdersDetail(context, data) {
        return new Promise((resolve, reject) => {
            axios.get(`/orders/${data.id}`).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    searchOrders(context) {
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let route = (state.searchValue !== "") ? `/search?q=${state.searchValue}&${page}&${perPage}` : ""
        return new Promise((resolve, reject) => {
            axios.get(`/orders${route}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }).then(response => {
                    context.commit("setOrders", response.data.data);
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    // create order
    createOrder(context, data) {
        return new Promise((resolve, reject) => {
            axios.post("/orders", data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }).then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // pay for order
    payForOrder(context, data) {
        return new Promise((resolve, reject) => {
            axios.post(`/orders/${data.id}/pay`, {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }).then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    //verify Payment
    verifyPayment(context, data) {
        return new Promise((resolve, reject) => {
            axios.post(`/orders/${data.orderId}/verify?trx_ref=${data.trx_ref}&trx_id=${data.trx_id}`, data,).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // edit order address
    editOrderAddress(context, data) {
        return new Promise((resolve, reject) => {
            axios.post(`/orders/${data.order_id}/location`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // confirm order
    sendConfirmOrderOTP(context, data) {
        return new Promise((resolve, reject) => {
            axios.post(`/orders/${data.orderId}/confirm-delivery/send-otp`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    submitConfirmOrderOTP(context, data) {
        return new Promise((resolve, reject) => {
            axios.post(`/orders/${data.orderId}/confirm-delivery`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    }

};

//updates the different state properties
const mutations = {
    setOrders(state, data) {
        state.orders = data
    },
    filterOrders(state, filter) {
        state.filter = filter
    },
    filterRange(state, dateRange) {
        state.dateRange = dateRange
    },
    getSearchValue(state, value) {
        state.searchValue = value
    },
    setSearchOrder(state, status) {
        state.searchOrder = status
    },
    setPageDetails(state, data) {
        state.pageDetails = data
    },
    // setItemPerPage(state, itemPerPage) {
    //     state.itemPerPage = itemPerPage ;
    //     let page = setItemPerPage(itemPerPage, state.pageDetails.per_page, state.pageDetails.from);
    //     state.page = page;
    // },
    // setPage(state, page) {
    //     state.page = page
    // },
    // commit nothing
    doNothing: (state) => (state.doNothing = null),
};

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};