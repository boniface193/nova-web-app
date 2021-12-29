<template>
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

    <div v-else class="checkout-page__details" id="checkout-page__details">
      <p class="secondary--text small-font-size mb-5">
        {{ numberOfItems }}
        {{ items }}
      </p>

      <div class="checkout-page__details__content">
        <div class="checkout-page__details__content__image-view">
          <div class="checkout-page__details__content__image-view__multiple">
            <div class="items-container" ref="items_container">
              <div
                class="
                  checkout-page__details__content__image-view__multiple__item
                "
                v-for="(item, index) in orderDetails.items"
                :class="{ active: activeImageIndex == index }"
                :key="index"
                @click="setinViewProduct(index)"
              >
                <img :src="item.product_image_url" alt="" />
              </div>
            </div>
            <div
              class="
                checkout-page__details__content__image-view__multiple__up-btn
                scroll-btn
              "
              @click="scrollUp()"
            >
              <v-icon class="primary--text" style="font-size: 20px"
                >mdi-arrow-up</v-icon
              >
            </div>
            <div
              class="
                checkout-page__details__content__image-view__multiple__down-btn
                scroll-btn
              "
              @click="scrollDown()"
            >
              <v-icon class="primary--text" style="font-size: 20px"
                >mdi-arrow-down</v-icon
              >
            </div>
          </div>
          <!-- this view shows only on mobile -->
          <div
            class="
              checkout-page__details__content__image-view__multiple--mobile
            "
          >
            <div class="items-container" ref="items_container__mobile">
              <div
                class="
                  checkout-page__details__content__image-view__multiple--mobile__item
                "
                :class="{ active: activeImageIndex == index }"
                v-for="(item, index) in orderDetails.items"
                @click="setinViewProduct(index)"
                :key="index"
              >
                <img :src="item.product_image_url" alt="" />
              </div>
            </div>
            <div
              class="
                checkout-page__details__content__image-view__multiple--mobile__left-btn
                scroll-btn
              "
              @click="scrollLeft()"
            >
              <v-icon class="primary--text" style="font-size: 20px"
                >mdi-arrow-left</v-icon
              >
            </div>
            <div
              class="
                checkout-page__details__content__image-view__multiple--mobile__right-btn
                scroll-btn
              "
              @click="scrollRight()"
            >
              <v-icon class="primary--text" style="font-size: 20px"
                >mdi-arrow-right</v-icon
              >
            </div>
          </div>

          <div class="checkout-page__details__content__image-view__single">
            <v-carousel
              class="carousel-content"
              height="100%"
              cycle
              hide-delimiter-background
              show-arrows-on-hover
            >
              <v-carousel-item
                v-for="(slide, index) in inViewProduct.other_images"
                :key="index"
              >
                <img :src="slide" alt="" />
              </v-carousel-item>
            </v-carousel>
          </div>
        </div>
        <!-- product details section -->
        <div class="checkout-page__details__content__text-view">
          <div class="order-item-font mt-2">
            Product Name:
            <span class="order-no-grey">
              {{ inViewProduct.product_name }}
            </span>
          </div>
          <div class="order-item-font mt-2">
            Product Price:
            <span class="order-no-grey">
              NGN {{ inViewProduct.product_price }}
            </span>
          </div>
          <div class="order-item-font mt-2">
            Point:
            <span class="order-no-grey">
              {{ inViewProduct.points }}
            </span>
          </div>
          <!-- <div
            class="order-item-font mt-1"
            v-for="(variant, index) in orderDetails.variants"
            :key="index"
          >
            {{ variant.name }}:
            <span class="order-no-grey">{{ variant.value }}</span>
          </div> -->
          <div class="order-item-font mt-8">
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
          <div class="order-item-font my-2">Shipping and Billing Address</div>
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
              orderDetails.delivery_status_label
            }}</span>
          </div>

          <div class="d-flex">
            <div class="order-no-grey">
              {{ address }}
            </div>
          </div>
          <div class="order-item-font mt-2">
            Delivery Method:
            <span class="order-no-blue ml-2 mr-10">{{
              orderDetails.delivery_method
            }}</span>
          </div>
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
  </div>
</template>

<script>
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
export default {
  components: { Modal },
  name: "orderDetails",
  data() {
    return {
      orderDetails: [],
      statusImage: null,
      dialog: false,
      dialogMessage: "",
      date: "",
      time: "",
      customerName: "",
      address: "",
      phone: "",
      email: "",
      numberOfItems: "",
      items: "",
      pageLoader: true,
      inViewProduct: { variants: [] },
      activeImageIndex: 0,
    };
  },
  created() {
    this.getOrderDetailsByID();
  },
  methods: {
    getOrderDetailsByID() {
      this.$store
        .dispatch("orders/getOpenSellingById", {
          id: this.$route.params.id,
        })
        .then((response) => {
          this.pageLoader = false;
          let data = response.data.data;
          this.orderDetails = data;
          this.date = data.created_at.slice(0, -6);
          this.time = data.created_at.slice(10);
          this.customerName = data.customer.name;
          this.address = data.delivery_location.address;
          this.phone = data.customer.phone;
          this.email = data.customer.email;
          this.numberOfItems = data.items.length;
          this.items = data.items.length > 1 ? "items" : "item";
          this.addImageToOtherImages(0);
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

    setinViewProduct(index) {
      this.inViewProduct = this.orderDetails.items[index];
      this.activeImageIndex = index;
    },
    addImageToOtherImages() {
      this.orderDetails.items.forEach((item, index) => {
        let mainImage = item.product_image_url;
        this.orderDetails.items[index].other_images.unshift(mainImage);
        let uniqueImage = new Set(this.orderDetails.items[index].other_images);
        uniqueImage = Array.from(uniqueImage);
        this.orderDetails.items[index].other_images = uniqueImage;
      });
      this.setinViewProduct(0);
    },

    scrollDown() {
      this.$refs.items_container.scrollBy(0, 150);
    },
    scrollUp() {
      this.$refs.items_container.scrollBy(0, -150);
    },
    scrollRight() {
      this.$refs.items_container__mobile.scrollBy(150, 0);
    },
    scrollLeft() {
      this.$refs.items_container__mobile.scrollBy(-150, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./OpenOrderDetails.scss";
</style>