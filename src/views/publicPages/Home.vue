<template>
  <!-- main section -->
  <div class="main">
    <!-- Banner section -->
    <Banner />

    <div class="text-center">
      <h1 class="mt-7 px-5 secondary-header">
        Start selling at <span class="primary--text">no upfront cost.</span>
      </h1>
    </div>

    <!-- featured item -->
    <div class="featured-item">
      <div class="d-flex justify-space-between align-baseline">
        <h2>Featured items</h2>
        <router-link
          :to="{ path: '/' }"
          class="primary--text"
          style="text-decoration: none"
          >View more
          <span
            ><v-icon class="primary--text">mdi-arrow-right</v-icon></span
          ></router-link
        >
      </div>
      <div class="items-container">
        <ListedItems v-for="index in 5" :key="index" />
      </div>
    </div>

    <div class="text-center">
      <h1 class="mt-7 secondary-header">Why resell on Kuuzzza?</h1>
    </div>

    <!-- why kuuzza -->
    <div class="why-kuuzza">
      <v-row>
        <v-col class="col-12 col-md-6 d-flex align-center why-kuuzza--text">
          <div>
            <h2 class="mb-5">No upfront costs</h2>
            <p class="mb-8">
              There’s no paying suppliers until your customers pay you. Plus you
              gain access to wholesale prices even on as little as one item! No
              minimum orders, no subscription or registration fees too!
            </p>
            <h2 class="mb-5">Access thousands of products</h2>
            <p>
              Think of Kuuzza as the keys to a virtual warehouse packed with
              products from thousands of suppliers. Electronics, fashion,
              beauty, toys. You name it, you can find it!
            </p>
          </div>
        </v-col>
        <v-col class="col-12 col-md-6 why-kuuzza--img">
          <div class="image-container">
            <img src="@/assets/images/quantity.png" alt="" />
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="top-seller">
      <v-row>
        <v-col class="col-12 col-md-6 top-seller--img">
          <div class="image-container">
            <img src="@/assets/images/top-seller.png" alt="" />
          </div>
        </v-col>
        <v-col class="col-12 col-md-6 d-flex align-center top-seller--text">
          <div>
            <h2 class="mb-5">Decide your profit</h2>
            <p class="mb-8">
              You can select any product on Kuuzza, decide and add your desired
              profit yourself and sell directly to your customers.
            </p>
            <h2 class="mb-5">Earn rewards</h2>
            <p>
              For every product you sell to your customers on Kuuzza, you earn
              points which can be redeemed for airtime, vouchers and cash.
            </p>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="logistics">
      <v-row>
        <v-col class="col-12 col-md-6 d-flex align-center logistics--text">
          <div>
            <h2 class="mb-5">We handle the logistics</h2>
            <p class="mb-8">
              Focus on just selling to your customers while we handle the
              payments and logistics.. All payments will be settled into your
              account once an order is confirmed complete.
            </p>
            <h2 class="mb-5">Easy and secure payments</h2>
            <p>
              Payments are processed using a secured, frictionless payment
              channel which is accessible by all, anywhere in Nigeria.
            </p>
          </div>
        </v-col>
        <v-col class="col-12 col-md-6 logistics--img">
          <div class="image-container">
            <img src="@/assets/images/map.svg" alt="" />
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="get-started">
      <v-row>
        <v-col class="col-0 col-md-6 get-started--img">
          <div class="image-container">
            <img src="@/assets/images/get-started.png" alt="" />
          </div>
        </v-col>
        <v-col class="col-12 col-md-6 d-flex align-center get-started--text">
          <div>
            <div class="text-center text-md-left">
              <h1 class="mb-5">How to get started.</h1>
              <p class="mb-5">
                Getting started on Kuuzza is as easy as thesefew steps:
              </p>
            </div>

            <div class="mb-3 d-flex">
              <div>
                <img class="mt-2" src="@/assets/images/user-check.svg" alt="" />
              </div>
              <div class="ml-5">
                <h3>Create account</h3>
                <p>Sign up at no cost and access our inventory immediately</p>
              </div>
            </div>

            <div class="mb-3 d-flex">
              <div>
                <img
                  class="mt-2"
                  src="@/assets/images/search-cart.svg"
                  alt=""
                />
              </div>
              <div class="ml-5">
                <h3>Find product, decide profit and market</h3>
                <p>
                  Find and market products to potential buyers via social media
                  or any other channel of your choice, sell.
                </p>
              </div>
            </div>

            <div class="mb-3 d-flex">
              <div>
                <img
                  class="mt-2"
                  src="@/assets/images/naira-check.svg"
                  alt=""
                />
              </div>
              <div class="ml-5">
                <h3>Get paid</h3>
                <p>
                  After selling, we handle the payments and logistics. You get
                  paid a day after your customer receives order.
                </p>
              </div>
            </div>
            <router-link :to="{ path: '/signup' }" style="text-decoration: none">
              <v-btn class="primary px-10 py-6 d-md-flex d-none"
                >Sell now</v-btn
              >
            </router-link>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="product-to-sell">
      <h1 class="mb-5 secondary-header">Do you have any products to sell?</h1>
      <p class="mb-4">You can put your products up for sale on Kuuzza too.</p>
      <a
        href="http://nova-front-end.s3-website-eu-west-1.amazonaws.com/"
        target="_blank"
        style="text-decoration: none"
      >
        <v-btn class="primary px-10 py-6 mx-auto">List your products</v-btn>
      </a>
    </div>
  </div>
</template>
<script>
import Banner from "@/components/publicPages/Banner.vue";
import ListedItems from "@/components/publicPages/ListedItems.vue";
export default {
  name: "Index",
  components: {
    Banner,
    ListedItems,
  },
};
</script>
<style lang="scss" scoped>
.main {
  .featured-item {
    margin: 50px 70px 0px 70px;
    .items-container {
      padding: 30px 0px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      overflow-x: auto;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .why-kuuzza {
    margin: 0px 0px 0px 70px;
    padding: 25px 0px;
    .image-container {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .top-seller {
    margin: 0px 70px 0px 0px;
    padding: 25px 0px;
    .image-container {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .logistics {
    margin: 0px 70px 0px 70px;
    padding: 25px 0px;
    .image-container {
      width: 100%;
      img {
        width: 100%;
        animation: rotation 20s infinite linear;
      }
    }
  }
  .get-started {
    margin: 0px 70px 0px 70px;
    padding: 25px 0px;
    .image-container {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .product-to-sell {
    padding: 60px 0px;
    background: var(--v-background-base);
    text-align: center;
  }
}
@media (max-width: 959px) {
  .main {
    .secondary-header {
      font-size: 27px;
    }
    .featured-item {
      margin: 50px 20px 0px 20px;
    }
    .why-kuuzza {
      margin: 0px 0px 0px 20px;
      &--text {
        order: 2;
        padding-right: 20px;
      }
      &--img {
        order: 1;
      }
    }
    .top-seller {
      margin: 0px;
      &--text {
        order: 2;
        padding: 0px 20px;
      }
      &--img {
        order: 1;
      }
    }
    .logistics {
      margin: 0px;
      &--text {
        order: 2;
        padding: 30px 20px 0px 20px;
      }
      &--img {
        order: 1;
      }
    }
    .get-started {
      margin: 0;
      &--text {
        padding: 0px 20px;
      }
      &--img {
        display: none;
      }
    }
  }
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>