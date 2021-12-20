<template>
  <div class="px-8">
    <div class="d-flex align-center mb-2" v-if="sellerDetails.photo != null">
      <!-- profile section -->
      <div class="profile-container">
        <img :src="sellerDetails.photo" alt="" />
      </div>
      <!-- verified section -->
      <div class="verified-container">
        <img src="@/assets/icons/verifiedIcon.svg" alt="" />
      </div>
      <p class="mb-0 ml-1 primary--text">Verified!</p>
    </div>
    <div class="d-flex align-center mb-3">
      <p class="secondary--text mr-1 mb-0" style="font-size: 14px">
        Chat Seller:
      </p>

      <a
        :href="
          '//' +
          `api.whatsapp.com/send?text=Hello my name is ${pageDetails.orderDetails.customer.name}&phone=${sellerDetails.phone_number}`
        "
        target="_blank"
        style="text-decoration: none"
      >
        <v-icon color="#64B161" class="ml-2 mr-2" style="cursor: pointer"
          >mdi-whatsapp</v-icon
        >
        {{ pageDetails.orderDetails.seller_name }}
      </a>
    </div>
    <!-- </div> -->
    <h2 class="mb-1">{{ pageDetails.orderDetails.product_name }}</h2>

    <!-- product description -->
    <div class="mt-4">
      <h4 class="mb-2">Description</h4>
      <p
        class="secondary--text mb-0 text-truncate"
        v-if="!readMoreActivated"
        style="font-size: 14px"
      >
        {{ pageDetails.orderDetails.product_description.slice(0, 200) }}
      </p>
      <a
        class="primary--text"
        v-if="!readMoreActivated"
        @click="readMoreActivated = true"
        >view more</a
      >
      <p
        class="secondary--text mb-0"
        v-if="readMoreActivated"
        style="font-size: 14px"
      >
        {{ pageDetails.orderDetails.product_description }}
      </p>
      <a
        class="primary--text"
        v-if="readMoreActivated"
        @click="readMoreActivated = false"
        >view less</a
      >

    </div>
    <!-- select quantity container -->
    <div class="mt-5">
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
    <div class="btn-container mt-5">
      <div class="text-body-1 error--text">
        Disclaimer
      </div>
      
      <div class="text-caption">
        Return Policy is between a seller and the customer, kuuzza is acting as a decentralized platform for both the seller and customer, we will not be held responsible for any conflict resulting from return policy here after.
      </div>

      <v-btn
        class="primary my-3 elevation-0"
        @click="gotoDeliveryPage"
        >Continue</v-btn
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "CheckoutDetails",
  props: ["orderDetails", "sellerDetails"],
  data: function () {
    return {
      quantity: 0,
      readMoreActivated: false,
    };
  },
  computed: {
    pageDetails() {
      return {
        orderDetails: this.orderDetails,
        sellerDetails: this.sellerDetails,
      };
    },
  },
  methods: {
    gotoDeliveryPage() {
      this.$router.push({
        path: `/open-selling-payment-details?OpenOrder_id=${this.orderDetails.id}`,
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
.profile-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-align: center;
  background: #ddf8f7;
  img {
    width: 100%;
    height: 100%;
  }
}
.verified-container {
  width: 20px;
  margin-left: 10px;
  align-items: center;
  display: flex;
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