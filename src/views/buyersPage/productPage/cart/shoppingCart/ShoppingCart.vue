<template>
  <div class="shopping-cart-container">
    <v-container>
      <!-- shopping header -->
      <div class="shopping-cart-container__header pt-sm-10 pt-16">
        <!-- go to previous page -->
        <a @click="$router.back()" style="text-decoration: none">
          <span class="shopping-cart-container__header__back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </a>
        <!-- title -->
        <h3>Cart</h3>
      </div>

      <!-- shopping cart items section -->
      <div class="shopping-cart-container__content-section">
        <div
          class="shopping-cart-container__content-section__item"
          v-for="(item, index) in cartProducts"
          :key="index"
        >
          <!-- product details part -->
          <div class="shopping-cart-container__content-section__item__left">
            <!-- product image -->
            <div
              class="shopping-cart-container__content-section__item__left__img"
            >
              <img :src="item.product.image" alt="product image" />
            </div>
            <!-- product details -->
            <div
              class="
                shopping-cart-container__content-section__item__left__details
              "
            >
              <h4 class="mb-1">{{ item.product.name }}</h4>
              <p class="secondary--text mb-1">
                &#8358;{{ item.product.total_price_label }}
              </p>
              <p class="secondary--text mb-1">
                Available quantity: {{ item.product.quantity }}
              </p>
            </div>
          </div>
          <!-- seller profits form section -->
          <div class="shopping-cart-container__content-section__item__right">
            <div class="d-flex justify-space-between mt-2">
              <!-- remove item from add btn -->
              <div
                class="d-flex align-center"
                style="cursor: pointer"
                @click="deleteProductFromCart(item.id, index)"
              >
                <img class="mr-2" src="@/assets/icons/trash.svg" alt="remove" />
                <span style="color: red" v-show="deleteLoaderIndex != index"
                  >Remove</span
                >
                <v-progress-circular
                  indeterminate
                  color="red"
                  class="ml-3"
                  size="20"
                  v-show="deleteLoader && deleteLoaderIndex == index"
                ></v-progress-circular>
              </div>
              <!-- quantity section -->
              <div class="quantiy-selection d-flex align-center">
                <span
                  class="decreaseQuantity background"
                  @click="decreaseQuantity(index, item)"
                  >-</span
                >
                <span class="mx-2">{{ item.quantity || 1 }}</span>
                <span
                  class="increaseQuantity primary"
                  @click="increaseQuantity(index, item)"
                  >+</span
                >
              </div>
            </div>
          </div>
          <div class="mt-3">
            <p class="d-flex" style="max-width: 400px">
              <span>Total price to be paid (&#8358;):</span>

              <span class="primary--text ml-2">{{ overallTotalCost }}</span>
            </p>
            <router-link :to="{ name: 'CustomerDetailsForm' }">
              <v-btn class="primary elevation-0" width="300">Sell</v-btn>
            </router-link>
          </div>
        </div>
      </div>

      <!-- loader section -->
      <!-- <div class="d-flex py-5 text-center mx-auto" v-if="loader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
    </div> -->

      <!-- no data -->
      <div
        class="text-center pt-10 pb-5"
        v-show="cartProducts.length == 0 && !loader"
      >
        <p class="mb-0 secondary--text" style="font-size: 20px">
          Your cart is empty.
        </p>
        <router-link :to="{ name: 'InventoryHome' }">
          <v-btn class="primary mx-auto mt-4">Continue selling</v-btn>
        </router-link>
      </div>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "ShoppingCart",
  data: function () {
    return {
      loader: false,
      deleteLoader: false,
      deleteLoaderIndex: -1,
      cartProducts: [
        {
          product: {
            name: "kuda",
            image: require("@/assets/images/jean.png"),
            quantity: 14,
            total_price_label: 250,
          },
        },
      ],
    };
  },
  created() {
    this.loader = true;
  },
  methods: {
    deleteProductFromCart(productId, index) {
      this.deleteLoaderIndex = index;
      this.deleteLoader = true;
      this.$store
        .dispatch("orders/deleteProductFromCart", { id: productId })
        .then(() => {
          console.log(this.cartProducts);
          this.deleteLoaderIndex = -1;
          this.deleteLoader = false;
        })
        .catch(() => {
          this.deleteLoaderIndex = -1;
          this.deleteLoader = false;
        });
    },
    increaseQuantity(index, item) {
      if (parseInt(item.quantity, 10) < parseInt(item.product.quantity, 10)) {
        let newProductDetails = {};
        newProductDetails.quantity = parseInt(item.quantity, 10) + 1;
        newProductDetails.product_id = item.id;
        newProductDetails.profit_per_unit = parseInt(item.profit_per_unit, 10);
        newProductDetails.variants = item.variants;
        this.cartProducts[index].quantity = newProductDetails.quantity;
        this.$store
          .dispatch("orders/updateCartProduct", newProductDetails)
          .catch(() => {
            this.cartProducts[index].quantity = newProductDetails.quantity - 1;
          });
      }
    },
    decreaseQuantity(index, item) {
      if (
        parseInt(item.quantity, 10) >
        parseInt(item.product.min_order_quantity, 10)
      ) {
        let newProductDetails = {};
        newProductDetails.quantity = parseInt(item.quantity, 10) - 1;
        newProductDetails.product_id = item.id;
        newProductDetails.profit_per_unit = parseInt(item.profit_per_unit, 10);
        newProductDetails.variants = item.variants;
        this.cartProducts[index].quantity = newProductDetails.quantity;
        this.$store
          .dispatch("orders/updateCartProduct", newProductDetails)
          .catch(() => {
            this.cartProducts[index].quantity = newProductDetails.quantity + 1;
          });
      }
    },
    updateProfit(item) {
      let newProductDetails = {};
      newProductDetails.quantity = parseInt(item.quantity, 10);
      newProductDetails.product_id = item.id;
      newProductDetails.profit_per_unit = parseInt(item.profit_per_unit, 10);
      newProductDetails.variants = item.variants;
      this.$store.dispatch("orders/updateCartProduct", newProductDetails);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ShoppingCart.scss";
</style>