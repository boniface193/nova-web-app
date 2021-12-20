import bankServiceHttpClient from "@/services/bank.service.js";

//holds the state properties
const state = {
    bankList: [],
    //accountDetails: {},
    doNothing: null,
};
//returns the state properties
const getters = {
    bankList: state => state.bankList,
    //accountDetails: state => state.accountDetails,
};

//take actions 
const actions = {
    // get bank list
    getBankList(context) {
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.get("/banks").then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    validateBankAccount(context, data) {
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.post("/banks/verify-account", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    setAccountDetails(context, data) {
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.post("/bank-accounts", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    getUserBankDetails(context, data) {
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.get(`/bank-accounts/${data.user_id}`).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    getWithdrawalFees() {
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.post("/settlements/withdrawal-fees",
                {}).then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    withdrawFunds(context) {
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.post("/settlements/withdraw", {}).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    withdrawReferralEarning(context) {
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.post("referral/withdraw-earnings", {}).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    getRevenueDetails(context, data) {
        // let dateRange = (state.dateRange.endDate !== null) ? `date_between=${state.dateRange.startDate},${state.dateRange.endDate}` : ""
        return new Promise((resolve, reject) => {
            bankServiceHttpClient.get(`/metrics/${data.sellerId}/total-revenue`)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    context.commit("doNothing");
                    reject(error)
                });
        })
    },
};

//updates the different state properties
const mutations = {
    // commit nothing
    doNothing: (state) => (state.doNothing = null),
    setBankList: (state, bankList) => (state.bankList = bankList),
    //setAccountDetails: (state, accountDetails) => (state.accountDetails = accountDetails),
};

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};