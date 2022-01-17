<template>
  <div class="justify-center d-flex">
    <div class="setup-page-page__header">
      <h3 class="setup-page-page__text-heading font-weight-bold">
        You have not setup your store yet!
      </h3>
      <p class="setup-page-page__text-subheading mt-1">
        By setting up your personal store, customer’s would be able to buy
        products easily and faster.
      </p>
      <div class="justify-center d-flex" style="margin-top: 40px">
        <v-btn
          color="primary"
          dark
          class="elevation-0 setup-page-page__radius"
          width="200px"
          height="48px"
          @click="openDialog"
          >Setup my store</v-btn
        >
      </div>
      <Modal :dialog="dialog" width="415px" height="494px">
        <v-card>
          <v-card-title>
            <h4 class="setup-page-page__modalTitle">Setup store</h4>
            <v-spacer></v-spacer>
            <v-icon style="cursor: pointer" @click="dialog = false"
              >mdi-close</v-icon
            >
          </v-card-title>
          <v-divider class="mb-3"></v-divider>
          <div class="container">
            <v-form ref="form" v-model="valid" lazy-validation class="px-3">
              <div>
                <label for="">Store Name</label>
                <v-text-field
                  outlined
                  v-model="storeName"
                  :rules="nameRules"
                  dense
                  required
                  class="mt-2"
                ></v-text-field>
              </div>
              <div>
                <label for="">User Name</label>
                <v-text-field
                  outlined
                  v-model="username"
                  :rules="nameRules"
                  dense
                  required
                  class="mt-2"
                ></v-text-field>
              </div>
              <div>
                <label for="">Store Discription</label>
                <v-textarea outlined v-model="storeDiscrip" class="mt-2" height="119px">

                </v-textarea>
              </div>
              <div class="mb-5 d-flex justify-end">
                <v-btn outlined @click="dialog = false" color="primary" width="133px" height="38px" class="elevation-0 setup-page-page__radius setup-page-page__radius_font">Cancel</v-btn>
                <v-btn color="primary" width="133px" height="38px" class="ml-2 elevation-0 setup-page-page__radius setup-page-page__radius_font">Complete Setup</v-btn>
              </div>
            </v-form>
          </div>
        </v-card>
      </Modal>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/secondary/Modal.vue";
export default {
  components: {
    Modal,
  },
  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Setup.scss";
</style>