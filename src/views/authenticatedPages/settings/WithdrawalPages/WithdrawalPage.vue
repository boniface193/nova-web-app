<template>
  <div>
    <div v-show="!pageLoader">
      <router-view :accountDetails="accountDetails" />
    </div>
    <!-- page loader -->
    <div class="d-flex text-center" v-if="pageLoader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
    </div>
    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog" width="400">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="dialog = false"
            >mdi-close</v-icon
          >
        </div>
        <div class="mb-7 mt-5 mx-auto status-img">
          <v-img :src="statusImage"></v-img>
        </div>

        <h4>{{ dialogMessage }}</h4>
      </div>
    </Modal>
  </div>
</template>
<script>
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
import { mapGetters } from "vuex";
export default {
  name: "WithdrawalPage",
  components: { Modal },
  data: function () {
    return {
      pageLoader: false,
      dialog: false,
      dialogMessage: "",
      statusImage: null,
      accountDetails: {
        data: {},
        meta: {
          has_bank_account: true,
        },
      },
    };
  },
  created() {
    this.pageLoader = true;
    if (this.$store.getters["settings/profile"].name === "") {
      this.$store.dispatch("settings/getUserProfile").then(() => {
        this.getUserBankDetails();
      });
    } else {
      this.getUserBankDetails();
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "settings/profile",
    }),
  },
  methods: {
    // get user bank details
    getUserBankDetails() {
      this.$store
        .dispatch("bankService/getUserBankDetails", {
          user_id: this.userInfo.id,
        })
        .then((response) => {
          this.pageLoader = false;
          this.accountDetails = response.data;
          if (this.accountDetails.meta.has_bank_account === true) {
            if (this.$route.name !== "WithdrawFund") {
              this.$router.push({
                name: "WithdrawFund",
              });
            }
          } else {
            if (this.$route.name !== "AddBankDetails") {
              this.$router.push({
                name: "AddBankDetails",
              });
            }
          }
        })
        .catch((error) => {
          this.pageLoader = false;
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
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