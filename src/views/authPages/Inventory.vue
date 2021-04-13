<template>
  <div style="height:100%" class="pb-16">
    <router-view />
  </div>
</template>
<script>
import failedImage from "@/assets/images/failed-img.svg";
import modal from "@/components/modal.vue";
export default {
  name: "Inventory",
  components: { modal },
  data: function () {
    return {
      loader: false,
      statusImage: null,
      dialog: false,
      dialogMessage: "",
    };
  },
  created() {
    if (this.$store.getters["inventory/products"].length === 0) {
      this.loader = true;
      this.$store
        .dispatch("inventory/getProducts")
        .then(() => {
          this.loader = false;
          this.dialog = false;
        })
        .catch((error) => {
          this.loader = false;
          this.dialog = true;
          this.statusImage = failedImage;
          if (error.response) {
            this.dialogMessage = "Sorry, this data does not Exist";
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    }
  },
};
</script>