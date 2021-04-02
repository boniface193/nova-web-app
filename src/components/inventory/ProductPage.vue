<template>
  <div
    style="background: #fafafa; min-height: 100%; margin-top: -40px"
    class="pt-sm-10 pt-16"
  >
    <div v-show="!loader">
      <!-- go to previous page -->
      <router-link
        :to="{
          name: 'InventoryHome',
        }"
        style="text-decoration: none"
        class="mx-5"
      >
        <span class="back-btn">
          <v-icon color="black" style="font-size: 25px"
            >mdi-chevron-left</v-icon
          >
        </span>
      </router-link>

      <v-row>
        <v-col class="col-12 col-md-6 pt-md-15 px-5 pb-5">
          <!-- image section -->
          <div class="image-container pa-10">
            <img :src="productDetails.image" alt="" />
            <span class="points">{{ productDetails.points }}pts</span>
          </div>
        </v-col>
        <!-- prduct details -->
        <v-col class="col-12 col-md-6 pt-md-15 px-8">
          <h2 class="mb-4">{{ productDetails.name }}</h2>
          <p class="secondary--text mb-4" style="font-size: 14px">
            <span class="mr-5"
              >&#8358;{{ productDetails.total_price_label }}</span
            ><span> SKU: {{ productDetails.sku }} </span
            ><span class="mx-2">|</span
            ><span style="font-weight: 600; color: black"
              >{{ productDetails.quantity }} Available</span
            >
            <span class="mx-2">|</span>
            <span
              ><span style="font-weight: 600">Minimum order quantity:</span>
              {{ productDetails.min_order_quantity }}</span
            >
          </p>
          <p class="mb-4">
            <span class="primary--text mr-2"
              >&#8358;{{ productDetails.min_profit_label }} - &#8358;{{
                productDetails.max_profit_label
              }}</span
            ><span class="secondary--text" style="font-size: 14px"
              >Suggested profit</span
            >
          </p>
          <p class="secondary--text" style="font-size: 14px">
            Inventory: {{ storeDetails.name }}
          </p>
          <hr class="secondary--text" />

          <div class="py-5">
            <h4 class="mb-2">Description</h4>
            <p class="secondary--text mb-2" style="font-size: 14px">
              {{ productDetails.description.slice(0, 200) }}
            </p>
            <!-- view more about product btn -->
            <router-link
              :to="{
                name: 'ProductDetails',
                params: {
                  id: this.$route.params.id,
                },
              }"
              style="text-decoration: none font-size:14px"
              class="primary--text"
            >
              View more
            </router-link>

            <h4 class="mt-5 mb-2">Shipping and returns</h4>
            <p v-show="storeDetails.refund_policy.return_allowed == 'true'">
              <span class="secondary--text" style="font-size: 14px"
                >Free return within
                {{ storeDetails.refund_policy.return_window }}
                {{
                  storeDetails.refund_policy.return_window > 1 ? "days" : "day"
                }}
                from {{ storeDetails.name }}</span
              ><br />
              <span style="font-size: 14px; font-weight: 600"
                >What qualifies a product for returns ?</span
              ><br />
              <span>{{ storeDetails.refund_policy.return_precondition }}</span
              ><br />
              <span style="font-size: 14px; font-weight: 600"
                >Can a customer replace a product in the event of a return
                ?</span
              ><br />
              <span>{{
                storeDetails.refund_policy.product_replacable_on_return ==
                "true"
                  ? "Yes, a customer can replace a product on return"
                  : "No, a customer cannot replace a product on return"
              }}</span>
            </p>
            <p v-show="storeDetails.refund_policy.return_allowed == 'false'">
              Returns are not allowed for this product
            </p>
          </div>
        </v-col>
      </v-row>
      <!-- checkout container -->
      <div class="checkout-container">
        <div
          class="resell-container px-5 pt-6 pb-5"
          v-show="!createLink.status"
        >
          <div v-show="!checkout">
            <p>
              <span class="mr-2 mb-4" style="font-weight: 600"
                >Unit price: </span
              ><span class="secondary--text"
                >&#8358;{{ productDetails.total_price_label }}</span
              >
            </p>
            <p>
              <span class="mr-2 mb-4" style="font-weight: 600"
                >Recommended profit: </span
              ><span class="primary--text"
                >&#8358;{{ productDetails.min_profit_label }} - &#8358;{{
                  productDetails.max_profit_label
                }}</span
              >
            </p>
            <v-btn class="primary" @click="() => (checkout = true)">Sell</v-btn>
          </div>

          <!-- checkout container -->
          <div v-show="checkout">
            <div class="d-flex mb-3" style="align-items: baseline">
              <p class="mr-5 mb-0" style="font-weight: 600">
                Enter profit(N) per unit:
              </p>
              <v-form style="width: 200px" ref="form">
                <v-text-field
                  required
                  :rules="inputRules"
                  v-model="profit"
                  @keyup.enter="submitCheckoutDetails"
                ></v-text-field>
                <v-text-field style="display: none"></v-text-field>
              </v-form>
            </div>
            <div class="d-flex align-center mb-5">
              <p class="mr-5 mb-0" style="font-weight: 600">Quantity:</p>
              <div class="d-flex align-center">
                <span class="minus-btn" @click="decreaseNum">-</span>
                <span class="mx-4">{{ this.quantity }}</span>
                <span class="add-btn mr-3" @click="increaseNum">+</span>
              </div>
              <p
                class="error--text mb-0"
                v-show="quantityError"
                style="font-size: 14px"
              >
                {{ quantityErrorMsg }}
              </p>
            </div>
            <p class="mb-5">
              <span class="mr-2" style="font-weight: 600">
                profit (&#8358;)
                <span class="primary--text" style="font-weight: 300"
                  >(Inclusive of 7.5% VAT):
                </span> </span
              ><span class="secondary--text">{{
                numberWithCommas(computedPrices.yourProfit)
              }}</span>
            </p>
            <p class="mb-5">
              <span class="mr-2" style="font-weight: 600"
                >Total (&#8358;):
              </span>
              <span class="secondary--text">{{
                numberWithCommas(computedPrices.total)
              }}</span>
            </p>
            <v-form ref="variantForm">
              <h4 class="mb-4" v-show="productDetails.variants">Variants</h4>
              <div
                v-for="(item, index) in productDetails.variants"
                :key="index"
              >
                <p class="mb-1" style="font-weight: 600">{{ item.name }}</p>
                <v-radio-group
                  row
                  v-model="variants[index].value"
                  class="mt-1"
                  :rules="variantRules"
                >
                  <v-radio
                    class="primary--text mb-0"
                    v-for="(value, index2) in item.values"
                    :key="index2"
                    :label="value"
                    :value="value"
                  ></v-radio>
                </v-radio-group>
              </div>
            </v-form>
            <v-btn class="primary" @click="submitCheckoutDetails">Next</v-btn>
          </div>
        </div>
        <!-- link container -->
        <div
          class="sellerLink-container px-5 pt-6 pb-5"
          v-show="createLink.status"
        >
          <p class="mb-4" style="font-weight: 600">
            Congratulations! Your customer has been notified to make payment!
          </p>
          <p class="mb-4 secondary--text" style="font-size: 14px">
            You can also share the link below with your customer:
          </p>
          <div class="link py-3 px-2">
            <img src="@/assets/images/link.svg" alt="" />
            <span
              style="cursor: pointer; height: 25px; overflow: hidden"
              v-clipboard:copy="createLink.url"
              @click="showCopyStatus"
              >{{ createLink.url }}</span
            >
            <span style="position: relative">
              <v-icon
                class="ml-5 copy-btn"
                v-clipboard:copy="createLink.url"
                @click="showCopyStatus"
                >mdi-content-copy</v-icon
              >
              <span
                v-show="copyStatus"
                class="copy-status primary--text py-1 px-2"
                >Copied</span
              >
            </span>
          </div>
          <div
            class="d-flex align-center justify-space-between link-btn-container pt-5"
          >
            <v-btn
              color="#f3f5ff"
              class="primary--text mb-5"
              style="background: #f3f5ff"
              @click="
                () => {
                  this.$router.push({
                    name: 'InventoryHome',
                  });
                }
              "
              >Continue selling
            </v-btn>
            <v-btn class="primary mb-5" @click="shareDialog = true"
              >Share Link</v-btn
            >
          </div>
        </div>
      </div>
      <!-- modal for dialog messages -->
      <modal :dialog="shareDialog" width="250">
        <div class="white pa-3 pb-5 text-center dialog">
          <div class="d-flex justify-end">
            <v-icon class="error--text close-btn" @click="shareDialog = false"
              >mdi-close</v-icon
            >
          </div>

          <div class="d-flex align-center justify-space-between px-8">
            <whats-app
              class="mt-3 mr-3"
              :url="createLink.url"
              title="Buy on NOVA"
              scale="2"
            ></whats-app>
            <twitter
              class="mt-3 mr-3"
              :url="createLink.url"
              title="Buy on NOVA"
              scale="2"
            ></twitter>
            <facebook
              class="mt-3 mr-3"
              :url="createLink.url"
              scale="2"
            ></facebook>
          </div>
          <p class="mt-4 mb-0 secondary--text">
            Share products with customers on social media
          </p>
        </div>
      </modal>
    </div>
    <div class="d-flex py-5 text-center" v-if="loader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
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
import modal from "@/components/modal.vue";
import { Facebook } from "vue-socialmedia-share";
import { Twitter } from "vue-socialmedia-share";
import { WhatsApp } from "vue-socialmedia-share";
export default {
  name: "Product",
  components: { modal, Facebook, Twitter, WhatsApp },
  data: function () {
    return {
      quantity: 1,
      checkout: false,
      shareDialog: false,
      productDetails: {
        description: ""
      },
      storeDetails: {
        refund_policy: {},
      },
      loader: false,
      statusImage: null,
      dialog: false,
      dialogMessage: "",
      copyStatus: false,
      variants: [{}],
      quantityError: false,
      quantityErrorMsg: "",
      inputRules: [
        (v) => !!v || "Profit is required", // verifies name satisfies the requirement
        (v) => Math.sign(v) !== -1 || "Negative profit is not allowed",
        (v) =>
          v <= this.productDetails.max_profit ||
          "Profit must be less than maximum recommended profit",
      ],
      variantRules: [(v) => !!v || "Required"],
      yourProfit: 0,
      total: 0,
      profit: 0,
    };
  },
  computed: {
    computedPrices() {
      let yourProfit, total;
      if (Math.sign(this.profit) !== -1) {
        yourProfit = this.quantity * this.profit;
        total = this.quantity * this.productDetails.total_price + yourProfit;
      }

      return {
        total: total,
        yourProfit: yourProfit,
      };
    },
    createLink() {
      const params = new URLSearchParams(window.location.search);
      const link = new URLSearchParams(
        decodeURIComponent(window.location.search)
      );
      if (params.get("createLink")) {
        const linkStatus = params.get("createLink");
        const url = link.get("link");
        return {
          status: linkStatus,
          url: url,
        };
      } else {
        return {
          status: false,
        };
      }
    },
  },
  created() {
    this.loader = true;
    this.$store
      .dispatch("inventory/getProductDetail", {
        id: this.$route.params.id,
      })
      .then((response) => {
        this.productDetails = response.data.data;
        this.variants = this.productDetails.variants;
        this.quantity = this.productDetails.min_order_quantity;
        this.getStoreDetails();
      })
      .catch((error) => {
        this.dialog = true;
        this.loader = false;
        this.statusImage = failedImage;
        if (error.response) {
          this.dialogMessage = "Sorry, this data does not Exist";
        } else {
          this.dialogMessage = "No internet Connection!";
        }
      });
  },
  methods: {
    increaseNum() {
      if (this.quantity < this.productDetails.quantity) {
        this.quantity = parseInt(this.quantity, 10) + 1;
        this.quantityError = false;
      } else {
        this.quantityError = true;
        let placeholder = this.productDetails.quantity > 1 ? "items" : "item";
        this.quantityErrorMsg =
          "Only " +
          this.productDetails.quantity +
          " " +
          placeholder +
          " Available in stock";
      }
    },
    decreaseNum() {
      if (this.quantity > this.productDetails.min_order_quantity) {
        this.quantity = parseInt(this.quantity, 10) - 1;
        this.quantityError = false;
      } else {
        this.quantityError = true;
        this.quantityErrorMsg =
          "The minimum quantity allowed is " +
          this.productDetails.min_order_quantity;
      }
    },
    EncodeArrayOfObjects(arrayValues) {
      const encodedValues = arrayValues.map((param) => {
        return (
          encodeURIComponent(param.name) + "=" + encodeURIComponent(param.value)
        );
      });

      return encodedValues.join("&");
    },
    getStoreDetails() {
      this.$store
        .dispatch("onboarding/getStoreDetails", {
          id: this.productDetails.store_id,
        })
        .then((response) => {
          this.storeDetails = response.data.data;
          this.loader = false;
        })
        .catch((error) => {
          this.loader = false;
          this.dialog = true;
          this.statusImage = failedImage;
          if (error.response) {
            this.dialogMessage = "Sorry, this data does not Exist";
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    },
    submitCheckoutDetails() {
      this.$refs.form.validate();
      this.$refs.variantForm.validate();
      if (this.$refs.form.validate() && (this.$refs.variantForm.validate() || !this.productDetails.variants)) {
        const variants = (this.productDetails.variants)? `&${this.EncodeArrayOfObjects(this.variants)}`: '';
        this.$router.push({
          path:
            `/inventory/${this.$route.params.id}/customer-form?` +
            `${encodeURIComponent("quantity=" + this.quantity)}` +
            `${encodeURIComponent("&profit=" + this.profit)}` + variants,
                      params: {
            id: this.$route.params.id,
          },
        });
      }
    },
    // separate money with comma
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    showCopyStatus() {
      this.copyStatus = true;
      setTimeout(() => {
        this.copyStatus = false;
      }, 1000);
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
.points {
  background: #ffba00;
  color: #fff;
  padding: 5px 7px;
  position: absolute;
  font-size: 15px;
  top: -12px;
  right: -7px;
  z-index: 3;
  border-radius: 8px;
}
.checkout-container {
  right: 0px;
  bottom: 0px;
  position: sticky;
  float: right;
  width: 50%;
}
.resell-container {
  background: #fff;
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  z-index: 2;
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
    min-width: 100%;
    padding: 0 16px;
  }
}
.sellerLink-container {
  background: #fff;
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  z-index: 3;
  .link {
    background: #f3f5ff;
    color: #029b97;
    text-align: center;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-all;
    img {
      margin-right: 10px;
    }
    .copy-btn {
      cursor: pointer;
      &:hover {
        color: #03a09b;
      }
    }
    .copy-status {
      position: absolute;
      bottom: 100%;
      background: #e0e7ff;
      word-break: none;
      width: 90px;
      right: 0;
      border-radius: 8px;
    }
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
.link-btn-container {
  .v-btn:not(.v-btn--round).v-size--default {
    height: 40px;
    min-width: 48%;
    padding: 0 16px;
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 950px) {
  .checkout-container {
    width: 100%;
  }
  .sellerLink-container,
  .resell-container {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
}
</style>