<template>
  <div class="checkout-page__details" id="checkout-page__details">
    <p class="secondary--text small-font-size mb-3">
      {{ getOrderDetails.orderDetails.cart_items.length }}
      {{
        getOrderDetails.orderDetails.cart_items.length > 1 ? "items" : "item"
      }}
    </p>
    <div class="checkout-page__details__content">
      <div class="checkout-page__details__content__image-view">
        <div class="checkout-page__details__content__image-view__multiple">
          <div class="items-container" ref="items_container">
            <div
              class="
                checkout-page__details__content__image-view__multiple__item
              "
              v-for="(item, index) in getOrderDetails.orderDetails.cart_items"
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
          class="checkout-page__details__content__image-view__multiple--mobile"
        >
          <div class="items-container" ref="items_container__mobile">
            <div
              class="
                checkout-page__details__content__image-view__multiple--mobile__item
              "
              :class="{ active: activeImageIndex == index }"
              v-for="(item, index) in getOrderDetails.orderDetails.cart_items"
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
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(slide, index) in inViewProduct.product.other_images"
              :key="index"
            >
              <img :src="slide" alt="" />
            </v-carousel-item>
          </v-carousel>
        </div>
      </div>
      <!-- product details section -->
      <div class="checkout-page__details__content__text-view">
        <h2>{{ inViewProduct.product.name }}</h2>
        <p class="secondary--text small-font-size mb-1">
          Inventory: {{ inViewProduct.product.store_name }}
        </p>
        <p class="secondary--text small-font-size">
          Order quantity: {{ inViewProduct.quantity }}
        </p>

        <h4>Description</h4>
        <p class="secondary--text small-font-size">
          {{ inViewProduct.product.description }}
        </p>

        <div
          v-if="
            inViewProduct.variants.length > 0 &&
            inViewProduct.variants.length != null
          "
        >
          <h4>Variants</h4>
          <p
            class="secondary--text small-font-size mb-1"
            v-for="(variant, index) in inViewProduct.variants"
            :key="index"
          >
            {{ variant.name }}: {{ variant.value }}
          </p>
        </div>

        <h4 class="mt-4">Shipping and returns</h4>
        <p
          v-if="inViewProduct.product.return_window > 0"
          class="secondary--text small-font-size"
        >
          Returns are allowed within {{ inViewProduct.product.return_window }}
          {{ inViewProduct.product.return_window > 1 ? "days" : "day" }}
        </p>
        <p v-else class="secondary--text small-font-size">
          Returns are not allowed for this product
        </p>

        <h3 class="primary--text">
          &#8358;{{ inViewProduct.total_cost_label }}
        </h3>
      </div>
    </div>
    <div class="checkout-page__details__footer">
      <div class="checkout-page__details__footer__left"></div>
      <div class="checkout-page__details__footer__right">
        <div class="d-flex align-center text-left">
          <v-checkbox v-model="acceptTerms"></v-checkbox>
          <p class="mb-0 text-left" style="">
            I agree to
            <a
              style="text-decoration: none"
              :href="`${websiteBaseURL}/return-refund-policy`"
              target="_blank"
              class="primary--text"
              >Vendor's Shipping and Return policy </a
            >, Kuuzza
            <a
              style="text-decoration: none"
              :href="`${websiteBaseURL}/customer/terms-conditions`"
              target="_blank"
              class="primary--text"
            >
              Terms of Service</a
            >
            and
            <a
              style="text-decoration: none"
              :href="`${websiteBaseURL}/privacy-policy`"
              target="_blank"
              class="primary--text"
            >
              Privacy Policy</a
            >
          </p>
        </div>
        <v-btn
          class="primary"
          :disabled="!acceptTerms"
          @click="routeToPaymentDetails()"
          >Checkout
          <v-icon class="white--text ml-1" style="font-size: 20px"
            >mdi-arrow-right</v-icon
          >
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CheckoutDetails",
  props: ["orderDetails", "sellerDetails", "storeDetails"],
  data: function () {
    return {
      websiteBaseURL: process.env.VUE_APP_WEBSITE_BASE_URL,
      acceptTerms: false,
      initialScrollViewDown: 0,
      initialScrollViewUp: 0,
      inViewProduct: { product: {}, variants: [] },
      activeImageIndex: 0,
      activeCarousel: [],
    };
  },
  created() {
    this.addImageToOtherImages(0);
  },
  computed: {
    getOrderDetails() {
      return {
        orderDetails: this.orderDetails,
      };
    },
  },
  methods: {
    routeToPaymentDetails() {
      this.$router.push({
        path: `/payment-details?session_id=${this.getOrderDetails.orderDetails.id}`,
      });
    },
    setinViewProduct(index) {
      this.inViewProduct = this.orderDetails.cart_items[index];
      this.activeImageIndex = index;
    },
    addImageToOtherImages() {
      this.getOrderDetails.orderDetails.cart_items.forEach((item, index) => {
        let mainImage = item.product.image;
        this.getOrderDetails.orderDetails.cart_items[
          index
        ].product.other_images.unshift(mainImage);
        let uniqueImage = new Set(
          this.getOrderDetails.orderDetails.cart_items[
            index
          ].product.other_images
        );
        uniqueImage = Array.from(uniqueImage);
        this.getOrderDetails.orderDetails.cart_items[
          index
        ].product.other_images = uniqueImage;
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
<style lang="scss">
.v-carousel__controls > .v-item-group {
  display: flex;
}
</style>
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
        text-align: center;
        img {
          max-width: 100%;
          min-width: 90%;
          height: 100%;
          margin: auto;
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
          margin-top: 5px;
          img{
            width: 100%;
          }
        }
      }
    }
  }
}
</style>