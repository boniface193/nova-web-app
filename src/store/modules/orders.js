import orderHttpClient from "@/services/order.service.js";

//holds the state properties
const state = {
    orders: [],
    openSelling: [],
    searchOrder: false,
    searchValue: "",
    page: 1,
    openSellingPage: 1,
    itemPerPage: null,
    pageDetails: {},
    PageDetailsForOpenSelling: {},
    filter: {
        minPrice: 0,
        maxPrice: 0,
        paid: false,
        unpaid: false,
        delivered: false,
        notDelivered: false
    },
    totalNumberOfProductsInCart: 0,
    productsInCart: [{ product: {} }],
    overallTotalCost: 0,
    doNothing: null
};
//returns the state properties
const getters = {
    orders(state) {
        return state.orders
    },
    openSelling(state) {
        return state.openSelling
    }
};

//take actions
const actions = {
    getOrders(context) {
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        return new Promise((resolve, reject) => {
            orderHttpClient.get(`/orders?${page}&${perPage}`)
                .then(response => {
                    context.commit("setOrders", response.data.data);
                    context.commit("setPageDetails", response.data.meta);
                    resolve(response.data.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    filterGetOrders(context) {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        let priceRange = ((state.filter.maxPrice) ? `price_between=${state.filter.minPrice},${state.filter.maxPrice}` : "");
        return new Promise((resolve, reject) => {
            orderHttpClient.get(`/orders?${priceRange}`).then(response => {
                context.commit("setOrders", response.data.data);
                context.commit("setPageDetails", response.data.meta);
                resolve(response);
            })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // get order details
    getOrdersDetail(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .get(`/orders/${data.id}`)
                .then(response => {
                    context.commit("setOrders", response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    searchOrders(context) {
        let page = ((state.page) ? `page=${state.page}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let route = (state.searchValue !== "") ? `/search?q=${state.searchValue}&${page}&${perPage}` : `?${page}&${perPage}`
        return new Promise((resolve, reject) => {
            orderHttpClient.get(`/orders${route}`).then(response => {
                context.commit("setOrders", response.data.data);
                context.commit("setPageDetails", response.data.meta);
                resolve(response);
            })
                .catch(error => {
                    reject(error);
                });
        });
    },
    // create order
    createOrder(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post("/checkout-sessions", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    // pay for order
    payForOrder(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post(`/checkout-sessions/${data.id}/pay`, {}).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    // get order details for customer
    getOrderDetailsForCustomer(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.get(`/checkout-sessions/${data.id}`).then(response => {
                resolve(response);
            }).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    //verify Payment
    verifyPayment(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .post(`/orders/${data.orderId}/verify`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    // edit order address
    editOrderAddress(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .post(`/checkout-sessions/${data.order_id}/location`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    // confirm order
    sendConfirmOrderOTP(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .post(`/orders/${data.orderId}/confirm-delivery/send-otp`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    submitConfirmOrderOTP(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .post(`/orders/${data.orderId}/confirm-delivery`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    addProductToCart(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .post(`/cart-items`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    getCartProducts(context) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .get(`/cart-items`)
                .then(response => {
                    context.commit("setProductsInCart", response.data.data);
                    context.commit("setTotalNumberOfProductsInCart", response.data.data.length);
                    context.commit("setOverallTotalCost", response.data.overall_total_cost);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    deleteProductFromCart(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .delete(`/cart-items/${data.id}`)
                .then(response => {
                    console.log(response.data.data)
                    context.commit("setProductsInCart", response.data.data);
                    context.commit("setTotalNumberOfProductsInCart", response.data.data.length);
                    context.commit("setOverallTotalCost", response.data.overall_total_cost);
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing")
                    reject(error);
                });
        });
    },
    updateCartProduct(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .put(`/cart-items/${data.product_id}`, data)
                .then(response => {
                    context.commit("setProductsInCart", response.data.data);
                    context.commit("setTotalNumberOfProductsInCart", response.data.data.length);
                    context.commit("setOverallTotalCost", response.data.overall_total_cost);
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing")
                    reject(error);
                });
        });
    },
    // open selling
    createOpenSelling(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post('/open-order', data).then(response => {
                resolve(response)
            }).catch(error => {
                context.commit("doNothing")
                reject(error)
            })
        })
    },
    getOpenSellingById(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.get(`/open-order/${data.id}`).then(response => {
                resolve(response)
                context.commit("setOpenSelling", response.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get open selling
    getOpensellingDetails(context) {
        let page = ((state.openSellingPage) ? `page=${state.openSellingPage}` : "");
        let perPage = ((state.itemPerPage) ? `per_page=${state.itemPerPage}` : "");
        let priceRange = ((state.filter.maxPrice) ? `price_between=${state.filter.minPrice},${state.filter.maxPrice}` : "");
        let route = (state.searchValue !== "") ? `/search?q=${state.searchValue}&${priceRange}&${page}&${perPage}` : `?${priceRange}&${page}&${perPage}`
        return new Promise((resolve, reject) => {
            orderHttpClient.get(`/open-order${route}`).then(response => {
                resolve(response.data.data)
                context.commit("setOpenSelling", response.data.data)
                context.commit("setPageDetailsForOpenSelling", response.data.meta);
            }).catch(error => {
                reject(error)
            })
        })
    },
    // change open selling address and delivery method
    updateDeliveryLoationAndMethod(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post(`/open-order/${data.id}/location`, data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // pay for open selling order
    payForOpenSellingOrder(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post(`/open-order/${data.id}/pay`, {}).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    //verify Payment for open Selling
    verifyPaymentForOpenSelling(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post(`/open-order/${data.orderId}/verify`, data,).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
};

//updates the different state properties
const mutations = {
    setOrders: (state, data) => state.orders = data,
    setOpenSelling: (state, data) => state.openSelling = data,
    filterOrders: (state, filter) => state.filter = filter,
    filterRange: (state, dateRange) => state.dateRange = dateRange,
    getSearchValue: (state, value) => state.searchValue = value,
    setSearchOrder: (state, status) => state.searchOrder = status,
    setPageDetails: (state, data) => state.pageDetails = data,
    setPageDetailsForOpenSelling: (state, data) => state.PageDetailsForOpenSelling = data,
    setOpenSellingPage: (state, page) => state.openSellingPage = page,
    setPage: (state, page) => state.page = page,
    setTotalNumberOfProductsInCart: (state, totalNumberOfProductsInCart) => state.totalNumberOfProductsInCart = totalNumberOfProductsInCart,
    setProductsInCart: (state, productsInCart) => state.productsInCart = productsInCart,
    setOverallTotalCost: (state, overallTotalCost)=> state.overallTotalCost = overallTotalCost,
    // commit nothing
    doNothing: state => (state.doNothing = null)
};

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
