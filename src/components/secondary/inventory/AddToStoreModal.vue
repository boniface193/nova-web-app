<template>
  <div class="add-to-store-container">
    <div
      class="add-to-store-container__notification"
      v-if="productNames.length > 0"
    >
      <div
        class="add-to-store-container__notification__message"
        v-for="(productName, index) in productNames"
        :key="index"
      >
        <p class="white--text mb-0">
          <v-progress-circular
            size="20"
            indeterminate
            color="white mr-3"
          ></v-progress-circular>

          <span>Adding {{ productName }} to store</span>
          <v-icon style="cursor: pointer" class="ml-1 error--text"
            >mdi-close</v-icon
          >
        </p>
      </div>
    </div>

    <!--------------------------- Modal for dialog messages ------------------------------>
    <Modal :dialog="addToStoreDialog" width="500">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="closeAddToStoreDialog"
            >mdi-close</v-icon
          >
        </div>
        <h3 class="text-left mt-3">
          Product name:
          <span style="font-weight: normal">{{ product.name }}</span>
        </h3>
        <!-- recommended profit -->
        <p class="text-left mt-2" v-if="product.is_fmcg == false">
          Recommended profit:
          <span class="primary--text">
            &#8358;{{ product.min_profit_short }} - &#8358;{{
              product.max_profit_short
            }}
          </span>
        </p>

        <v-form class="text-left mt-1" ref="variantForm">
          <!-- enter profit section and also shows when a product is not FMCG-->
          <div
            class="d-flex mb-3"
            style="align-items: baseline"
            v-if="product.is_fmcg == false"
          >
            <p class="mr-5 mb-0">Enter profit(N) per unit:</p>
            <div style="max-width: 200px">
              <v-text-field
                v-model="profitPerUnit"
                :rules="profitRules"
                required
                style="width: 200px"
              ></v-text-field>
              <v-text-field style="display: none"></v-text-field>
            </div>
          </div>

          <!-- show when a product is FMCG -->
          <div class="d-flex" v-else>
            <h3 class="mr-5 mb-0">Profit(N) per unit:</h3>
            <span>{{ product.seller_profit_label }}</span>
          </div>

          <!-- error message -->
          <p
            class="error--text text-center px-3"
            v-show="dialogMessage !== ''"
            v-html="dialogMessage"
          ></p>

          <v-btn
            height="30"
            class="primary"
            :disabled="productIsAddedToStore || addToStoreLoader"
            :loading="addToStoreLoader"
            rounded
            depressed
            @click="addToStore"
            >{{ productIsAddedToStore ? "Added" : "Add to store" }}</v-btn
          >
        </v-form>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "AddToStoreModal",
  components: {
    Modal,
  },
  props: ["product", "addToStoreDialog"],
  data: function () {
    return {
      statusImage: null,
      dialogMessage: "",
      maxProfit: 0,
      profitPerUnit: 0,
      productNames: [],
      addToStoreLoader: false,
      loaderIndex: -1,
      productIsAddedToStore: false,
      profitRules: [
        (v) => !!v || "Profit is required", // verifies name satisfies the requirement
        (v) => Math.sign(v) !== -1 || "Negative profit is not allowed",
        (v) =>
          v <= this.maxProfit ||
          "Profit must be less than maximum recommended profit",
      ],
    };
  },
  computed: {},
  watch: {
    immediate: true,
    product: function (currentProduct) {
      this.maxProfit = currentProduct.max_profit;
      this.variants = currentProduct.variants || [];
    },
  },
  methods: {
    closeAddToStoreDialog() {
      this.$emit("closeAddToStoreDialog");
      this.profitPerUnit = 0;
      this.$refs.variantForm.reset();
      this.productIsAddedToStore = false;
    },
    validateProductToBeAdded() {
      this.$refs.variantForm.validate();
      if (this.$refs.variantForm.validate()) this.addToStore();
    },
    addToStore() {
      this.addToStoreLoader = true;
      this.$store
        .dispatch("inventory/addProductToStore", {
          product_id: this.product.id,
          profit: parseInt(this.profitPerUnit, 10),
        })
        .then(() => {
          this.productIsAddedToStore = true;
          this.addToStoreLoader = false;
          this.closeAddToStoreDialog();
          this.$emit("setAddToStoreStatus");
          this.dialogMessage= "";
        })
        .catch((error) => {
          this.addToStoreLoader = false;
          if (error.status === 400) {
            if (
              error.data.message == "No store is associated with this account"
            ) {
              this.dialogMessage = `${error.data.message} <a href="/your-store/setup" class="primary--text" style="text-decoration:underline">Setup store</a>`;
            } else this.dialogMessage = error.data.message;
          }
          if (error.status === 422) this.dialogMessage = error.data.message;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.add-to-store-container {
  &__notification {
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 203;
    &__message {
      border-radius: 5px;
      padding: 10px;
      background: #ffba00;
      margin-bottom: 5px;
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
</style>