import axios from "../../axios/reward"

const state = {
    leaderboard: []
};
const getters = {
leaderboard: state => state.leaderboard
};
const actions = {
    getLeaderboard(context) {
        return new Promise((resolve, reject) => {
            axios.get("/leaderboard/seller", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
                .then(response => {
                    context.commit("setLeaderboard", response.data.data)
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response.data.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // search Leaserboard
    searchLeaderBoard(context) {
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let route = (state.searchValue !== "") ? `/search?query=${state.searchValue}&${page}&${perPage}` : ""
        return new Promise((resolve, reject) => {
            axios.get(`/leaderboard/seller${route}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }).then(response => {
                    context.commit("setLeaderboard", response.data.data);
                    console.log(response.data)
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response.data.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },

};
const mutations = {
    setLeaderboard: (state, data) => state.leaderboard = data

};
export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};