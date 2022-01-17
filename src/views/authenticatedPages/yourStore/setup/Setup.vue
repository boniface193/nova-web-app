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
          style="border-radius: 4px"
          dark
          class="elevation-0"
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
          <v-divider></v-divider>
          <div class="container">
            <v-form ref="form" v-model="valid" lazy-validation class="px-3">
              <label for="" class="mb-6">Store Name</label>
              <v-text-field
                outlined
                v-model="name"
                :rules="nameRules"
                dense
                required
              ></v-text-field>
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