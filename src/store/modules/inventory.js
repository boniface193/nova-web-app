import inventoryHttpClient from "@/services/inventory.service.js";
import setItemPerPage from "@/helpers/general.js";

//holds the state properties
const state = {
    products: [],
    FMCGProducts: [],
    productForLandingPage: [],
    productCategories: [],
    FMCGProductCategories: [],
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
    FMCGCategory: '',
    sellerStoreDetails: {},
    doNothing: null
};

//returns the state properties
const getters = {
    products: state => state.products,
    FMCGProducts: state => state.FMCGProducts,
    productCategories: state => state.productCategories,
    FMCGProductCategories: state => state.FMCGProductCategories,
    getProductForLandingPage: state => state.productForLandingPage,
    sellerStoreDetails: state => state.sellerStoreDetails
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
    // get product form FMCG inventory 
    getFMCGProducts(context) {
        let category = (state.FMCGCategory !== "") ? `category=${state.FMCGCategory}` : "";
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/products?is_fmcg=1&${category}`).then(response => {
                context.commit("setFMCGProducts", response.data.data);
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
        const baseUrl = window.location
        let fmcgUrl = baseUrl.pathname.includes('/inventory/FMCGInventory') ? '&is_fmcg=1' : '';
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let route = (state.searchValue !== "") ? `/search?q=${state.searchValue}&${page}&${perPage}` : ""
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/products${route}${fmcgUrl}`).then(response => {
                context.commit("setProducts", response.data.data);
                context.commit("setFMCGProducts", response.data.data);
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
        const baseUrl = window.location
        let fmcgUrl = baseUrl.pathname.includes('/inventory/FMCGInventory') ? 'is_fmcg=1' : '';
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let priceRange = ((state.filter.maxPrice) ? `price_between=${state.filter.minPrice},${state.filter.maxPrice}` : "");
        let category = (state.category !== "") ? `category=${state.category}` : ""

        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/products?${fmcgUrl}&${page}&${perPage}&${priceRange}&${category}`).then(response => {
                context.commit("setProducts", response.data.data);
                context.commit("setFMCGProducts", response.data.data);
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
    },
    // get product categories for fmcg
    getFMCGProductCategories(context) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`/categories?is_fmcg=1`).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    setupStore(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.post(`/seller-store`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    updateStore(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.post(`/seller-store/update`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    getSellerStoreDetails(context) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get("seller-store").then(response => {
                context.commit("setSellerStoreDetails", response.data.data);
                resolve(response);
            })
                .catch(error => {
                    context.commit("setSellerStoreDetails", {});
                    reject(error);
                })
        })
    },
    addProductToStore(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.post("catalogue", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    getSellerStoreProducts(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`catalogue/view?page=${data.page}`).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    updateStoreName(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.post("seller-store/update", data).then(response => {
                context.commit("setSellerStoreDetails", response.data.data);
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        });
    },
    updateProductProfit(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.put(`/catalogue/${data.product_id}`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        });
    },
    deleteBulkProductInStore(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.delete(`catalogue/removeBulk`, { data }).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        });
    }
};

//updates the different state properties
const mutations = {
    setProducts: (state, data) => (state.products = data),
    setFMCGProducts: (state, data) => (state.FMCGProducts = data),
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
    setFMCGProductCategories: (state, productCategories) => (state.FMCGProductCategories = productCategories),
    setCategory: (state, category) => (state.category = category),
    setFMCGCategory: (state, category) => (state.FMCGCategory = category),
    setSellerStoreDetails: (state, data) => (state.sellerStoreDetails = data),
    changeProductToInStore: (state, index) => (state.products[index].in_store = true),
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