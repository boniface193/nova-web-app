<template>
  <div style="height: 100%">
    <div class="order-details-container">
      <div class="order-details pa-3" v-show="!pageLoader">
        <h3>Order status</h3>
        <div>
          <step-progress
            :steps="['Processing', 'Shipped', 'Delivered']"
            :current-step="
              orderDetails.delivery_status_label == 'Processing' ||
              orderDetails.delivery_status_label == 'Shipped'
                ? 1
                : 3
            "
            icon-class="fa fa-check"
            :line-thickness="lineThickness"
            active-color="#FFA500"
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
          <div class="text-left" v-show="!orderDetails.delivery_confirmed">
            <v-checkbox
              v-model="acceptTerms"
              label="By clicking continue, you are agreeing to our terms of service and our
                    disclaimer"
              class="mt-5"
            ></v-checkbox>
            <v-btn
              class="primary mt-1 mx-auto mb-3 px-16 py-5"
              :disabled="!acceptTerms || loading2"
              :loading="loading2"
              @click="confirmOrder()"
              >Confirm Order</v-btn
            >
          </div>
          <div class="text-center mt-5">
            <p class="primary--text" v-show="orderDetails.delivery_confirmed">
              <span style="color:#FFA500;">Order Status:</span> <span class="ml-2 py-2 px-3 primary white--text" style="border-radius:5px"> Confirmed</span>
            </p>
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
    <modal :dialog="dialog2" width="400">
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
          <h3>Pls verify your are the buyer</h3>
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
    </modal>

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
import OtpInput from "@/components/onboarding/verifyInput";
import successImage from "@/assets/images/success-img.svg";
// import the css (OPTIONAL - you can provide your own design)
import "vue-step-progress/dist/main.css";
export default {
  name: "OrderStatus",
  components: { modal, StepProgress, "v-otp-input": OtpInput },
  data: function () {
    return {
      loading2: false,
      resendOtpSuccess: false,
      resendOTPLoader: false,
      showOTPTimer: true,
      timer: 60,
      acceptTerms: false,
      otpLoader: false,
      verifyOTP: false,
      otp: "",
      otpErrorMessage: "",
      otpError: false,
      dialog: false,
      statusImage: null,
      dialog2: false,
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
  methods: {
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
    confirmOrder() {
      this.loading2 = true;
      this.$store
        .dispatch("orders/sendConfirmOrderOTP", {
          orderId: this.orderDetails.id,
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
          if (error.response) {
            this.dialogMessage = "Something went wrong, pls try again";
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    },
    // resend OTP
    resendOTP() {
      this.resendOTPLoader = true;
      this.$store
        .dispatch("orders/sendConfirmOrderOTP", {
          orderId: this.orderDetails.id,
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
          if (error.response) {
            this.otpErrorMessage = error.response.errors.email[0];
          } else {
            this.otpErrorMessage = "No internet Connection!";
          }
        });
    },
    submitOTP() {
      if (this.verifyOTP) {
        this.otpLoader = true;
        this.$store
          .dispatch("orders/submitConfirmOrderOTP", {
            otp: this.otp,
            orderId: this.orderDetails.id,
          })
          .then((response) => {
            this.otpLoader = false;
            this.statusImage = successImage;
            this.dialogMessage = "Order successfully confirm";
            this.orderDetails = response.data.data;
            this.dialog2 = false;
            this.dialog = true;
          })
          .catch((error) => {
            this.otpLoader = false;
            this.otpError = true;
            if (error.response) {
              this.otpErrorMessage = error.response.data.otp;
            } else {
              this.otpErrorMessage = "No internet connection";
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
    width: 600px;
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
  color: #029b97;
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
