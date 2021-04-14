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
        <p
          class="mb-0 mb-sm-1 minMaxProfit"
          style="color: #029b97; font-size: 12px"
        >
          &#8358;{{ product.min_profit_short }} - &#8358;{{
            product.max_profit_short
          }}
        </p>
        <p class="secondary--text mb-3" style="font-size: 10px">
          Recommended profit
        </p>

        <v-btn class="primary sell-now" depressed>Sell</v-btn>
        <span class="primary sell-now-secondary">Sell</span>
      </div>
      <p class="points">{{ product.points }}pts</p>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "ProductCard",
  props: ["product"],
};
</script>
<style lang="scss" scoped>
.card-container {
  min-width: 200px;
  min-height: 340px;
  position: relative;
  margin: auto 5px;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
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
    height: 250px;
    padding: 110px 7.5% 12px 7.5%;
    bottom: 0;
    background: #fff;
    border-radius: 12px;
    margin: 0px auto 0px auto;
    position: absolute;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    .v-btn:not(.v-btn--round).v-size--default {
      height: 25px;
      min-width: 100%;
      padding: 0 16px;
    }
    .sell-now-secondary {
      display: none;
    }
    .product-name {
          height: 22px;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
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
    min-width: 48.4%;
    margin: auto 0.8%;
    min-height: 240px;
    &:hover {
      transform: scale(1);
    }
    .card-top {
      height: 150px;
      .image-container {
        height: 120px;
        img {
          width: 85%;
        }
      }
    }
    .card-bottom {
      padding-top: 95px;
      height: 180px;
      .product-name {
        font-size: 12px;
      }
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
</style>