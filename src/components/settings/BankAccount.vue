<template>
  <div class="px-4 pt-7 my-2 pb-16 store-width">
    <div
      class="d-flex align-center justify-center mb-8"
      style="position: relative"
    >
      <router-link :to="{ name: 'ProfilePage' }" style="text-decoration: none">
        <span class="back-btn">
          <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
        </span>
      </router-link>
      <h3 class="align-self-center">Bank Accounts</h3>
    </div>

    <p class="secondary--text">Please provide your bank details</p>

    <v-form ref="form">
      <!-- Select Bank -->
      <div class="mb-5 settings-input">
        <p class="mb-1">Bank</p>
        <div style="height: 52px">
          <selectBtn
            :items="['Zenith Bank', 'Gt Bank']"
            :item="'Select Bank'"
          />
        </div>
      </div>

      <!-- acciunt number field-->
      <div class="mb-5 settings-input">
        <p class="mb-1">Account Number</p>
        <v-text-field
          class="input mt-0"
          v-model="accNumber"
          type="number"
          color="primary"
          placeholder="Enter account number"
          required
        >
        </v-text-field>
      </div>

      <v-btn class="primary py-6 px-4">Save</v-btn>
    </v-form>
  </div>
</template>
<script>
import selectBtn from "@/components/general/selectBtn.vue";
export default {
  name: "BankAccount",
  components: { selectBtn },
};
</script>
<style lang="scss" scoped>
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
.store-width {
  width: 50%;
}
.back-btn {
  position: absolute;
  left: 0px;
  top: 0;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 45px;
  min-width: 150px;
  padding: 0 16px;
}
@media (max-width: 950px) {
  .store-width {
    width: 100%;
  }
}
@media (max-width: 500px) {
  .v-btn:not(.v-btn--round).v-size--default {
    height: 40px;
    min-width: 100%;
    padding: 0 16px;
  }
}
</style>