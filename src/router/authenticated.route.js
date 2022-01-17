//page layouts
import AppLayout from "@/layouts/AppLayout.vue";
import InventoryLayout from "@/layouts/InventoryLayout.vue";
import OrderLayout from "@/layouts/OrderLayout.vue";
import SettingsLayout from "@/layouts/SettingsLayout.vue";
import OpenSellingLayout from "@/layouts/OpenSellingLayout.vue";
// inventory pages
import InventoryHome from "@/views/authenticatedPages/inventory/InventoryHome/InventoryHome.vue";
import FMCGInventory from "@/views/authenticatedPages/inventory/FMCGInventory/FMCGInventory.vue";
import ProductPage from "@/views/authenticatedPages/inventory/ProductPage/ProductPage.vue";
import ProductDetails from "@/views/authenticatedPages/inventory/ProductDetails/ProductDetails.vue";
import ShoppingCart from "@/views/authenticatedPages/inventory/ShoppingCart/ShoppingCart.vue";
// orders pages
import Orders from "@/views/authenticatedPages/orders/Orders/Orders.vue";
import OrderDetails from "@/views/authenticatedPages/orders/OrderDetails/OrderDetails.vue";
import CustomerDetailsForm from "@/views/authenticatedPages/orders/CustomerDetailsForm/CustomerDetailsForm.vue";
import OpenOrderDetails from "@/views/authenticatedPages/orders/OpenOrderDetails/OpenOrderDetails.vue";
// settings pages
import Settings from "@/views/authenticatedPages/settings/Settings/Settings.vue";
import Profile from "@/views/authenticatedPages/settings/Profile/Profile.vue";
import Privacy from "@/views/authenticatedPages/settings/Privacy/Privacy.vue";
//withdrawal pages
import AddBankDetails from "@/views/authenticatedPages/settings/WithdrawalPages/AddBankDetails.vue";
import EditBankDetails from "@/views/authenticatedPages/settings/WithdrawalPages/EditBankDetails.vue";
import WithdrawalPage from "@/views/authenticatedPages/settings/WithdrawalPages/WithdrawalPage.vue";
import WithdrawFund from "@/views/authenticatedPages/settings/WithdrawalPages/WithdrawFund.vue";
import Kyc from "@/views/authenticatedPages/settings/Kyc/Kyc.vue";
// Dashboard pages
import Dashboard from "@/views/authenticatedPages/dashboard/Dashboard/Dashboard.vue";
import Reward from "@/views/authenticatedPages/dashboard/Reward/Reward.vue";
import Leaderboard from "@/views/authenticatedPages/dashboard/Leaderboard/Leaderboard.vue";
import PaymentsHistory from "@/views/authenticatedPages/dashboard/PaymentsHistory/PaymentsHistory.vue";
import SettlementsHistory from "@/views/authenticatedPages/dashboard/SettlementsHistory/SettlementsHistory.vue";
// referral pages
import Referral from "@/views/authenticatedPages/dashboard/Referral/Referral.vue";
import ReferralEarnings from "@/views/authenticatedPages/dashboard/Referral/ReferralEarnings.vue";
import ViewReferrals from "@/views/authenticatedPages/dashboard/Referral/ViewReferrals.vue";
import ReferFriends from "@/views/authenticatedPages/dashboard/Referral/ReferFriends.vue";
import { ifAuthenticated, allowEditBankAccount } from "./controller.js";
// your store
import SetupPage from "@/views/authenticatedPages/yourStore/setup/Setup.vue"
//open selling 
import OpenSellingPage from "@/views/authenticatedPages/openSelling/OpenSellingPage.vue";

export const authenticatedRoutes = {
    path: "/dashboard",
    component: AppLayout,
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
            component: SettlementsHistory
        },
        // Payment history
        {
            path: "payment-history",
            name: "PaymentHistory",
            component: PaymentsHistory
        },
        // reward
        {
            path: "reward",
            name: "Reward",
            component: Reward
        },
        // leaderboard
        {
            path: "leader",
            name: "Leaderboard",
            component: Leaderboard
        },
        {
            path: "referral",
            component: Referral,
            children: [
                {
                    path: "refer-friends",
                    name: "ReferFriends",
                    component: ReferFriends
                },
                {
                    path: "view-referrals",
                    name: "ViewReferrals",
                    component: ViewReferrals
                },
                {
                    path: "referral-earnings",
                    name: "ReferralEarnings",
                    component: ReferralEarnings
                },
            ]
        },
        // orders routes
        {
            path: "/orders",
            component: OrderLayout,
            children: [
                {
                    path: "/",
                    name: "Orders",
                    component: Orders
                },
                {
                    path: "customer-form",
                    name: "CustomerDetailsForm",
                    component: CustomerDetailsForm,
                },
                {
                    path: ":id",
                    name: "OrderDetails",
                    component: OrderDetails
                },
                {
                    path: "open-selling/:id",
                    name: "OpenOrderDetails",
                    component: OpenOrderDetails
                },
            ]
        },
        // settings routes
        {
            path: "/settings",
            component: SettingsLayout,
            children: [
                {
                    path: "",
                    name: "ProfilePage",
                    component: Settings
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
                {
                    path: "kyc",
                    name: "Kyc",
                    component: Kyc
                }
            ]
        },
        // inventory routes
        {
            path: "/inventory",
            component: InventoryLayout,
            children: [
                {
                    path: "",
                    name: "InventoryHome",
                    component: InventoryHome
                },
                {
                    path: "FMCGInventory",
                    name: "FMCGInventory",
                    component: FMCGInventory
                },
                {
                    path: "cart",
                    name: "ShoppingCart",
                    component: ShoppingCart
                },
                {
                    path: ":id",
                    name: "ProductPage",
                    component: ProductPage
                },
                {
                    path: ":id/details",
                    name: "ProductDetails",
                    component: ProductDetails
                },
            ]
        },
        //opening selling
        {
            path: "/open-selling",
            component: OpenSellingLayout,
            children: [
                {
                    path: "",
                    name: "OpenSellingPage",
                    component: OpenSellingPage
                }
            ]
        },
        //your store
        {
            path: "/yourStore",
            component: SetupPage,
            children: [

            ]
        },
    ]
}