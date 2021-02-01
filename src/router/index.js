import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import Index from "../views/Index.vue";
import SuspensionPage from "../views/SuspensionPage.vue";
import Signup from "@/components/onboarding/Signup.vue";
import Signin from "@/components/onboarding/Signin.vue";
import Recoverpassword from "@/components/onboarding/Recoverpassword.vue";
import Forgotpassword from "@/components/onboarding/Forgotpassword.vue";
import Emailverification from "@/components/onboarding/Emailverification.vue";
import Forgotpasswordverification from "@/components/onboarding/Forgotpasswordverification.vue";
import Onboarding from "@/views/onboarding/Onboarding.vue";
import AuthPages from "@/views/authPages/AuthPages.vue";
import Dashboard from "@/views/authPages/Dashboard.vue";
import Settings from "@/views/authPages/Settings.vue";
import ProfilePage from "@/components/settings/ProfilePage.vue";
import Profile from "@/components/settings/Profile.vue";
import Privacy from '@/components/settings/Privacy.vue';
import BankAccount from '@/components/settings/BankAccount.vue';

Vue.use(VueRouter);

// requirement for user to log on to the dashboard
const ifAuthenticated = (to, from, next) => {
  store.commit("onboarding/tokenIsPresent");
  if (store.getters["onboarding/tokenIsPresent"] === true) {
    store.dispatch("onboarding/getUserProfile").then((response) => {
      const profile = response.data.data;
      if (profile.email_verified) {
        if (profile.status) {
          store.commit("onboarding/setTokenExpired");
          if (store.getters["onboarding/tokenExpired"] === false) {
            next()
            return
          } else {
            localStorage.removeItem("accessToken");
            next({ name: 'Signin' });
          }
        } else {
          store.commit("onboarding/loggedIn", false);
          next({ name: "SuspensionPage" })
        }
      } else {
        next({
          name: 'Emailverification', params: {
            email: profile.email,
          },
        });
      }
    }).catch((error) => {
      if (error.response) {
        localStorage.removeItem("accessToken");
        next({ name: "Signin" })
      }
    })
  } else {
    next({ name: 'Signin' });
  }
}


// redirect when a user is already logged in
const AlreadyLogin = (to, from, next) => {
  if (localStorage.getItem("accessToken")) {
    next({ name: 'Dashboard' })
  } else {
    next();
    return
  }
}

// // verify if access has been given to a user to view email verification page
// const ifAccessEmailVerifcationPage = (to, from, next) => {
//   if (store.getters["onboarding/accessEmailVerifcationPage"] === true) {
//     next()
//     return
//   }
//   next({ name: 'Signup' })
// }
// // verify if access has been given to a user to view password verification page
// const ifAccessForgotPasswordVerificationPage = (to, from, next) => {
//   if (store.getters["onboarding/accessForgotPasswordVerificationPage"] === true) {
//     next()
//     return
//   }
//   next({ name: 'Forgotpassword' })
// }

// // verify if access has been given to a user to view password recovery page
// const ifAccessPasswordRecoveryPage = (to, from, next) => {
//   if (store.getters["onboarding/accessPasswordRecoveryPage"] === true) {
//     next()
//     return
//   }
//   next({ name: 'Forgotpassword' })
// }

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index
  },
  {
    path: "/suspension-page",
    name: "SuspensionPage",
    component: SuspensionPage
  },
  // dashboard 
  {
    path: "/dashboard",
    component: AuthPages,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "/settings",
        component: Settings,
        children: [
          {
            path: "",
            name: "ProfilePage",
            component: ProfilePage
          },
          {
            path: "profile",
            name: "Profile",
            component: Profile
          },
          {
            path: "privacy",
            name: "Privacy",
            component: Privacy
          },
          {
            path: "bank-account",
            name: "BankAccount",
            component: BankAccount
          }
        ]
      },
    ]
  },
  // onboarding routes
  {
    path: '/signup',
    component: Onboarding,
    beforeEnter: AlreadyLogin,
    children: [
      {
        path: "",
        name: "Signup",
        component: Signup,
      },
      {
        path: "/signin",
        name: "Signin",
        component: Signin,
      },
      {
        path: "/recoverpassword",
        name: "Recoverpassword",
        component: Recoverpassword,
        //beforeEnter:ifAccessPasswordRecoveryPage,
        props: true
      },
      {
        path: "/forgotpassword",
        name: "Forgotpassword",
        component: Forgotpassword,
      },
      {
        path: "/emailverification",
        name: "Emailverification",
        component: Emailverification,
        //beforeEnter: ifAccessEmailVerifcationPage,
        props: true
      },
      {
        path: "/forgotpasswordverification",
        name: "Forgotpasswordverification",
        component: Forgotpasswordverification,
        //beforeEnter: ifAccessForgotPasswordVerificationPage,
        props: true
      },
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
