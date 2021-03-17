import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

// public pages
import Index from "../views/publicPages/Index.vue";
import Home from "../views/publicPages/Home.vue";
import SuspensionPage from "../views/publicPages/SuspensionPage.vue";
// onboarding routes
import Signup from "@/components/onboarding/Signup.vue";
import Signin from "@/components/onboarding/Signin.vue";
import Recoverpassword from "@/components/onboarding/Recoverpassword.vue";
import Forgotpassword from "@/components/onboarding/Forgotpassword.vue";
import Emailverification from "@/components/onboarding/Emailverification.vue";
import Forgotpasswordverification from "@/components/onboarding/Forgotpasswordverification.vue";
import Onboarding from "@/views/onboarding/Onboarding.vue";
// dashbord
import dashboardView from "@/views/authPages/dashboard/dashboardView.vue";
import Dashboard from "@/views/authPages/dashboard/Dashboard.vue";
import Reward from "@/views/authPages/dashboard/Reward.vue";
import Leaderboard from "@/views/authPages/dashboard/Leaderboard.vue";
// sales history pages
import PaymentHistory from "@/components/salesHistory/PaymentHistory.vue";
import SettlementHistory from "@/components/salesHistory/SettlementHistory.vue";
// order routes
import orderView from "@/views/authPages/orders/orderView.vue";
import Orders from "@/views/authPages/orders/Orders.vue";
import orderDetails from "@/views/authPages/orders/orderDetails.vue";
// Settings
import Settings from "@/views/authPages/Settings.vue";
import ProfilePage from "@/components/settings/ProfilePage.vue";
import Profile from "@/components/settings/Profile.vue";
import Privacy from '@/components/settings/Privacy.vue';
// withdrawal 
import WithdrawalPage from "@/components/withdrawalPages/WithdrawalPage.vue";
import WithdrawFund from "@/components/withdrawalPages/WithdrawFund.vue";
import AddBankDetails from "@/components/withdrawalPages/AddBankDetails.vue";
import EditBankDetails from '@/components/withdrawalPages/EditBankDetails.vue';
// Inventory
import Inventory from "@/views/authPages/Inventory.vue";
import InventoryHome from "@/components/inventory/InventoryHome.vue";
import ProductPage from "@/components/inventory/ProductPage.vue";
import CustomerDetailsForm from "@/components/inventory/CustomerDetailsForm.vue";
import ProductDetails from "@/components/inventory/ProductDetails.vue";
// checkout pages
import CheckoutPage from "@/components/checkout/CheckoutPage.vue";
import PaymentDetails from "@/components/checkout/PaymentDetails.vue";
import CheckoutDetails from "@/components/checkout/CheckoutDetails.vue";
import PaymentSuccess from "@/components/checkout/PaymentSuccess.vue";
import PaymentFailed from "@/components/checkout/PaymentFailed.vue";
import OrderStatus from "@/components/checkout/OrderStatus.vue";

Vue.use(VueRouter);

// requirement for user to log on to the authenticated pages
const ifAuthenticated = (to, from, next) => {
  store.commit("onboarding/tokenIsPresent");
  if (store.getters["onboarding/tokenIsPresent"] === true) {
    store.dispatch("onboarding/getUserProfile").then(response => {
      const profile = response.data.data;
      if (profile.email_verified) {
        if (profile.status) {
          store.commit("onboarding/setTokenExpired");
          if (store.getters["onboarding/tokenExpired"] === false) {
            next()
            return
          } else {
            store.commit("reset");
            store.commit("onboarding/removeToken");
            next({ name: "Signin" })
          }
        } else {
          store.commit("reset");
          store.commit("onboarding/removeToken");
          next({ name: "SuspensionPage" })
        }
      } else {
        store.commit("reset");
        store.commit("onboarding/removeToken");
        next({
          name: 'Emailverification', params: {
            email: profile.email,
          },
        });
      }
    }).catch((error) => {
      if (error.response.status == 401) {
        store.commit("reset");
        store.commit("onboarding/removeToken");
        next({ name: "Signin" });
      }
    })
  } else {
    next({ name: 'Signin' });
  }
}


// redirect when a user is already logged in
const AlreadyLogin = (to, from, next) => {
  store.commit("onboarding/tokenIsPresent");
  if (store.getters["onboarding/tokenIsPresent"] === true) {
    next({ name: 'InventoryHome' })
  } else {
    next();
    return
  }
}

