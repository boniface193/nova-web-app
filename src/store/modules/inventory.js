import inventoryHttpClient from "@/axios/inventory.js";

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

//holds the state properties
const state = {
    products: [],
    productCategories: [],
    searchProduct: false,
    searchValue: "",
    page: 1,
    itemPerPage: 15,
    pageDetails: {},
    inventoryLoader: false,
    filter: {
        minPrice: 0,
        maxPrice: 0,
    },
    category: '',
    doNothing: null
};

//returns the state properties
const getters = {
    products: state => state.products,
    productCategories: state => state.productCategories
};

//fetch data 
const actions = {
    // get product form inventory 
    getProducts(context) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get("/products").then(response => {
                context.commit("setProducts", response.data.data);
                context.commit("setPageDetails", response.data.meta);
                resolve(response);
            })
                .catch(error => {
                    reject(error);
                })
        })
    },
    // get a product detail
    getProductDetail(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/products/${data.id}`).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // search products
    searchProducts(context) {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let route = (state.searchValue !== "") ? `/search?q=${state.searchValue}&${page}&${perPage}` : ""
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/products${route}`).then(response => {
                context.commit("setProducts", response.data.data);
                context.commit("setPageDetails", response.data.meta);
                resolve(response);
            })
                .catch(error => {
                    reject(error);
                })
        })
    },
    // filter products 
    getfilteredProducts(context) {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let priceRange = ((state.filter.maxPrice) ? `price_between=${state.filter.minPrice},${state.filter.maxPrice}` : "");
        let category = (state.category !== "") ? `category=${state.category}` : ""

        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/products?${page}&${perPage}&${priceRange}&${category}`).then(response => {
                context.commit("setProducts", response.data.data);
                context.commit("setPageDetails", response.data.meta);
                resolve(response);
            })
                .catch(error => {
                    reject(error);
                })
        })
    },
    // get product categories
    getProductCategories(context) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/categories`).then(response => {
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
    setProducts: (state, data) => (state.products = data),
    setSearchProduct: (state, status) => (state.searchProduct = status),
    setSearchValue: (state, value) => (state.searchValue = value),
    setPageDetails: (state, data) => (state.pageDetails = data),
    setItemPerPage: (state, itemPerPage) => {
        state.itemPerPage = itemPerPage;
        let page = setItemPerPage(itemPerPage, state.pageDetails.per_page, state.pageDetails.from);
        state.page = page;
    },
    setPage: (state, page) => (state.page = page),
    setInventoryLoader: (state, status) => (state.inventoryLoader = status),
    setFilter: (state, filter) => (state.filter = filter),
    setProductCategories: (state, productCategories) => (state.productCategories = productCategories),
    setCategory: (state, category) => (state.category = category),
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