<template>
  <div class="setup-page-page">
    <div class="setup-page-page__content">
      <div>
        <h3 class="secondary--text">You have not setup your store yet!</h3>
        <p class="setup-page-page__content__description">
          By setting up your personal store, customer’s would be able to buy
          products easily and faster.
        </p>
        <v-btn
          class="setup-page-page__btn mx-auto mt-5 primary"
          width="200px"
          height="48px"
          @click="dialog = true"
          >Setup my store</v-btn
        >
      </div>
    </div>
    <!-- setup modal -->
    <Modal :dialog="dialog" width="415px" height="494px">
      <v-card>
        <v-card-title>
          <h4 class="setup-page-page__modalTitle">Setup store</h4>
          <v-spacer></v-spacer>
          <v-icon
            style="cursor: pointer"
            @click="
              () => {
                this.dialog = false;
                this.$refs.form.reset();
              }
            "
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
              <label for="" class="font-weight-medium">User Name</label>
              <v-text-field
                outlined
                v-model="username"
                :rules="userNameRules"
                dense
                required
                class="mt-2"
              ></v-text-field>
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
                @click="dialog = false"
                color="primary"
                width="133px"
                height="38px"
                class="elevation-0 setup-page-page__btn font-small"
                >Cancel</v-btn
              >
              <v-btn
                color="primary"
                width="133px"
                height="38px"
                :disabled="setupLoader"
                :loading="setupLoader"
                class="ml-2 elevation-0 setup-page-page__btn font-small"
                @click="validateStoreDetails()"
                >Complete Setup</v-btn
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
      @closeDialog="closeResponseModal"
    />
  </div>
</template>

<script>
import Modal from "@/components/secondary/Modal.vue";
import ResponseModal from "@/components/secondary/ResponseModal.vue";
export default {
  components: {
    Modal,
    ResponseModal,
  },
  data() {
    return {
      dialog: false,
      responseDialog: false,
      dialogMessage: "",
      statusImage: false,
      setupLoader: false,
      storeName: "",
      username: "",
      storeDescription: "",
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
      if (this.$refs.form.validate()) this.setupStore();
    },
    setupStore() {
      this.setupLoader = true;
      this.$store
        .dispatch("inventory/setupStore", {
          id: this.$store.getters["settings/profile"].id,
          name: this.storeName,
          username: this.username,
          description: this.storeDescription,
        })
        .then(() => {
          this.dialog = false;
          this.statusImage = true;
          this.responseDialog = true;
          this.dialogMessage =
            "Congratulations, your store setup was succesful.";
        })
        .catch((error) => {
          this.setupLoader = false;
          if (error.status === 400) this.dialogMessage = error.data.message;

          if (error.status === 422) this.dialogMessage = error.data.message;
        });
    },
    closeResponseModal() {
      this.$router.push({
        name: "Store",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Setup.scss";
</style>