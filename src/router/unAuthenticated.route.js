// layouts
import UnAuthenticatedLayout from "@/layouts/UnAuthenticatedLayout.vue";
import CheckoutLayout from "@/layouts/CheckoutLayout.vue";
import OpenSellingCheckoutLayout from "@/layouts/OpenSellingCheckoutLayout.vue";
// inventory checkout routes
import PaymentDetails from "@/views/checkoutPages/PaymentDetails.vue";
import CheckoutDetails from "@/views/checkoutPages/CheckoutDetails.vue";
import PaymentSuccess from "@/views/checkoutPages/PaymentSuccess.vue";
import PaymentFailed from "@/views/checkoutPages/PaymentFailed.vue";
import OrderStatus from "@/views/checkoutPages/OrderStatus.vue";
// open selling checkout routes
import OpenSellingPaymentDetails from "@/views/openSellingCheckoutPages/PaymentDetails.vue";
import OpenSellingCheckoutDetails from "@/views/openSellingCheckoutPages/CheckoutDetails.vue";
import OpenSellingPaymentSuccess from "@/views/openSellingCheckoutPages/PaymentSuccess.vue";
import OpenSellingPaymentFailed from "@/views/openSellingCheckoutPages/PaymentFailed.vue";
import OpenOrderStatus from "@/views/openSellingCheckoutPages/OrderStatus.vue";
import { allowPayment, allowOpenSellingPayment } from "./controller.js";

export const unAuthenticatedRoutes = {
  path: "",
  component: UnAuthenticatedLayout,
  children: [
    // checkout pages for inventory
    {
      path: "",
      component: CheckoutLayout,
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
    // checkout pages for open selling
    {
      path: "",
      component: OpenSellingCheckoutLayout,
      children: [
        {
          path: "/open-selling-payment-details",
          name: "OpenSellingPaymentDetails",
          component: OpenSellingPaymentDetails,
          beforeEnter: allowOpenSellingPayment
        },
        {
          path: "/open-selling-checkout-details",
          name: "OpenSellingCheckoutDetails",
          component: OpenSellingCheckoutDetails,
        },
      ]
    },
    {
      path: "/open-selling-payment-success",
      name: "OpenSellingPaymentSuccess",
      component: OpenSellingPaymentSuccess,
    },
    {
      path: "/open-selling-payment-failed",
      name: "OpenSellingPaymentFailed",
      component: OpenSellingPaymentFailed,
    },
    {
      path: "/open-order-status",
      name: "OpenOrderStatus",
      component: OpenOrderStatus
    },
  ]
}