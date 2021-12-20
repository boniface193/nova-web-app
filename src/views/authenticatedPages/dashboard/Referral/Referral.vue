<template>
  <div class="referer-container">
    <!-- header section -->
    <div
      class="d-flex align-center justify-center mb-8"
      style="position: relative"
    >
      <router-link :to="{ name: 'Dashboard' }" style="text-decoration: none">
        <span class="referer-container__back-btn">
          <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
        </span>
      </router-link>
      <h3 class="align-self-center">Refer a friend and earn</h3>
    </div>
    <!-- navigation section -->
    <div class="referer-container__navigation">
      <!-- nav link -->
      <router-link
        class="referer-container__navigation-item"
        :class="{
          'referer-container__navigation-item--active':
            this.$route.name == 'ReferFriends',
        }"
        :to="{ name: 'ReferFriends' }"
        >Refer Friends</router-link
      >
      <!-- nav link -->
      <router-link
        class="referer-container__navigation-item"
        :class="{
          'referer-container__navigation-item--active':
            this.$route.name == 'ViewReferrals',
        }"
        :to="{ name: 'ViewReferrals' }"
        >View Referrals</router-link
      >
      <!-- nav link -->
      <router-link
        class="referer-container__navigation-item"
        :class="{
          'referer-container__navigation-item--active':
            this.$route.name == 'ReferralEarnings',
        }"
        :to="{ name: 'ReferralEarnings' }"
        >Earnings</router-link
      >
    </div>

    <div class="referer-container__content">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  name: "Referer",
};
</script>
<style lang="scss" scoped>
.referer-container {
  &__back-btn {
    position: absolute;
    left: 0px;
    top: 0;
  }
  &__navigation {
    &-item {
      padding: 10px 5px;
      border-bottom: 3px solid transparent;
      display: inline-block;
      margin: 0px 40px 0px 0px;
      margin-bottom: -2px;
      text-decoration: none;
      color: #000;
      &--active {
        color: var(--v-primary-base);
        border-color: var(--v-primary-base);
      }
    }
  }
  &__content {
    margin-left: -30px;
    margin-right: -30px;
    padding: 30px 30px;
    background: #fafafa;
    min-height: 550px;
  }
}
@media (max-width: 500px) {
  .referer-container {
    &__navigation {
      &-item {
         margin: 0px 10px 0px 0px;
      }
    }
  }
}
</style>