<template>
  <div>
    <div class="checkout-page__details">
      <div v-show="!pageLoader">
        <h3 class="text-center">Order status</h3>
        <p class="mb-8">
          {{ this.orderDetails.cart_items.length }}
          {{ this.orderDetails.cart_items.length > 1 ? "items" : "item" }}
        </p>
        <div>
          <div class="checkout-page__details__content">
            <div class="checkout-page__details__content__image-view">
              <div
                class="checkout-page__details__content__image-view__multiple"
              >
                <div class="items-container" ref="items_container">
                  <div
                    class="
                      checkout-page__details__content__image-view__multiple__item
                    "
                    v-for="(item, index) in orderDetails.cart_items"
                    :class="{ active: activeImageIndex == index }"
                    :key="index"
                    @click="setinViewProduct(index)"
                  >
                    <img :src="item.product.image" alt="" />
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
                    v-for="(item, index) in orderDetails.cart_items"
                    @click="setinViewProduct(index)"
                    :key="index"
                  >
                    <img :src="item.product.image" alt="" />
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
                >
                  <v-carousel-item
                    v-for="(slide, index) in inViewProduct.product.other_images"
                    :key="index"
                  >
                    <img style="width: 100%" :src="slide" alt="" />
                  </v-carousel-item>
                </v-carousel>
              </div>
            </div>
            <!-- product details section -->
            <div class="checkout-page__details__content__text-view">
              <p>
                <span class=""><h4>Order No:</h4></span
                ><span class="primary--text text-md-h6 text-body-1">{{
                  orderDetails.id
                }}</span>
              </p>
              <div class="d-flex">
                <div><h4 class="mr-2">Product Name:</h4></div>
                <div class="small-font-size secondary--text">
                  {{ inViewProduct.product.name }}
                </div>
              </div>
              <div class="d-flex">
                <div><h4 class="mr-2">Customer Name:</h4></div>
                <div class="small-font-size secondary--text">
                  {{ orderDetails.customer_name }}
                </div>
              </div>
              <div class="d-flex">
                <div><h4 class="mr-2">Delivery Location:</h4></div>
                <div class="small-font-size secondary--text">
                  {{ orderDetails.delivery_location.address }}
                </div>
              </div>
              <div class="d-flex">
                <div><h4 class="mr-2">Payment Status:</h4></div>
                <div class="small-font-size primary--text">
                  {{ orderDetails.is_paid ? "Paid" : "Not paid" }}
                </div>
              </div>
              <div class="d-flex">
                <div><h4 class="mr-2">Delivery Status:</h4></div>
                <div class="small-font-size primary--text">
                  {{ orderDetails.order.delivery_status_label }}
                </div>
              </div>
              <div class="d-flex">
                <div><h4 class="mr-2">Total Price:</h4></div>
                <div class="small-font-size primary--text">
                  &#8358;{{ orderDetails.total_label }}
                </div>
              </div>
              <!-- <h4 class="mt-4">Shipping and returns</h4>
              <p class="secondary--text small-font-size mb-1">
                Returns are {{inViewProduct.return_window == 0 ? 'not' : '' }} allowed for this product
              </p> -->
              <div class="d-flex">
                <h4>Chat Seller:</h4>

                <a
                  :href="
                    '//' +
                    `api.whatsapp.com/send?text=''&phone=${sellerDetails.phone_number}`
                  "
                  target="_blank"
                  style="text-decoration: none"
                >
                  <v-icon
                    color="#64B161"
                    class="ml-2 mr-2"
                    style="cursor: pointer"
                    >mdi-whatsapp</v-icon
                  >
                  {{ orderDetails.seller_name }}
                </a>
              </div>
              <div v-if="!orderDetails.order.delivery_confirmed" class="mt-3">
                <p class="mb-0 mt-3">
                  Please confirm you have successfully received your order
                </p>
                <v-btn
                  width="300"
                  class="primary"
                  :disabled="
                    loading2 ||
                    orderDetails.order.delivery_status_label !== 'Delivered'
                  "
                  :loading="loading2"
                  @click="confirmOrder()"
                  >Confirm order</v-btn
                >
              </div>
              <div
                v-else
                class="text-center primary px-3 py-1 white--text mt-3"
                style="width: 200px; border-radius: 5px"
              >
                Order confirmed
              </div>
            </div>
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

    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog2" width="400">
      <div class="white pa-3 px-5 dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="dialog2 = false"
            >mdi-close</v-icon
          >
        </div>
        <!-- otp resend alert -->
        <v-alert type="success" v-show="resendOtpSuccess"
          >OPT has been sent successfully!</v-alert
        >
        <div class="text-center mb-5 mt-5">
          <h3>Pls verify you're the buyer</h3>
        </div>
        <p class="mt-5 mb-5">
          An OTP has been sent to your email and mobile number for verification
        </p>
        <v-form>
          <div class="mt-0 mb-2">
            <v-otp-input
              ref="otpInput1"
              separator=""
              :num-inputs="5"
              :should-auto-focus="true"
              input-type="number"
              @on-complete="handleOnComplete"
              @on-change="handleOnChange"
            />
          </div>

          <!-- error message -->
          <p
            class="error--text"
            style="font-size: 14px"
            v-show="otpError == true"
          >
            {{ otpErrorMessage }}
          </p>

          <!-- button container -->
          <div class="pa-0 mt-5" style="width: 100%">
            <p>
              Didn't receive the code?
              <a style="text-decoration: none">
                <span
                  v-show="!resendOTPLoader && !showOTPTimer"
                  @click="resendOTP"
                  >Resend Code</span
                >
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="20"
                  class="ml-5"
                  v-show="resendOTPLoader"
                ></v-progress-circular>
                <span class="primary--text" v-show="showOTPTimer"
                  >You can resend OTP in
                  <span class="error--text">{{ timer }}.00</span></span
                >
              </a>
            </p>
            <v-btn
              class="primary px-16 py-5 mb-5 mx-auto"
              :disabled="otpLoader"
              :loading="otpLoader"
              @click="submitOTP()"
              >Verify</v-btn
            >
          </div>
        </v-form>
      </div>
    </Modal>

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
import OtpInput from "@/components/secondary/verifyInput";
import successImage from "@/assets/images/success-img.svg";
export default {
  name: "OrderStatus",
  components: {
    Modal,
    //  StepProgress,
    "v-otp-input": OtpInput,
  },
  data: function () {
    return {
      loading2: false,
      resendOtpSuccess: false,
      resendOTPLoader: false,
      showOTPTimer: true,
      timer: 60,
      // acceptTerms: false,
      otpLoader: false,
      verifyOTP: false,
      otp: "",
      otpErrorMessage: "",
      otpError: false,
      dialog: false,
      statusImage: null,
      dialog2: false,
      dialogMessage: "",
      sellerDetails: {},
      orderDetails: {
        delivery_location: {},
        cart_items: [],
        order: {},
      },
      pageLoader: false,
      // main
      initialScrollViewDown: 0,
      initialScrollViewUp: 0,
      inViewProduct: { product: {}, variants: [] },
      deliveryStatus: "",
      activeImageIndex: 0,
      activeCarousel: [],
    };
  },
  created() {
    this.pageLoader = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("session_id");
    this.$store
      .dispatch("orders/getOrderDetailsForCustomer", {
        id: orderId,
      })
      .then((response) => {
        this.orderDetails = response.data.data;
        this.getSellerDetails(this.orderDetails.seller_id);
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
  methods: {
    setinViewProduct(index) {
      this.inViewProduct = this.orderDetails.cart_items[index];
      this.activeImageIndex = index;
      this.deliveryStatus = this.orderDetails.cart_items[index].delivery_status;
    },
    addImageToOtherImages() {
      this.orderDetails.cart_items.forEach((item, index) => {
        let mainImage = item.product.image;
        this.orderDetails.cart_items[index].product.other_images.unshift(
          mainImage
        );
        let uniqueImage = new Set(
          this.orderDetails.cart_items[index].product.other_images
        );
        uniqueImage = Array.from(uniqueImage);
        this.orderDetails.cart_items[index].product.other_images = uniqueImage;
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

    // check if code changes
    handleOnChange(value) {
      this.otp = value;
      if (this.otp.length != 5) {
        this.verifyOTP = false;
      }
    },
    // checks if code is complete
    handleOnComplete(value) {
      this.verifyOTP = true;
      this.otp = value;
      this.otpError = false;
    },
    setOTPTimer() {
      this.showOTPTimer = true;
      let counter = setInterval(() => {
        if (this.timer === 1) {
          clearInterval(counter);
          this.showOTPTimer = false;
          this.timer = 60;
        } else {
          this.timer -= 1;
        }
      }, 1000);
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
          }
        });
    },
    confirmOrder() {
      this.loading2 = true;
      this.$store
        .dispatch("orders/sendConfirmOrderOTP", {
          orderId: this.orderDetails.order.id,
        })
        .then(() => {
          this.loading2 = false;
          this.otp.length > 0 ? this.$refs.otpInput1.clearInput() : "";
          this.dialog2 = true;
          this.setOTPTimer();
        })
        .catch((error) => {
          this.dialog = true;
          this.loading2 = false;
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
    // resend OTP
    resendOTP() {
      this.resendOTPLoader = true;
      this.$store
        .dispatch("orders/sendConfirmOrderOTP", {
          orderId: this.orderDetails.order.id,
        })
        .then(() => {
          this.resendOtpSuccess = true;
          this.resendOTPLoader = false;
          setTimeout(() => {
            this.resendOtpSuccess = false;
          }, 3000);
          this.setOTPTimer();
        })
        .catch((error) => {
          this.errorMessage = true;
          this.resendOTPLoader = false;
          if (error.status == 422 || error.status == 400) {
            this.otpErrorMessage = error.data.errors.email[0];
          } else if (error.status === 404) {
            this.otpErrorMessage = "404 not found";
          } else if (error.status === 500) {
            this.otpErrorMessage = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.otpErrorMessage = "No internet connection!";
          }
        });
    },
    submitOTP() {
      if (this.verifyOTP) {
        this.otpLoader = true;
        this.$store
          .dispatch("orders/submitConfirmOrderOTP", {
            otp: this.otp,
            orderId: this.orderDetails.order.id,
          })
          .then((response) => {
            this.otpLoader = false;
            this.statusImage = successImage;
            this.dialogMessage = "Order successfully confirmed";
            this.orderDetails.order.delivery_confirmed = response.data.data.delivery_confirmed;
            this.dialog2 = false;
            this.dialog = true;
          })
          .catch((error) => {
            this.otpLoader = false;
            this.otpError = true;

            if (error.status == 422 || error.status == 400) {
              this.otpErrorMessage = error.data.message;
            } else if (error.status === 404) {
              this.otpErrorMessage = "404 not found";
            } else if (error.status === 500) {
              this.otpErrorMessage = "Something went wrong, please try again";
            } else if (!navigator.onLine) {
              this.otpErrorMessage = "No internet connection!";
            }
          });
      } else {
        this.otpError = true;
        this.otpErrorMessage =
          "Please Enter the 5 digits code sent to your email adddress";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.checkout-page__details {
  padding: 30px 9%;
  &__content {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 150px;
    &__image-view {
      width: 50%;
      padding-right: 25px;
      position: sticky;
      top: 110px;
      height: 350px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &__multiple {
        &--mobile {
          display: none;
        }
        width: 23%;
        overflow: auto;
        position: relative;
        overflow: initial;
        height: 100%;
        .items-container {
          overflow: auto;
          max-height: 100%;
          scroll-behavior: smooth;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        &__item {
          height: 100px;
          width: 100%;
          margin-bottom: 10px;
          border: 1px solid rgba(43, 43, 43, 0.1);
          cursor: pointer;
          &.active {
            border: 2px solid var(--v-primary-base);
          }
          img {
            height: 100%;
            width: 100%;
          }
        }
        .scroll-btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--v-primary-base);
          background: var(--v-white-base);
          box-shadow: 0px 0.632653px 2.53061px rgba(0, 0, 0, 0.25);
          border-radius: 50%;
          z-index: 2;
          position: absolute;
          cursor: pointer;
          left: 0;
          right: 0;
          margin: auto;
        }
        &__up-btn {
          top: -15px;
        }
        &__down-btn {
          bottom: -15px;
        }
      }
      &__single {
        width: 73%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    &__text-view {
      width: 50%;
      padding-left: 25px;
    }
  }
  &__footer {
    position: fixed;
    padding: 15px 9%;
    border-top: 1px solid rgba(43, 43, 43, 0.1);
    bottom: 0;
    width: 100%;
    left: 0;
    display: flex;
    z-index: 2;
    background: var(--v-white-base);
    &__left {
      width: 50%;
      padding-right: 25px;
    }
    &__right {
      width: 50%;
      padding-left: 25px;
    }
  }
}
.small-font-size {
  font-size: 14px;
}
@media (max-width: 959px) {
  .checkout-page__details {
    padding: 20px 5%;
    &__content {
      &__image-view {
        width: 100%;
        position: relative;
        height: auto;
        top: auto;
        padding-right: 0px;
      }
      &__text-view {
        width: 100%;
        margin-top: 30px;
        padding-left: 0px;
      }
    }
    &__footer {
      padding: 15px 5%;
      &__left {
        width: 0%;
        padding-right: 0px;
      }
      &__right {
        width: 100%;
        padding-left: 0px;
      }
    }
  }
}
@media (max-width: 550px) {
  .checkout-page__details {
    &__content {
      &__image-view {
        &__multiple {
          display: none;
          &--mobile {
            display: flex;
            width: 100%;
            height: 100px;
            overflow: auto;
            position: relative;
            overflow: initial;
            .items-container {
              overflow: auto;
              max-width: 100%;
              scroll-behavior: smooth;
              display: flex;
              &::-webkit-scrollbar {
                display: none;
              }
            }
            &__item {
              height: 100px;
              min-width: 100px;
              margin-right: 10px;
              border: 1px solid rgba(43, 43, 43, 0.1);
              cursor: pointer;
              .active {
                border: 2px solid var(--v-primary-base);
              }
              img {
                height: 100%;
                width: 100%;
              }
            }
            .scroll-btn {
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--v-primary-base);
              background: var(--v-white-base);
              box-shadow: 0px 0.632653px 2.53061px rgba(0, 0, 0, 0.25);
              border-radius: 50%;
              z-index: 2;
              position: absolute;
              cursor: pointer;
              top: 0;
              bottom: 0;
              margin: auto;
            }
            &__left-btn {
              left: -15px;
            }
            &__right-btn {
              right: -15px;
            }
          }
        }
        &__single {
          width: 100%;
          height: 350px;
        }
      }
    }
  }
}
</style>
