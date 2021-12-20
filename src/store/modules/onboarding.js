import onboardingHttpClient from "@/services/onboarding.service.js";
import refreshHttpClient from "@/services/refresh.service.js";
import store from "@/store";
import router from '@/router/index.js';


//decode token
const decodeToken = (token) => {
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
}

// check if access token is expired
const checkIfTokenExpired = (token) => {
    if (state[`${token}`]) {
        const expiration = decodeToken(state[`${token}`]).exp
        return expiration >= new Date() || false;
    } else {
        return false
    }
};

//holds the state properties
const state = {
    presentSignupForm: 'form1',
    clientID: localStorage.getItem("clientID") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    accessToken: null,
    tokenAccessExpired: true,
    tokenRefreshExpired: true,
    refreshingToken: false,
    errorTracker: {
        message: "",
        error: false
    },
    doNothing: null,
};

//returns the state properties
const getters = {};

//fetch data 
const actions = {
    // get user profile details
    getUserProfile() {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.get("profile").then(response => {
                resolve(response)
            }).catch((error) => {
                reject(error)
            })
        })
    },
    // check if an account exist
    checkAccount: (context, data) => {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("auth/register/seller/validate-email", data).then(response => {
                resolve(response)
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        });
    },
    //creates user account
    register(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("auth/register/seller", data)
                .then(response => {
                    context.commit("setClientID", response.data.client_id)
                    context.commit("setAccessToken", response.data.token);
                    context.commit("setRefreshToken", response.data.refresh_token);
                    resolve(response)
                })
                .catch(error => {
                    context.commit("removeToken");
                    reject(error)
                })
        })
    },
    //allows users to login
    signIn: (context, data) => {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("auth/login", data).then(response => {
                context.commit("setClientID", response.data.client_id)
                context.commit("setAccessToken", response.data.token);
                context.commit("setRefreshToken", response.data.refresh_token);
                resolve(response)
            })
                .catch(error => {
                    context.commit("removeToken")
                    reject(error);
                })
        })
    },
    // verify email address 
    verifyEmail: (context, data) => {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("emails/verify", data).then(response => {
                context.commit("setAccessToken", response.data.token)
                resolve(response);
            })
                .catch(error => {
                    reject(error);
                })
        })
    },
    // forgot password
    forgotPassword: (context, data) => {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("passwords/reset", data).then(response => {
                resolve(response)
            }).catch(error => {
                context.commit("doNothing");
                reject(error)
            })
        })
    },
    // verify forgot password 
    verifyForgotPassword: (context, data) => {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("passwords/verify-otp", data).then(response => {
                resolve(response)
            }).catch(error => {
                context.commit("doNothing");
                reject(error);
            })
        })
    },
    // resend opt for email verification 
    resendEmailOTP(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("emails/send-otp", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // resend opt verify forgot password 
    resendVerifyForgotPasswordOTP(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("passwords/reset", data).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // recover password
    recoverPassword: (context, data) => {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("passwords/new", data).then(response => {
                resolve(response)
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        });
    },
    // get store details
    getStoreDetails(context, data) {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.get(`/stores/${data.id}`).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // get seller details
    getSellerDetails(context, data){
        return new Promise((resolve, reject) => {
            onboardingHttpClient.get(`/sellers/${data.id}`).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                })
        })
    },
    // get access token  
    getAccessToken: (context) => {
        return new Promise((resolve, reject) => {
            refreshHttpClient.post("auth/refresh", {
                client_id: state.clientID
            },
                {
                    headers: {
                        Authorization: `Bearer ${state.refreshToken}`
                    }
                }
            ).then(response => {
                context.commit("setClientID", response.data.client_id)
                context.commit("setAccessToken", response.data.token);
                context.commit("setRefreshToken", response.data.refresh_token);
                resolve(response);
            })
                .catch(error => {
                    context.commit("removeClientID");
                    context.commit("removeRefreshToken");
                    context.commit("setAccessToken", null)
                    store.commit("reset");
                    router.push({ name: 'Signin' })
                    reject(error);
                })
        });
    },
    // logout 
    logout: (context) => {
        return new Promise((resolve, reject) => {
            onboardingHttpClient.post("auth/logout", {
                client_id: state.clientID
            }, {
                headers: {
                    Authorization: `Bearer ${state.accessToken}`
                }
            }
            ).then(response => {
                context.commit("removeClientID");
                context.commit("removeRefreshToken");
                context.commit("setAccessToken", null)
                store.commit("reset");
                resolve(response);
            })
                .catch(error => {
                    context.commit("removeClientID");
                    context.commit("removeRefreshToken");
                    context.commit("setAccessToken", null)
                    store.commit("reset");
                    reject(error);
                })
        });
    },
};

//updates the different state properties
const mutations = {
    // update the present form on signup 
    setPresentSignupForm: (state, form) => (state.presentSignupForm = form),
    // set client ID 
    setClientID: (state, clientID) => {
        localStorage.setItem('clientID', clientID)
        state.clientID = localStorage.getItem('clientID') || null
    },
    // set refresh token 
    setRefreshToken(state, refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
        state.refreshToken = localStorage.getItem('refreshToken') || null
    },
    // set access token
    setAccessToken: (state, token) => {
        state.accessToken = token
    },
    // remove client ID
    removeClientID: () => {
        localStorage.removeItem('clientID');
        state.clientID = localStorage.getItem('clientID') || null
    },
    // remove refresh token
    removeRefreshToken: () => {
        localStorage.removeItem('refreshToken');
        state.clientID = localStorage.getItem('refreshToken') || null
    },
    // check if access token expired
    setAccessTokenExpired: (state, token) => {
        const tokenExpired = checkIfTokenExpired(token);
        state.accessTokenExpired = tokenExpired;
    },
    // check if access token expired
    setRefreshTokenExpired: (state, token) => {
        const tokenExpired = checkIfTokenExpired(token);
        state.refreshTokenExpired = tokenExpired;
    },
    // set the refreshtoken status
    setRefreshingToken: (state, status) => (state.refreshingToken = status),
    // set error messages, this handles error message globally
    setErrorTracker: (state, errorInfo) => {
        state.errorTracker.message = errorInfo.message;
        state.errorTracker.error = errorInfo.error;
    },
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