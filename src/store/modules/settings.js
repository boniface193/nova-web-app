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
        axios.get("profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(response => {
            context.commit("setUserProfile", response.data.data)
        })
    },
    // edit user profile
    editUserProfile(context, data) {
        return new Promise((resolve, reject) => {
            axios.post("profile", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then(response => {
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
            axios.post("security/password", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }).then(response => {
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