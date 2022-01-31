import onboardingHttpClient from "@/services/onboarding.service.js";
import store from "@/store";

//holds the state properties
const state = {
    profile: {
        name: "",
        email: "",
        phone_number: "",
        photo: null,
        role: "",
        status: "",
        has_bank_account: false,
        location: {},
        id: ""
    },
    allowSellerToSell: true,
    kycSubmitLoader: false,
};

//returns the state properties
const getters = {
    profile: state => state.profile,
};

//fetch data 
const actions = {

    // get profile informations
    getUserProfile(context) {
        return new Promise((resolve, reject) => {

            onboardingHttpClient.get("profile").then(response => {
                context.commit("setUserProfile", response.data.data);
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        })
    },
    // edit user profile
    editUserProfile(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("profile", data).then(response => {
                context.commit("setUserProfile", response.data.data)
                store.commit("setAccessToken", response.data.token);
                resolve(response);
            })
                .catch(error => {
                    reject(error);
                })
        });
    },
    // reset password
    resetPassword(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("security/password", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing")
                    reject(error);
                })
        });
    },
    addKYC(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post(`sellers/kyc`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    getKYCDetails(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.get(`sellers/kyc/${data.seller_id}`).then(response => {
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
    setUserProfile: (state, data) => (state.profile = data),
    setSellerStatus: (state, status) => (state.allowSellerToSell = status),
    setKycSubmitLoader: (state, status) => (state.kycSubmitLoader = status),
    doNothing: (state) => (state.doNothing = null)
};


export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};  