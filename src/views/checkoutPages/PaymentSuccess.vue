<template>
  <div
    class="d-flex justify-center align-center py-5 px-5"
    style="height: 100%"
  >
    <div class="text-center">
      <div class="mb-7 mt-5 mx-auto status-img">
        <v-img :src="statusImage"></v-img>
      </div>

      <h3>
        Congratulation! Your Payment was Successfully
      </h3>

      <v-btn class="primary mx-auto mt-4" @click="viewOrderStatus"
        >Track your order here</v-btn
      >
    </div>
  </div>
</template>
<script>
import successImage from "@/assets/images/success-img.svg";
export default {
  name: "PaymentSuccess",
  data: function () {
    return {
      statusImage: successImage,
    };
  },
  methods: {
    viewOrderStatus() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("session_id");
      this.$router.push({
        path: `/order-status?session_id=${orderId}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
</style>