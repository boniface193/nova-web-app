<template>
  <v-container>
    <div>
      <div class="chOder" style="margin-top: 0px">
        <v-icon
          class="float-left"
          style="cursor: pointer"
          @click.prevent="$router.back()"
          >mdi-chevron-left</v-icon
        >
        <h5 class="text-center">Order Details</h5>
      </div>

      <div v-if="pageLoader" class="text-center my-8">
        <!-- this image time loader is calculated by the loader to triger the load time -->
        <v-progress-circular
          color="#029B97"
          class="text-center"
          indeterminate
          size="20"
          width="2"
        ></v-progress-circular>
      </div>

      <div v-else>
        <div
          style="
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 28px;
            color: rgba(43, 43, 43, 0.8);
          "
        >
          {{ orderDetails.items.length == 0 ? "1" : orderDetails.items.length }}
          {{ orderDetails.items.length > 1 ? "items" : "item" }}
        </div>

        <div>
          <v-sheet class="mx-auto mb-8" v-if="orderDetails.items.length >= 1">
            <v-slide-group
              v-model="model"
              class="pa-sm-4 py-4"
              mandatory
              show-arrows
            >
              <v-slide-item
                v-for="(n, index) in orderDetails.items"
                :key="n.id"
                v-slot="{ active, toggle }"
              >
                <v-card
                  :outlined="active ? true : false"
                  :color="active ? 'primary' : ''"
                  class="ma-4 elevation-0"
                  height="102"
                  width="100"
                  @click="toggle"
                  v-on:click="setCurrentViewProduct(index)"
                >
                  <v-img
                    :src="n.product_image_url"
                    height="100"
                    width="100"
                  ></v-img>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>

          <v-img
            class="my-8"
            v-else
            :src="orderDetails.product_image_url"
            height="100"
            width="100"
          ></v-img>

          <v-row>
            <v-col sm="6">
              <div class="order-item-font mt-2">
                Product Name:
                <span class="order-no-grey">
                  {{ currentViewProduct.product_name }}
                </span>
              </div>
              <div
                class="order-item-font mt-1"
                v-for="(variant, index) in currentViewProduct.variants"
                :key="index"
              >
                {{ variant.name }}:
                <span class="order-no-grey">{{ variant.value }}</span>
              </div>
              <div class="order-item-font mt-1">
                Date:
                <span class="order-no-grey">{{ date }} </span>
              </div>
              <div class="order-item-font mt-1">
                Time:
                <span class="order-no-grey">{{ time }} </span>
              </div>
              <div class="order-item-font mt-1">
                Customer:
                <span class="order-no-grey">{{ customerName }}</span>
              </div>
              <div class="order-item-font mt-8">
                Payment Status:
                <span class="order-no-blue ml-2">
                  {{ orderDetails.payment_status_label }}</span
                >
              </div>

              <div class="order-no-grey d-flex">
                Subtotal
                <v-spacer></v-spacer>
                <div class="">
                  <div class="">NGN{{ orderDetails.subtotal_label }}</div>
                </div>
              </div>

              <div class="order-no-grey d-flex">
                Shipping
                <v-spacer></v-spacer>
                <div class="d-flex justify-space-between">
                  <div>NGN{{ orderDetails.delivery_fee_label }}</div>
                </div>
              </div>

              <div class="d-flex mt-2">
                <span class="order-item-font"> Total Paid</span>
                <v-spacer></v-spacer>
                <div class="order-no-blue">
                  NGN{{ orderDetails.total_price_label }}
                </div>
              </div>
            </v-col>
            <v-col sm="6">
              <div class="order-item-font my-2">
                Shipping and Billing Address
              </div>
              <div class="order-no-grey mb-3">
                {{ address }}
                <div class="mt-2">
                  <span
                    ><v-icon size="14.35" color="primary" class="mr-2"
                      >mdi-phone-outline</v-icon
                    >{{ phone }}</span
                  ><br />
                  <span
                    ><v-icon size="14.35" color="primary" class="mr-2"
                      >mdi-email-outline</v-icon
                    >{{ email }}</span
                  >
                </div>
              </div>
              <div class="order-item-font mt-2">
                Delivery Status:
                <span class="order-no-blue ml-2 mr-10">{{
                  currentViewProduct.delivery_status
                }}</span>
              </div>

              <div class="d-flex mb-8">
                <div class="order-no-grey">
                  {{ address }}
                </div>
              </div>

              <div class="order-item-font my-2">
                Points Earned:
                <span class="order-no-blue ml-2 mr-10">
                  {{ currentViewProduct.total_points }}</span
                >
              </div>

              <div class="order-item-font my-2 mb-8">
                Profit:
                <span class="order-no-blue ml-2 mr-10">
                  NGN{{ currentViewProduct.seller_profit }}</span
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
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
  </v-container>
</template>

<script>
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "orderDetails",
  components: { Modal },
  data() {
    return {
      model: null,
      orderDetails: [],
      statusImage: null,
      date: "",
      time: "",
      customerName: "",
      address: "",
      phone: "",
      email: "",
      pageLoader: true,
      dialogMessage: "",
      dialog: false,
      initialScrollViewDown: 0,
      initialScrollViewUp: 0,
      currentViewProduct: { product: { variants: [] } },
    };
  },
  created() {
    this.$store
      .dispatch("orders/getOrdersDetail", { id: this.$route.params.id })
      .then((response) => {
        let data = response.data.data;
        this.pageLoader = false;
        this.orderDetails = data;
        this.currentViewProduct = this.orderDetails.items[0];
        this.date = data.created_at.slice(0, -6);
        this.time = data.created_at.slice(10);
        this.customerName = data.customer.name;
        this.address = data.delivery_location.address;
        this.phone = data.customer.phone;
        this.email = data.customer.email;
      })
      .catch((error) => {
        this.pageLoader = false;
        this.dialog = true;
        this.statusImage = failedImage;
        if (error.status == 422 || error.status == 400) {
          this.dialogMessage = error.data.message;
        } else if (error.status === 404) {
          this.dialogMessage = "404 not found";
        } else if (error.status === 500) {
          this.dialogMessage = "Something went wrong, please try again";
        } else if (!navigator.onLine) {
          this.dialogMessage = "No internet connection!";
        }
      });
  },

  methods: {
    setCurrentViewProduct(index) {
      this.currentViewProduct = this.orderDetails.items[index];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "OrderDetails.scss";
</style>