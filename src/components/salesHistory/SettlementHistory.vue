<template>
  <div>
    <div>
      <!-- title section  -->
      <div
        class="d-flex align-center justify-center mb-8"
        style="position: relative"
      >
        <router-link :to="{ path: '/dashboard' }" style="text-decoration: none">
          <span class="back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </router-link>
        <h3 class="align-self-center">Settlement History</h3>
      </div>

      <!-- contents -->
      <div class="pt-10 pb-5" v-show="!fetchingData">
        <div class="">
          <v-row>
            <v-col
              class="col-12 col-lg-4 col-sm-6"
              v-for="item in settlementList"
              :key="item.id"
            >
              <v-card outlined class="rounded-lg py-3">
                <v-row>
                  <v-col cols="5">
                    <div class="text-center">
                      <v-img
                        :src="item.meta.product_image_url"
                        class="mx-3 my-5 image-bgColor"
                        width="90%"
                        height="150px"
                      ></v-img>
                    </div>
                  </v-col>

                  <v-col cols="7" class="pr-5 pl-1 my-lg-3 my-md-3">
                    <div class="order-item-font mt-1">
                      Order ID:
                      <span class="order-no-grey mx-1">
                        {{ item.order_id }}</span
                      >
                    </div>
                    <div class="order-item-font mt-1">
                      Settlement Status:
                      <span class="order-no-grey mx-1"> {{ item.status }}</span>
                    </div>
                    <div class="order-item-font mt-1">
                      Profit:
                      <span class="order-no-grey mx-1"
                        >&#8358;{{ item.amount_label }}</span
                      >
                    </div>
                    <div class="order-item-font mt-1">
                      Amount:
                      <span class="order-no-grey mx-1"
                        >&#8358;{{ item.meta.product_price }}</span
                      >
                    </div>
                    <div class="order-item-font mt-1">
                      Due date:
                      <span class="order-no-grey mx-1">{{
                        item.due_date ? item.due_date : "pending"
                      }}</span>
                    </div>
                    <div class="order-item-font mt-1">
                      Settlement date:
                      <span class="order-no-grey mx-1">{{
                        item.date_settled ? item.date_settled : "pending"
                      }}</span>
                    </div>
                    <div class="order-item-font mt-1">
                      Payout date:
                      <span class="order-no-grey mx-1">{{
                        item.date_paidout ? item.date_paidout : "pending"
                      }}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div
          class="text-center"
          v-show="settlementList.length == 0 && !fetchingData"
        >
          <p>No settlements History Available yet!</p>
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
  name: "SettlementHistory",
  components: { modal },
  data: function () {
    return {
      fetchingData: false,
      settlementList: [],
      dialog: false,
      dialogMessage: "",
      statusImage: null,
    };
  },
  created() {
    this.fetchingData = true;
    if (this.$store.getters["settings/profile"].name === "") {
      this.$store.dispatch("settings/getUserProfile").then(() => {
        this.getSettlementHistory();
      });
    } else {
      this.getSettlementHistory();
    }
  },
  methods: {
    getSettlementHistory() {
      let sellerId = this.$store.getters["settings/profile"].id;
      axios
        .get(`${sellerId}/settlements`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          this.fetchingData = false;
          this.settlementList = response.data.data;
        })
        .catch((error) => {
          this.fetchingData = false;
          if (error.response.status === (422 || 400)) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.response.data.message;
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