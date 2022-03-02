<template>
  <div>
    <!-- setup modal -->
    <Modal :dialog="dialog" width="415px" height="494px">
      <v-card>
        <v-card-title>
          <h4 class="update-setup-page__modal-title">Update store details</h4>
          <v-spacer></v-spacer>
          <v-icon style="cursor: pointer" @click="closeEditStoreModal()"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider class="mb-3"></v-divider>
        <!-- error message -->
        <p
          class="error--text text-center px-3"
          v-show="dialogMessage !== '' && responseDialog === false"
        >
          {{ dialogMessage }}
        </p>

        <div class="container">
          <!-- form section -->
          <v-form ref="form" v-model="formIsValid" lazy-validation class="px-3">
            <div>
              <label for="" class="font-weight-medium">Store Name</label>
              <v-text-field
                outlined
                v-model="storeName"
                :rules="storeNameRules"
                dense
                required
                class="mt-2"
              ></v-text-field>
            </div>
            <div>
              <label style="position:relative" for="" class="font-weight-medium">User Name</label>
              <v-text-field
                outlined
                v-model="username"
                :rules="userNameRules"
                dense
                required
                class="mt-2"
              ></v-text-field>
              <p class="mb-0 store-url">.kuuzza.store</p>
            </div>
            <div>
              <label for="" class="font-weight-medium">Store Description</label>
              <v-textarea
                outlined
                v-model="storeDescription"
                :rules="storeDescriptionRules"
                required
                class="mt-2"
                height="119px"
              >
              </v-textarea>
            </div>
            <div class="mb-5 d-flex justify-end">
              <v-btn
                outlined
                @click="closeEditStoreModal()"
                color="primary"
                width="133px"
                height="38px"
                class="elevation-0 update-setup-page__btn font-small"
                >Cancel</v-btn
              >
              <v-btn
                color="primary"
                width="133px"
                height="38px"
                :disabled="setupLoader"
                :loading="setupLoader"
                class="ml-2 elevation-0 update-setup-page__btn font-small"
                @click="validateStoreDetails()"
                >Update Store</v-btn
              >
            </div>
          </v-form>
        </div>
      </v-card>
    </Modal>

    <!-- Response Modal -->
    <ResponseModal
      :dialog="responseDialog"
      :status="statusImage"
      :dialogMessage="dialogMessage"
      @closeDialog="closeEditStoreModal"
    />

    <Modal :dialog="warningDialog" width="450px">
      <div class="white py-5 px-7 pb-10 dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="warningDialog = false"
            >mdi-close</v-icon
          >
        </div>

        <h3 class="mt-2 mb-2">
          Are you sure you want to change your store username?
        </h3>
        <p>
          This would directly affects customers that already have the present
          link to your store and they wont be able to access your store via that
          link anymore. <br /><i
            class="mt-2 error--text"
            style="font-size: 14px"
            >Note: Your store username would be reviewed and the changes would
            take effect in 14 days.</i
          >
        </p>

        <div
          class=" mx-auto d-flex justify-space-between"
          style="max-width: 300px"
        >
          <v-btn
            outlined
            @click="warningDialog = false"
            color="primary"
            width="133px"
            height="38px"
            class="elevation-0 update-setup-page__btn font-small"
            >No</v-btn
          >
          <v-btn
            color="error"
            width="133px"
            height="38px"
            :disabled="setupLoader"
            :loading="setupLoader"
            class="ml-2 elevation-0 update-setup-page__btn font-small"
            @click="updateStore()"
            >Yes</v-btn
          >
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/secondary/Modal.vue";
import ResponseModal from "@/components/secondary/ResponseModal.vue";
export default {
  name: "EditStoreDetails",
  props: ["dialog"],
  components: {
    Modal,
    ResponseModal,
  },
  data() {
    return {
      warningDialog: false,
      responseDialog: false,
      dialogMessage: "",
      statusImage: false,
      setupLoader: false,
      storeName: this.$store.getters["inventory/sellerStoreDetails"].name,
      username: this.$store.getters["inventory/sellerStoreDetails"].username,
      storeDescription:
        this.$store.getters["inventory/sellerStoreDetails"].description,
      formIsValid: true,
      storeNameRules: [(v) => !!v || "This field is required"],
      userNameRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "Please input your store username",
        //() => this.validAddress || "Select a valid address",
      ],
      storeDescriptionRules: [
        (v) => !!v || "Please tell us what your store is about",
      ],
    };
  },
  methods: {
    validateStoreDetails() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        if (
          this.username !==
          this.$store.getters["inventory/sellerStoreDetails"].username
        ) {
          this.warningDialog = true;
        } else {
          this.updateStore();
        }
      }
    },
    updateStore() {
      this.setupLoader = true;
      let data = {
        name: this.storeName,
        description: this.storeDescription,
      };
      if (
        this.username !==
        this.$store.getters["inventory/sellerStoreDetails"].username
      ) {
        data.username = this.username; 
        //data.username = this.$store.getters["inventory/sellerStoreDetails"].username;
      }
      this.$store
        .dispatch("inventory/updateStore", data)
        .then(() => {
          this.statusImage = true;
          this.responseDialog = true;
          this.dialogMessage =
            "Congratulations, you have succesfully updated your store details.";
        })
        .catch((error) => {
          this.setupLoader = false;
          this.warningDialog = false
          if (error.status === 400) this.dialogMessage = error.data.message;

          if (error.status === 422) this.dialogMessage = error.data.message;
        });
    },
    closeEditStoreModal() {
      this.responseDialog = false;
      this.$emit("closeEditStoreModal");
    },
  },
};
</script>
<style lang="scss" scoped>
.update-setup-page {
  &__btn {
    border-radius: 4px !important;
    &.font-small {
      font-size: 12px !important;
      line-height: 18px;
    }
  }
}
.store-url {
  position: absolute;
  right: 48px;
  margin-top: -58px;
}
</style>