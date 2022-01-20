<template>
  <div>
    <div class="secondary-container__notification" v-if="addToCartLoad">
      <div class="secondary-container__notification__message">
        <p class="white--text mb-0">
          <v-progress-circular
            size="20"
            indeterminate
            color="white mr-3"
            class="mx-2"
          ></v-progress-circular>

          <span>Adding kuda to cart</span>
          <v-icon
            size="20"
            style="cursor: pointer"
            class="mx-2 error--text"
            @click="closeLoader"
            >mdi-close</v-icon
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    addToCartLoad: {
      Boolean: true,
    },
  },
  data() {
    return {};
  },

  methods: {
    closeLoader() {
        this.addToCartLoad = false
    },
  },
};
</script>

<style lang="scss" scoped>
.secondary-container {
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
</style>