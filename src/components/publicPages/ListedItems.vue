<template>
  <div class="card-container">
    <div class="card-top">
      <div class="image-container">
        <img src="@/assets/images/phone.jpg" alt="" />
      </div>
    </div>
    <div class="card-bottom">
      <h4 class="mb-0 mb-sm-1 product-name" >
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
  </div>
</template>
<script>
export default {
  name: "ListedItems",
  data: function() {
      return {
          product: {
              name: "Infinix hot 9",
              points: 50,
              min_profit_short: '2,000',
              max_profit_short: '5,000',
              total_price_label: '70,000',
              image: "@/assets/images/phone.jpg"
          }
      }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  min-width: 220px;
  width: 220px;
  min-height: 360px;
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
    z-index: 2;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    .image-container {
      width: 100%;
      height: 150px;
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
    height: 270px;
    padding: 120px 7.5% 12px 7.5%;
    bottom: 0;
    background: #fff;
    border-radius: 12px;
    margin: 0px auto 0px auto;
    position: absolute;
    z-index: 1;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    .v-btn:not(.v-btn--round).v-size--default {
      height: 30px;
      min-width: 100%;
      padding: 0 16px;
    }
    .sell-now-secondary {
      display: none;
    }
    .product-name {
      height: 22px;
      overflow-y: hidden;
      word-break: break-all;
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
</style>