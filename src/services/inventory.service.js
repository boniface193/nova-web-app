import axios from "axios";
import store from "@/store";

let requestQueue = [];

// base url for development environment
let inventoryBaseUrl = "https://nova-inventory.herokuapp.com";

// set base url if environment is staging
if (process.env.VUE_APP_ENV == "staging") {
    inventoryBaseUrl = "https://inventory-staging.kuuzza.com";
}
// set base url if environment is prodution
if (process.env.VUE_APP_ENV == "production") {
    inventoryBaseUrl = "https://inventory.kuuzza.com";
}
const inventoryHttpClient = axios.create({
    baseURL: inventoryBaseUrl,
});

const inventoryRequest = (config) => {
    if (store.state.onboarding.accessToken !== null) {
        if (!store.state.onboarding.refreshingToken) {
            config.headers.Authorization = `Bearer ${store.state.onboarding.accessToken}`;
        } else {
            // add to pending request
            requestQueue.push(config);
        }
    }
    return config
}

/** Adding the request interceptors */
inventoryHttpClient.interceptors.request.use(inventoryRequest);

/** Adding the response interceptors */
inventoryHttpClient.interceptors.response.use(
    (response) => {
        if (response.status === 200 || response.status === 201) {

            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    }, async (error) => {
        if (error.response.status) {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                if (!store.state.onboarding.refreshingToken) {
                    store.commit("onboarding/setRefreshingToken", true);
                    originalRequest._retry = true;
                    return store.dispatch("onboarding/getAccessToken").then(res => {
                        store.commit("onboarding/setRefreshingToken", false);
                        // Change Authorization header
                        inventoryHttpClient.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
                        // return originalRequest object with Axios.                           
                        return inventoryHttpClient(originalRequest);
                    }).catch(() => store.commit("onboarding/setRefreshingToken", false))
                } else {
                    return inventoryHttpClient(error.config)
                }
            } else if (error.response.status === 404) {
                store.commit("onboarding/setErrorTracker", {
                    message: "404 Not found",
                    error: true
                })
            }
            else if (error.response.status === 500) {
                store.commit("onboarding/setErrorTracker", {
                    message: "Something went wrong, Please try again.",
                    error: true
                })
            } else if (!navigator.onLine) {
                store.commit("onboarding/setErrorTracker", {
                    message: "No internet connection.",
                    error: true
                })
            }

            return Promise.reject(error.response);
        }
    }
);

export default inventoryHttpClient;