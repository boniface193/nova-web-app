<template>
  <div class="card-container">
    <a @click="routeToProductDetails(product.product_id)">
      <div class="card-top">
        <div class="image-container">
          <img :src="product.product.image" alt="" />
        </div>
      </div>
      <div class="card-bottom">
        <h4 class="mb-1 product-name">
          {{ product.product.name }}
        </h4>
        <p
          class="d-flex align-center secondary--text mb-1"
          style="font-size: 12px"
        >
          <span>
            Profit:
            <span v-if="!editMode" style="color: black"
              >&#8358;{{ product.profit_label }}</span
            ></span
          >
          <!-- edit profit input filed -->
          <input
            v-if="editMode"
            class="ml-2 edit-mode-input"
            placeholder="profit"
            v-model="product.profit"
            @change="updateProductProfit(product)"
            :disabled="!editMode"
          />
        </p>
        <p class="secondary--text mb-0" style="font-size: 12px">
          Actual price:
          <span style="color: black"
            >&#8358;{{ product.product.total_price_label }}</span
          >
        </p>
        <p class="secondary--text mb-0" style="font-size: 16px">
          Store price:
          <span class="primary--text"
            >&#8358;{{ product.total_price_label }}</span
          >
        </p>
      </div>
      <v-checkbox
        v-show="editMode"
        @click="addToSelectedProducts(product)"
        v-model="productSelected"
        class="product-select-checkbox mr-1"
      ></v-checkbox>
      <p class="points">{{ product.product.points }}pts</p>
      <p class="out-of-stock" v-show="product.product.is_out_of_stock">Out of stock</p>
    </a>
  </div>
</template>
<script>
export default {
  name: "StoreProductCard",
  props: ["product", "editMode"],
  data: function () {
    return {
      productSelected: false,
    };
  },
  methods: {
    routeToProductDetails(product_id) {
      if (!this.editMode) {
        this.$router.push({
          name: "ProductPage",
          params: { id: product_id },
        });
      }
    },
    addToSelectedProducts(product) {
      this.$emit("addToSelectedProducts", product.id);
    },
    updateProductProfit(product) {
      this.$emit("updateProductProfit", {
        product_id: product.id,
        profit: product.profit,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.card-container {
  min-width: 190px;
  min-height: 310px;
  max-width: 190px;
  position: relative;
  cursor: pointer;
  &:hover {
    transform: scale(1.01);
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
    height: 185px;
    padding: 75px 7.5% 12px 7.5%;
    bottom: 0;
    background: #fff;
    border-radius: 12px;
    margin: 0px auto 0px auto;
    position: absolute;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    .v-btn:not(.v-btn--round).v-size--default {
      height: 25px !important;
      min-width: 100%;
      padding: 0 16px;
    }
    .actions-section {
      position: absolute;
      right: 7.5%;
      bottom: -50px;
      display: flex;
      flex-wrap: wrap;
      justify-content: end;
      z-index: 4;
      &__btn {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
        padding: 0 0 2px 0px;
        cursor: pointer;
      }
      &__dropdown {
        box-shadow: 0px 4px 10px rgba(43, 43, 43, 0.25);
        border-radius: 4px;
        background: white;
        padding: 15px 15px 10px 15px;
        width: 100%;
        margin-top: 3px;
        visibility: hidden;
        &__item {
          margin-bottom: 5px;
          display: block;
          font-size: 13px;
          cursor: pointer;
          color: #2b2b2b;
          display: flex;
          align-items: center;
        }
      }
      &:hover {
        .actions-section__dropdown {
          visibility: visible;
        }
      }
    }
    .product-name {
      height: 22px;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
    }
    .edit-mode-input {
      width: 100px;
      border: none;
      border-bottom: 1px solid #ddd;
      padding: 0px 3px;
      outline: none;
      &:focus {
        border-color: #029b97;
      }
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
  .out-of-stock {
    color: #d90000;
    position: absolute;
    font-size: 12px;
    top: -8px;
    left: 0px;
    z-index: 3;
  }
  .product-select-checkbox {
    position: absolute;
    top: -50px;
    left: 0;
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
@media (max-width: 365px) {
  .card-container {
    min-width: 120px;
    min-height: 230px;
    .card-top {
      height: 130px;
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
