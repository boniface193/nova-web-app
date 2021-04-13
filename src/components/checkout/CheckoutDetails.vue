<template>
  <div>
    <h2 class="mb-4">{{ pageDetails.orderDetails.product_name }}</h2>
    <!-- <p class="primary--text mb-2">&#8358;{{ orderDetails.subtotal_label }}</p> -->
    <p class="secondary--text" style="font-size: 14px">
      Inventory: {{ pageDetails.storeDetails.name }}
    </p>
    <div class="d-flex align-center">
      <p class="secondary--text mr-1 mb-0" style="font-size: 14px">
        Chat Seller:
      </p>

      <a
        :href="
          '//' +
          `api.whatsapp.com/send?text=''&phone=${pageDetails.orderDetails.customer.phone}`
        "
        target="_blank"
        style="text-decoration: none"
      >
        <v-icon color="#64B161" class="ml-2 mr-2" style="cursor: pointer"
          >mdi-whatsapp</v-icon
        >
      </a>
      <h5>{{ pageDetails.orderDetails.seller_name }}</h5>
    </div>
    <!-- product description -->
    <div class="mt-4">
      <h4 class="mb-2">Description</h4>
      <p class="secondary--text mb-0" v-if="!readMoreActivated" style="font-size: 14px">
        {{ pageDetails.productDetails.description.slice(0, 200) }}
      </p>
      <a class="primary--text"  v-if="!readMoreActivated" @click="readMoreActivated = true">view more</a>
      <p class="secondary--text mb-0" v-if="readMoreActivated" style="font-size: 14px">
        {{ pageDetails.productDetails.description}}
      </p>
      <a class="primary--text"  v-if="readMoreActivated" @click="readMoreActivated = false">view less</a>

      <h4 class="mt-4 mb-2" v-show="orderDetails.variants.length != 0">Variants</h4>
      <p
        class="mb-1 secondary--text"
        v-for="(variant, index) in orderDetails.variants"
        :key="index"
        style="font-size: 14px"
      >
        {{ variant.name }}: {{ variant.value }}
      </p>

      <h4 class="mt-4 mb-2">Shipping and returns</h4>
      <p
        v-show="storeDetails.refund_policy.return_allowed == 'true'"
        style="font-size: 14px"
      >
        <span class="secondary--text"
          >Free return within {{ storeDetails.refund_policy.return_window }}
          {{ storeDetails.refund_policy.return_window > 1 ? "days" : "day" }}
          from {{ storeDetails.name }}</span
        ><br />
        <span style="font-weight: 600"
          >What qualifies a product for returns ?</span
        ><br />
        <span>{{ storeDetails.refund_policy.return_precondition }}</span><br />
        <span style="font-size: 14px; font-weight: 600"
          >Can a customer replace a product in the event of a return ?</span
        ><br />
        <span>{{
          storeDetails.refund_policy.product_replacable_on_return == "true"
            ? "Yes, a customer can replace a product on return"
            : "No, a customer cannot replace a product on return"
        }}</span>
      </p>
      <p
        v-show="storeDetails.refund_policy.return_allowed == 'false'"
        style="font-size: 14px"
      >
        Returns are not allowed for this product
      </p>
    </div>
    <!-- select quantity container -->
    <div class="mt-5 d-flex align-center">
      <!-- <div class="d-flex align-center mr-5">
        <span class="minus-btn" @click="decreaseNum">-</span>
        <span class="mx-4">{{ quantity }}</span>
        <span class="add-btn" @click="increaseNum">+</span>
      </div> -->
      <h4 class="mb-3">
        No. of items: <span>{{ pageDetails.orderDetails.total_items }}</span>
      </h4>
      <p class="mb-0">
        <span class="primary--text mr-4" style="font-size: 20px"
          >&#8358;{{ pageDetails.orderDetails.subtotal_label }}</span
        >
        <br /><span class="secondary--text" style="font-size: 14px"
          >Delivery fee not included yet</span
        >
      </p>
    </div>
    <div class="btn-container">
      <v-checkbox
        v-model="acceptTerms"
        label="By clicking continue, you are agreeing to our terms of service, shipping and return policies."
        class="mt-7"
      ></v-checkbox>
      <v-btn
        class="primary mt-7 mb-3"
        @click="gotoDeliveryPage"
        :disabled="!acceptTerms"
        >Continue</v-btn
      >
      <v-checkbox
        v-model="acceptTerms"
        label="By clicking continue, you are agreeing to our terms of service and our
        disclaimer"
      ></v-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  name: "CheckoutDetails",
  props: ["productDetails", "orderDetails", "storeDetails"],
  data: function () {
    return {
      quantity: 0,
      acceptTerms: false,
      readMoreActivated: false,
    };
  },
  computed: {
    pageDetails() {
      return {
        productDetails: this.productDetails,
        orderDetails: this.orderDetails,
        storeDetails: this.storeDetails,
      };
    },
  },
  methods: {
    increaseNum() {
      this.quantity = parseInt(this.quantity, 10) + 1;
    },
    decreaseNum() {
      if (this.quantity > 1) {
        this.quantity = parseInt(this.quantity, 10) - 1;
      }
    },
    gotoDeliveryPage() {
      this.$router.push({
        path: `/payment-details?order_id=${this.orderDetails.id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.image-container {
  width: 80%;
  background: #fff;
  margin: auto;
  border-radius: 12px;
  position: relative;
  img {
    width: 100%;
  }
}
.seller-image {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  img {
    width: 100%;
    height: 100%;
  }
}
.add-btn {
  border-radius: 50%;
  background: #029b97;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: center;
  cursor: pointer;
}
.minus-btn {
  border-radius: 50%;
  background: #f3f5ff;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  color: #029b97;
  justify-content: center;
  cursor: pointer;
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 40px;
  min-width: 200px;
  padding: 0 16px;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 500px) {
  .btn-container {
    text-align: center;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 100%;
  }
}
</style>