// verify if access has been given to a user to view email verification page
const ifAccessEmailVerifcationPage = (to, from, next) => {
  if (from.name === "Signup" || from.name === "Signin") {
    next()
    return
  }
  next({ name: 'Signup' })
}
// verify if access has been given to a user to view password verification page
const ifAccessForgotPasswordVerificationPage = (to, from, next) => {
  if (from.name === "Forgotpassword") {
    next()
    return
  }
  next({ name: 'Forgotpassword' })
}

// verify if access has been given to a user to view password recovery page
const ifAccessPasswordRecoveryPage = (to, from, next) => {
  if (from.name === "Forgotpasswordverification") {
    next()
    return
  }
  next({ name: 'Forgotpassword' })
}

// check conditon before allowing user to route to payment page 
const allowPayment = (to, from, next) => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");
  if (from.name === "CheckoutDetails") {
    next();
    return
  } else {
    next({ path: `/checkout-details?order_id=${orderId}` })
  }
}

// allow a user to edit account only when comming from the withdrawal page
const allowEditBankAccount = (to, from, next) => {
  if (from.name === "WithdrawFund") {
    next();
    return
  } else {
    next({ name: "WithdrawFund" });
  }
}

const routes = [
  {
    path: "/",
    component: Index,
    children: [{
      path: "",
      component: Home,
      name: "Home"
    }]
  },
  {
    path: "/suspension-page",
    name: "SuspensionPage",
    component: SuspensionPage
  },

  // dashboard 
  {
    path: "/dashboard",
    component: dashboardView,
    beforeEnter: ifAuthenticated,
    children: [
      // dashboard
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },

      // Settlement history
      {
        path: "settlement-history",
        name: "SettlementHistory",
        component: SettlementHistory
      },
      // Payment history
      {
        path: "payment-history",
        name: "PaymentHistory",
        component: PaymentHistory
      },
      // reward
      {
        path: "reward",
        name: "reward",
        component: Reward
      },
      // leaderboard
      {
        path: "leader",
        name: "leaderboard",
        component: Leaderboard
      },
      // orders routes
      {
        path: "/orders",
        component: orderView,
        children: [
          {
            path: "/",
            name: "Orders",
            component: Orders
          },
          {
            path: ":id",
            name: "orderDetails",
            component: orderDetails
          }
        ]
      },
      // settings routes
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
            path: "",
            component: WithdrawalPage,
            children: [
              {
                path: "add-account",
                name: "AddBankDetails",
                component: AddBankDetails
              },
              {
                path: "withdraw-fund",
                name: "WithdrawFund",
                component: WithdrawFund
              },
              {
                path: "change-account",
                name: "EditBankDetails",
                component: EditBankDetails,
                beforeEnter: allowEditBankAccount
              }
            ]
          },
        ]
      },
      // inventory routes
      {
        path: "/inventory",
        component: Inventory,
        children: [
          {
            path: "",
            name: "InventoryHome",
            component: InventoryHome
          },
          {
            path: ":id",
            name: "ProductPage",
            component: ProductPage
          },
          {
            path: ":id/customer-form",
            name: "CustomerDetailsForm",
            component: CustomerDetailsForm,
            //beforeEnter: has_bank_account
          },
          {
            path: ":id/details",
            name: "ProductDetails",
            component: ProductDetails
          }
        ]
      }
    ]
  },
  // checkout pages
  {
    path: "/checkout",
    component: CheckoutPage,
    children: [
      {
        path: "/payment-details",
        name: "PaymentDetails",
        component: PaymentDetails,
        beforeEnter: allowPayment
      },
      {
        path: "/checkout-details",
        name: "CheckoutDetails",
        component: CheckoutDetails,
      },
    ]
  },
  {
    path: "/payment-success",
    name: "PaymentSuccess",
    component: PaymentSuccess,
  },
  {
    path: "/payment-failed",
    name: "PaymentFailed",
    component: PaymentFailed,
  },
  {
    path: "/order-status",
    name: "OrderStatus",
    component: OrderStatus
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
        beforeEnter:ifAccessPasswordRecoveryPage,
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
        beforeEnter: ifAccessEmailVerifcationPage,
        props: true
      },
      {
        path: "/forgotpasswordverification",
        name: "Forgotpasswordverification",
        component: Forgotpasswordverification,
        beforeEnter: ifAccessForgotPasswordVerificationPage,
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
