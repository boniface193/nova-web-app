<template>
  <div class="px-4 py-5" style="background: #fafafa; height: 100%">
    <!-- go to previous page -->
    <router-link
      :to="{
        path: `/openSellingCheckout-details?OpenOrder_id=${this.orderDetails.id}`,
      }"
      style="text-decoration: none"
      class="mx-5"
      v-if="this.$route.name === 'PaymentDetails'"
    >
      <span class="back-btn">
        <v-icon color="black" style="font-size: 25px">mdi-chevron-left</v-icon>
      </span>
    </router-link>

    <v-row v-show="!pageLoader">
      <v-col class="col-12 col-md-6 pt-5 pt-md-15 px-5">
        <div
          class="image-container pa-10"
          :class="this.$route.name === 'PaymentDetails' ? 'hide-image' : ''"
        >
          <img
            :src="selectedImg || orderDetails.product_image_url"
            alt=""
          />
        </div>
        <!-- sliding images -->
        <v-sheet class="mx-auto" max-width="800">
          <v-slide-group
            v-model="model"
            class="pa-sm-4 py-4"
            mandatory
            show-arrows
          >
            <v-slide-item
              v-for="n in orderDetails.other_images"
              :key="n.id"
              v-slot="{ active, toggle }"
            >
              <v-card
                :color="active ? 'primary' : 'grey lighten-1'"
                class="ma-4 elevation-0"
                height="100"
                width="100"
                @click="toggle"
                v-on:click="selectByImage(n)"
              >
                <v-img :src="n" height="100" width="100"></v-img>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
        <!-- sliding images -->
      </v-col>
      <v-col class="col-12 col-md-6 pt-5 pt-md-15 pr-0">
        <router-view
          :orderDetails="orderDetails"
          :sellerDetails="sellerDetails"
        />
      </v-col>
    </v-row>
    <!-- page loader -->
    <div class="d-flex py-5 text-center" v-if="pageLoader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
    </div>
    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog" width="400">
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
    </Modal>
  </div>
</template>
<script>
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "CheckoutPage",
  components: { Modal },
  data: function () {
    return {
      model: null,
      selectedImg: "",
      dialog: false,
      statusImage: null,
      dialogMessage: "",
      orderDetails: {
        delivery_location: {},
        customer: {},
        product_description: ""
      },
      sellerDetails: {},
      pageLoader: false,
    };
  },
  created() {
    this.pageLoader = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("OpenOrder_id");
    this.$store
      .dispatch("orders/getOpenSellingById", {
        id: orderId,
      })
      .then((response) => {
        if (response.data.data.payment_status === "PAID") {
          this.$router.push({
            path: `/openOrder-status?OpenOrder_id=${orderId}`,
          });
        } else {
          this.orderDetails = response.data.data;
          this.orderDetails.other_images.push(this.orderDetails.product_image_url);
          this.getSellerDetails(this.orderDetails.seller_id);
        }
      })
      .catch((error) => {
        this.pageLoader = false;
        this.statusImage = failedImage;
        this.dialog = true;
        if (error.status == 422 || error.status == 400) {
          this.dialogMessage = error.data.message;
        } else if (error.status == 404) {
          this.dialogMessage = "404 not found";
        } else if (error.status == 500) {
          this.dialogMessage = "Something went wrong, please try again";
        } else if (!navigator.onLine) {
          this.dialogMessage = "No internet connection!";
        } else {
          this.dialogMessage = error.message;
        }
      });
  },
  methods: {
    selectByImage(params) {
      this.selectedImg = this.orderDetails.other_images.find(
        (item) => item == params
      );
    },
    getSellerDetails(seller_id) {
      this.$store
        .dispatch("onboarding/getSellerDetails", {
          id: seller_id,
        })
        .then((response) => {
          this.sellerDetails = response.data.data;
          this.pageLoader = false;
        })
        .catch((error) => {
          this.pageLoader = false;
          this.statusImage = failedImage;
          this.dialog = true;
          if (error.status == 422 || error.status == 400) {
            this.dialogMessage = error.data.message;
          } else if (error.status === 404) {
            this.dialogMessage = "404 not found";
          } else if (error.status === 500) {
            this.dialogMessage = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.dialogMessage = "No internet connection!";
          } else {
            this.dialogMessage = error.message;
          }
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
  @media (max-width: 750px) {
    width: 90%;
  }
  img {
    min-width: 90%;
    max-width: 100%;
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 960px) {
  .hide-image {
    display: none !important;
  }
}
</style>
