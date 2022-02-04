<template>
  <div>
    <div class="secondary-container pt-sm-10 pt-16">
      <div>
        <div class="secondary-container__header">
          <span
            class="back-btn"
            @click="$router.back()"
            style="cursor: pointer"
          >
            <v-icon color="black" style="font-size: 25px"
              >mdi-chevron-left</v-icon
            >
          </span>
          <!-- </router-link> -->

          <router-link
            :to="{ name: 'ShoppingCart' }"
            class="secondary-container__header__cart mr-5"
          >
            <img width="40" src="@/assets/icons/cart-icon.svg" />
            <span class="no-of-item-in-cart">{{
              totalNumberOfProductsInCart
            }}</span>
          </router-link>
        </div>

        <v-row v-if="!loader">
          <v-col class="col-12 col-md-6 pt-md-15 px-5 pb-5">
            <div class="image-container py-10">
              <div class="image-container__main">
                <img
                  :src="selectedImg || productDetails.image"
                  alt=""
                  style="height: 100%; width: 100%"
                />
                <span class="points">{{ productDetails.points }}pts</span>
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
                    v-for="n in productDetails.other_images"
                    :key="n"
                    v-slot="{ active, toggle }"
                  >
                    <v-card
                      :color="active ? 'primary' : 'grey lighten-1'"
                      class="ma-4 elevation-0"
                      height="80"
                      width="90"
                      @click="toggle"
                      v-on:click="selectByImage(n)"
                    >
                      <v-img :src="n" height="80" width="90"></v-img>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
              <!-- sliding images -->

              <a
                class="download-icon white--text primary"
                :href="`http://${removeHttp(
                  selectedImg == '' ? productDetails.image : selectedImg
                )}`"
                target="_blank"
                download
              >
                Download image
              </a>
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
              <h4 class="mb-4">Description</h4>
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

              <h4 class="mt-4 mb-2">Shipping and returns</h4>
              <p class="mb-2">
                <span style="font-weight: 600">Store location:</span>
                {{ storeDetails.location.state }}
              </p>
              <p
                v-show="storeDetails.refund_policy.return_allowed == 'true'"
                style="font-size: 14px"
              >
                <span class="secondary--text"
                  >Free return within
                  {{ storeDetails.refund_policy.return_window }}
                  {{
                    storeDetails.refund_policy.return_window > 1
                      ? "days"
                      : "day"
                  }}
                  from {{ storeDetails.name }}</span
                ><br />
                <span style="font-weight: 600"
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
              <p
                v-show="storeDetails.refund_policy.return_allowed == 'false'"
                style="font-size: 14px"
              >
                Returns are not allowed for this product
              </p>

              <v-btn class="primary" width="300" @click="addToCart"
                >Add to cart</v-btn
              >
              <v-btn class="background mt-3" width="300" @click="addToStore"
                >Add to store</v-btn
              >
            </div>
          </v-col>
        </v-row>
        <!-- loader container -->
        <div class="text-center pt-10 pb-5" v-else>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
      <!-- add to cart dialog modal -->
      <AddToCartModal
        :product="productDetails"
        :addToCartDialog="addToCartDialog"
        @closeAddToCartDialog="addToCartDialog = false"
      />
      <!-- add to store dialog modal -->
      <AddToStoreModal
        :product="productDetails"
        :addToStoreDialog="addToStoreDialog"
        @closeAddToStoreDialog="addToStoreDialog = false"
      />

      <!-- Response Modal -->
      <ResponseModal
        :dialog="dialog"
        :status="statusImage"
        :dialogMessage="dialogMessage"
        @closeDialog="
          () => {
            this.dialog = false;
          }
        "
      />
    </div>
  </div>
</template>
<script>
import AddToCartModal from "@/components/secondary/inventory/AddToCartModal";
import AddToStoreModal from "@/components/secondary/inventory/AddToStoreModal";
import ResponseModal from "@/components/secondary/ResponseModal.vue";
import { mapState } from "vuex";
export default {
  name: "Product",
  components: { ResponseModal, AddToCartModal, AddToStoreModal},
  data: function () {
    return {
      model: null,
      selectedImg: "",
      addToCartDialog: false,
      addToStoreDialog: false,
      allImg: [],
      productDetails: {
        description: "",
        min_order_quantity: 1,
        variants: [{}],
        max_profit: 0,
      },
      storeDetails: {
        refund_policy: {},
        location: {},
      },
      loader: false,
      statusImage: null,
      dialog: false,
      dialogMessage: "",
    };
  },
  computed: {
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
    ...mapState({
      sellerName: (state) => state.settings.profile.name,
      totalNumberOfProductsInCart: (state) =>
        state.orders.totalNumberOfProductsInCart,
    }),
  },
  created() {
    this.loader = true;
    this.$store
      .dispatch("inventory/getProductDetail", {
        id: this.$route.params.id,
      })
      .then((response) => {
        this.productDetails = response.data.data;
        this.productDetails.other_images.push(this.productDetails.image);
        this.getStoreDetails();
      })
      .catch((error) => {
        this.loader = false;
        if (error.status == 422 || error.status == 400) {
          this.statusImage = false;
          this.dialog = true;
          this.dialogMessage = error.data.message;
        }
      });
  },
  methods: {
    addToCart() {
      this.addToCartDialog = true;
    },
    addToStore() {
      this.addToStoreDialog = true;
    },
    selectByImage(params) {
      this.selectedImg = this.productDetails.other_images.find(
        (item) => item == params
      );
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
          if (error.status == 422 || error.status == 400) {
            this.statusImage = false;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
    removeHttp(url) {
      return url.replace(/(^\w+:|^)\/\//, "");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ProductPage.scss";
</style>