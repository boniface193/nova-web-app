import axios from "../../axios/reward"

// set the number of item you want to show on table
const setItemPerPage = (itemPerPage, per_page, from_page) => {
    let page = null;
    if (itemPerPage > per_page) {
        let range = Math.round(
            (from_page - 1) / per_page
        );
        if (range < 0.5) {
            page = range + 1;
            return page;
        } else {
            page = range;
            return page;
        }
    } else {
        page = Math.round(
            (from_page - 1) / itemPerPage + 1
        );
        return page
    }
}

const state = {
    leaderboard: [],
    searchBoard: false,
    searchValue: "",
    page: 1,
    itemPerPage: 15,
    pageDetails: {},
};
const getters = {
    leaderboard: state => state.leaderboard,
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
                    context.commit("setLeaderboard", response.data)
                    context.commit("setPageDetails", response.data.meta);
                    console.log("leaderboard", response.data)
                    resolve(response.data)
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
                    context.commit("setLeaderboard", response.data);
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },

};
const mutations = {
    setLeaderboard: (state, data) => state.leaderboard = data,
    setSearchLeaderBoard: (state, status) => state.searchBoard = status,
    setSearchValue: (state, value) => state.searchValue = value,
    setPageDetails: (state, data) => (state.pageDetails = data),
    setItemPerPage: (state, itemPerPage) => {
        state.itemPerPage = itemPerPage;
        let page = setItemPerPage(itemPerPage, state.pageDetails.per_page, state.pageDetails.from);
        state.page = page;
    },
    setPage: (state, page) => (state.page = page),

};
export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};