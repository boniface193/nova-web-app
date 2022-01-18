<template>
  <div class="card-container">
    <router-link
      :to="{
        name: 'ProductPage',
        params: { id: product.id, createLink: false },
      }"
      style="text-decoration: none"
    >
      <div class="card-top">
        <div class="image-container">
          <img :src="product.image" alt="" />
        </div>
      </div>
      <div class="card-bottom">
        <h4 class="mb-0 mb-sm-1 product-name" style="color: black">
          {{ product.name }}
        </h4>
        <p class="secondary--text mb-0 mb-sm-1 total_price">
          &#8358;{{ product.total_price_label }}
        </p>

        <v-btn
          class="primary sell-now"
          width="162px"
          height="28px"
          @click.prevent.stop="showAddtoCartModal()"
          depressed
          >Add to cart</v-btn
        >
        <span
          class="primary sell-now-secondary"
          @click.prevent.stop="showAddtoCartModal()"
          >+</span
        >
      </div>
      <p class="points">{{ product.points }}pts</p>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "ProductCard",
  props: ["product", "addToCartDialog"],
  data: function () {
    return {};
  },
  methods: {
    showAddtoCartModal() {
      this.$emit("addToCart", this.product);
    },
  },
};
</script>
<style lang="scss" scoped>
.card-container {
  min-width: 190px;
  min-height: 310px;
  position: relative;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
  .sell-now{
    border-radius: 4px !important;
    height: 28px;
    font-style: normal;
    font-weight: normal;
    font-size: 12px !important;
    line-height: 18px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
  }
  .card-top {
    width: 85%;
    height: 190px;
    background: #f3f5ff;
    border-radius: 12px;
    z-index: 1;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    .image-container {
      width: 100%;
      height: 130px;
      margin: auto;
      text-align: center;
      img {
        width: 85%;
        height: 100%;
      }
    }
  }
  .card-bottom {
    width: 100%;
    height: 181px;
    padding: 80px 7.5% 12px 7.5%;
    bottom: 0;
    background: #fff;
    border-radius: 12px;
    margin: 0px auto 0px auto;
    position: absolute;
    box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.1);
    .v-btn:not(.v-btn--round).v-size--default {
      height: 25px !important;
      min-width: 100%;
      padding: 0 16px;
    }
    .sell-now-secondary {
      display: none;
    }
    .product-name {
      height: 24px;
      font-size: 16px;
      font-weight: bold !important;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
    }
    .total_price {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        height: 24px;
        color: rgba(43, 43, 43, 0.6);
      }
  }
  .points {
    background: #ffba00;
    color: #fff;
    padding: 2px 5px;
    position: absolute;
    font-size: 12px;
    top: -8px;
    right: 0px;
    z-index: 3;
    border-radius: 8px;
  }
}
@media (max-width: 650px) {
  .card-container {
    min-height: 340px;
    min-width: 170px;
  }
}
@media (max-width: 595px) {
  .card-container {
    min-width: 150px;
    min-height: 240px;
    &:hover {
      transform: scale(1);
    }
    .card-top {
      height: 149px;
      .image-container {
        height: 120px;
        img {
          width: 85%;
        }
      }
    }
    .card-bottom {
      padding-top: 95px;
      height: 163px;

      .sell-now-secondary {
        display: block;
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        position: absolute;
        bottom: 25px;
        right: 15px;
      }
      .sell-now {
        display: none !important;
      }
    }
  }
}
@media (max-width: 365px) {
  .card-container {
    min-width: 120px;
    min-height: 230px;
    .card-top {
      height: 149px;
      .image-container {
        height: 80px;
        img {
          width: 85%;
        }
      }
    }
    .card-bottom {
      padding-top: 90px;
      .sell-now-secondary {
        bottom: 35px;
        right: 5px;
      }
    }
  }
}
</style>
