<template>
  <div>
    <div>
      <!-- title section  -->
      <div
        class="d-flex align-center justify-center mb-8"
        style="position: relative"
      >
        <router-link :to="{ name: 'WithdrawFund' }" style="text-decoration: none">
          <span class="back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </router-link>
        <h3 class="align-self-center">Payment History</h3>
      </div>

      <!-- contents -->
      <div class="pb-5" v-show="!fetchingData">
        <div class="">
          <v-row>
            <v-col class="col-12 col-lg-3 col-sm-6 mb-4" v-for="item in paymentHistory" :key="item.id">
              <v-card outlined class="rounded-lg py-3">
                <v-row class="px-3">
                  <!-- <v-col cols="5">
                    <div class="text-center">
                      <v-img
                        :src="item.product_image_url"
                        class="mx-3 my-5 image-bgColor"
                        width="90%"
                      ></v-img>
                    </div>
                  </v-col> -->

                  <v-col cols="12">
                    <div class="order-item-font mt-1">
                      Order ID:
                      <span class="primary--text mx-1"> {{ item.id }}</span>
                    </div>
                    <div class="order-item-font mt-1">
                      Settlement Status:
                      <span class="order-no-grey mx-1"> {{ item.status }}</span>
                    </div>
                    <div class="order-item-font mt-1">
                      Price Of Item:
                      <span class="order-no-grey mx-1"
                        >&#8358;{{ item.amount }}</span
                      >
                    </div>
                    <!-- <div class="order-item-font mt-1">
                      Due date:
                      <span class="order-no-grey mx-1"
                        >{{ item.created_at }}</span
                      >
                    </div> -->
                   <div class="order-item-font mt-1">
                      Settlement date:
                      <span class="order-no-grey mx-1"
                        >{{ item.created_at }}</span
                      >
                    </div>
                    <!-- <div class="order-item-font mt-1">
                      Paid out date:
                      <span class="order-no-grey mx-1"
                        >{{ item.date_paidout }}</span
                      >
                    </div> -->
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div
          class="text-center"
          v-show="paymentHistory.length == 0 && !fetchingData"
        >
          <p>No Payment History Available</p>
        </div>
      </div>

      <!-- loader -->
      <div class="text-center pt-10 pb-5" v-show="fetchingData">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>

      <!--------------------------- modal for dialog messages ------------------------------>
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
  </div>
</template>
<script>
import axios from "@/axios/bankServices.js";
import failedImage from "@/assets/images/failed-img.svg";
import modal from "@/components/modal.vue";
export default {
  name: "PaymentHistory",
  components: { modal },
  data: function () {
    return {
      fetchingData: false,
      paymentHistory: [],
      dialog: false,
      dialogMessage: "",
      statusImage: null,
    };
  },
  created() {
    this.fetchingData = true;
    if (this.$store.getters["settings/profile"].name === "") {
      this.$store.dispatch("settings/getUserProfile").then(() => {
        this.getPaymentHistory();
      });
    } else {
      this.getPaymentHistory();
    }
  },
  methods: {
    getPaymentHistory() {
      console.log(22)
      let sellerId = this.$store.getters["settings/profile"].id;
      axios
        .get(`payouts/${sellerId}/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          this.fetchingData = false;
          this.paymentHistory = response.data.data;
        })
        .catch((error) => {
          this.fetchingData = false;
          this.statusImage = failedImage;
          this.dialog = true;
          if (error.response) {
            this.dialogMessage = "Something went wrong, pls try again!";
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.back-btn {
  position: absolute;
  left: 0px;
  top: 0px;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
</style>