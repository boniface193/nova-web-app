<template>
  <div style="height: 100%">
    <div class="order-details-container">
      <div class="order-details pa-3" v-show="!pageLoader">
        <h3>Order status</h3>
        <div>
          <step-progress
            :steps="['Processing', 'Shipped', 'Delivered']"
            :current-step="
              orderDetails.isProcessing ||
              orderDetails.isShipped ||
              orderDetails.isDelivered
                ? 1
                : 0
            "
            icon-class="fa fa-check"
            :line-thickness="lineThickness"
            active-color="#5064CC"
            :active-thickness="activeThickness"
            :passive-thickness="passiveThickness"
            passive-color="#5E5E5E1A"
            class="my-4"
          ></step-progress>
          <v-row class="mt-5">
            <v-col class="col-12 col-sm-5">
              <div class="image-container">
                <img :src="orderDetails.product_image_url" alt="" />
              </div>
            </v-col>
            <v-col class="col-12 col-sm-7">
              <div>
                <p class="mb-0" style="font-size: 14px">
                  <span style="font-weight: 600">Order No: </span
                  ><span class="primary--text">{{ orderDetails.id }}</span>
                </p>
                <p class="mb-0" style="font-size: 14px">
                  <span style="font-weight: 600">Customer: </span
                  ><span class="secondary--text">{{
                    orderDetails.customer.name
                  }}</span>
                </p>
                <p class="mb-0" style="font-size: 14px">
                  <span style="font-weight: 600">Payment status: </span
                  ><span class="secondary--text">{{
                    orderDetails.payment_status_label
                  }}</span>
                </p>
                <p class="mb-0" style="font-size: 14px">
                  <span style="font-weight: 600">Total price paid: </span
                  ><span class="secondary--text"
                    >&#8358;{{ orderDetails.total_price_label }}</span
                  >
                </p>
                <p class="mb-0" style="font-size: 14px">
                  <span style="font-weight: 600">Time: </span
                  ><span class="secondary--text mr-2">{{
                    orderDetails.created_at.slice(0, -6)
                  }}</span>
                  <span class="secondary--text mr-2">{{
                    orderDetails.created_at.slice(10)
                  }}</span>
                </p>

                <p class="mb-0" style="font-size: 14px">
                  <span style="font-weight: 600">Deliver location: </span
                  ><span class="secondary--text mr-2">{{
                    orderDetails.delivery_location.address
                  }}</span>
                </p>
              </div>
            </v-col>
          </v-row>
          <div class="d-flex align-center justify-center mt-5">
            <p class="secondary--text mr-1 mb-0" style="font-size: 14px">
              Chat Seller:
            </p>

            <a
              :href="
                '//' +
                `api.whatsapp.com/send?text=''&phone=${orderDetails.customer.phone}`
              "
              target="_blank"
              style="text-decoration: none"
            >
              <v-icon color="#64B161" class="ml-2 mr-2" style="cursor: pointer"
                >mdi-whatsapp</v-icon
              >
            </a>
            <h5>{{ orderDetails.seller_name }}</h5>
          </div>
        </div>
      </div>
      <!-- page loader -->
      <div class="d-flex py-5 text-center" v-if="pageLoader">
        <v-progress-circular
          indeterminate
          color="primary"
          class="mx-auto"
        ></v-progress-circular>
      </div>
    </div>
    <!-- modal for dialog messages -->
    <modal :dialog="dialog" width="400">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="dialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div class="mb-7 mt-5 mx-auto status-img">
          <v-img :src="statusImage"></v-img>
        </div>

        <h4>{{ dialogMessage }}</h4>
      </div>
    </modal>
  </div>
</template>
<script>
import failedImage from "@/assets/images/failed-img.svg";
import StepProgress from "vue-step-progress";
import modal from "@/components/modal.vue";
// import the css (OPTIONAL - you can provide your own design)
import "vue-step-progress/dist/main.css";
export default {
  name: "OrderStatus",
  components: { modal, StepProgress },
  data: function () {
    return {
      dialog: false,
      statusImage: null,
      dialogMessage: "",
      orderDetails: {
        delivery_location: {},
        customer: {},
        created_at: "",
      },
      pageLoader: false,
      lineThickness: 1,
      activeThickness: 3,
      passiveThickness: 3,
      mySteps: ["Step 1", "Step 2", "Step 3"],
    };
  },
  created() {
    this.pageLoader = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    this.$store
      .dispatch("orders/getOrdersDetail", {
        id: orderId,
      })
      .then((response) => {
        this.orderDetails = response.data.data;
        this.pageLoader = false;
      })
      .catch((error) => {
        this.pageLoader = false;
        this.dialog = true;
        this.statusImage = failedImage;
        if (error.response) {
          this.dialogMessage = "Sorry, this data does not Exist";
        } else {
          this.dialogMessage = "No internet Connection!";
        }
      });
  },
};
</script>
<style lang="scss" scoped>
.order-details-container {
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .order-details {
    background: #fff;
    border-radius: 12px;
    width: 500px;
    margin: auto;
  }
  .image-container {
    width: 80%;
    background: #fff;
    margin: auto;
    border-radius: 12px;
    position: relative;
    img {
      width: 100%;
      border-radius: 8px;
    }
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
div.step-progress__step span {
  color: var(--passiveColor);
  transition: 0.3s ease;
  display: none !important;
  font-size: 50px;
  transform: translateZ(0) scale(1) perspective(1000px);
  font-weight: 900;
  text-align: center;
  opacity: 1;
}

.step-progress__step-label {
  position: absolute;
  top: calc(100% + 25px);
  left: 50%;
  transform: translateX(-50%) perspective(1000px);
  white-space: nowrap;
  font-size: 10px;
  font-weight: normal;
  color: #979797 !important;
  transition: 0.3s ease;
  font-family: "Product Sans Regular";
}

.step-progress__step:after {
  width: 13px;
  height: 13px;
}

.step-progress__bar {
  width: 100%;
  display: flex;
  height: 15px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.position-abs {
  position: absolute !important;
  color: #029B97;
  font-size: 20px !important;
  opacity: 0.5;
}
@media (max-width: 599px) {
  .order-details-container {
    padding: 0px 5%;
    .order-details {
      width: 100%;
    }
  }
}
</style>
