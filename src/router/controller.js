import store from "@/store";
import router from "./index";

// get user profile information and check they meet the conditions
export const getProfile = (to, from, next) => {
    store.dispatch("settings/getUserProfile").then(response => {
        const profile = response.data.data;
        if (profile.email_verified) {
            if (profile.status) {
                localStorage.removeItem("nextRoute");
                next()
                return
            } else {
                router.push({ name: "SuspensionPage" })
            }
        } else {
            router.push({
                name: 'EmailVerification', params: {
                    email: profile.email,
                },
            });
        }
    }).catch((error) => {
        if (error.status == 401)
            logUserOut(next);
    })
}

// requirement for user to log on to the authenticated pages
export const ifAuthenticated = (to, from, next) => {
    // check if client ID exists in localstorage
    if (localStorage.getItem("clientID") && localStorage.getItem("refreshToken")) {
        // check if accessToken is not equal to null in memory
        if (store.state.onboarding.accessToken !== null) {
            store.commit("onboarding/setAccessTokenExpired");
            if (store.state.onboarding.accessTokenExpired === false) {
                getProfile((to, from, next()));
            } //if accesstoken as expired make a request for new accesstoken 
            else {
                store.dispatch("onboarding/getAccessToken").then(() => {
                    getProfile((to, from, next()));
                }).catch((error) => {
                    if (error.status == 401 || error.status == 422) {
                        logUserOut(next);
                    }
                })
            }
        } else {
            store.dispatch("onboarding/getAccessToken").then(() => {
                getProfile((to, from, next()));
            }).catch((error) => {
                if (error.status == 401 || error.status == 422) {
                    logUserOut(next);
                }
            })
        }
    } else {
        logUserOut(next);
    }
}

const setNextRoute = () => {
    let url_ID = window.location.href;
    let newURL = new URL(url_ID);
    localStorage.setItem("nextRoute", newURL)
}

// redirect when a user is already logged in
export const alreadyLogin = (to, from, next) => {
    if (localStorage.getItem("clientID") &&
        localStorage.getItem("refreshToken") && to.name !== "EmailVerification") {
        next({ name: 'InventoryHome' })
    } else {
        next();
        return
    }
}

// verify if access has been given to a user to view email verification page
export const ifAccessEmailVerifcationPage = (to, from, next) => {
    next()
    return
}

// verify if access has been given to a user to view password verification page
export const ifAccessForgotPasswordVerificationPage = (to, from, next) => {
    if (from.name === "ForgotPassword") {
        next()
        return
    }
    next({ name: 'ForgotPassword' })
}

// verify if access has been given to a user to view password recovery page
export const ifAccessPasswordRecoveryPage = (to, from, next) => {
    if (from.name === "ForgotPasswordVerification") {
        next()
        return
    }
    next({ name: 'ForgotPassword' })
}

// check conditon before allowing user to route to payment page 
export const allowPayment = (to, from, next) => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (from.name === "CheckoutDetails") {
        next();
        return
    } else {
        next({ path: `/checkout-details?session_id=${sessionId}` })
    }
}

// check conditon before allowing user to route to open selling payment page 
export const allowOpenSellingPayment = (to, from, next) => {
    const params = new URLSearchParams(window.location.search);
    const openOrderId = params.get("session_id");
    if (from.name === "OpenSellingCheckoutDetails") {
        next();
        return
    } else {
        next({ path: `/open-selling-checkout-details?session_id=${openOrderId}` })
    }
}

// allow a user to edit account only when comming from the withdrawal page
export const allowEditBankAccount = (to, from, next) => {
    if (from.name === "WithdrawFund") {
        next();
        return
    } else {
        next({ name: "WithdrawFund" });
    }
}
// allow user to access store if profile is setup
export const allowSellerToAccessStore = (to, from, next) => {
    if (store.getters["inventory/sellerStoreDetails"].name === undefined) {
        store.dispatch("inventory/getSellerStoreDetails").then(() => {
            if (store.getters["inventory/sellerStoreDetails"].name !== undefined){
                next();
                return
            }
            router.push({ name: "StoreSetup" });
        }).catch(() => {
            router.push({ name: "StoreSetup" });
        })
    } else {
        next();
        return
    }
}
export const allowSellerToAccessStoreSetup = (to, from, next) => {
    if (store.getters["inventory/sellerStoreDetails"].name === undefined) {
        store.dispatch("inventory/getSellerStoreDetails").then(() => {
            if (store.getters["inventory/sellerStoreDetails"].name === undefined){
                next();
                return
            }
            router.push({ name: "Store" });
        }).catch(() => {
            next();
            return
        })
    } else {
        router.push({ name: "Store" });
    }
}
// logout 
const logUserOut = (next) => {
    store.commit("onboarding/removeClientID");
    store.commit("onboarding/removeRefreshToken");
    store.commit("onboarding/setAccessToken", null)
    store.commit("reset");
    setNextRoute()
    next({ name: 'Signin' });
}