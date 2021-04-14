import axios from "../../axios/reward"

const state = {
    reward: []
};
const getters = {

};
const actions = {
    getReward(context) {
        return new Promise((resolve, reject) => {
            axios.get("/reward", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
                .then(response => {
                    context.commit("setRewards", response.data)
                    resolve(response.data)
                    
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        
        redeemReward(context, data) {
            let redeemAirtime = (state.redeem_airtime !== "") ? `?reward_id=${state.redeem_airtime}` : ""
            return new Promise((resolve, reject) => {
                axios.post(`/reward/get${redeemAirtime}`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                })
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
            axios.get("/reward/history", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
                .then(response => {
                    context.commit("setHistory", response.data.data)
                    resolve(response.data.data)
                    console.log(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

};
const mutations = {

};
export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};