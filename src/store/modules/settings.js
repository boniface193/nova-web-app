import axios from "@/axios/onboarding.js";

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
        id: ""
    },
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
            
            axios.get("profile").then(response => {
                context.commit("setUserProfile", response.data.data);
                resolve(response);
            }).catch((error)=>{
                reject(error);
            })
        })
    },
    // edit user profile
    editUserProfile(context, data) {
        return new Promise((resolve, reject) => {
            axios.post("profile", data).then(response => {
                context.commit("setUserProfile", response.data.data)
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
            axios.post("security/password", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing")
                    reject(error);
                })
        });
    },
};

//updates the different state properties
const mutations = {
    setUserProfile: (state, data) => (state.profile = data),
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