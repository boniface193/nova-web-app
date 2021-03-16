<template>
  <!-- navbar -->
  <div class="navbar">
    <!-- site logo -->
    <div class="navbar--logo">
      <img src="@/assets/images/primary-logo.png" alt="" />
    </div>
    <!-- nav section -->
    <div class="navbar--nav">
      <!-- <router-link :to="{ path: '/' }" class="nav-item"
        ><span></span></router-link
      > -->
      <a
        href="http://nova-front-end.s3-website-eu-west-1.amazonaws.com/"
        target="_blank"
        style="text-decoration: none"
        class="nav-item"
        >List your products
      </a>
      <router-link :to="{ path: '/' }" class="nav-item">FAQs</router-link>
      <router-link :to="{ path: '/signin' }" class="nav-item"
        >Sign In</router-link
      >
      <router-link :to="{ path: '/signup' }" class="nav-item"
        ><v-btn class="primary px-8">Sell now</v-btn></router-link
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "Navbar",
};
</script>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--v-background-base);
  padding: 20px 70px;
  position: sticky;
  right: 0px;
  left: 0px;
  top: 0;
  margin: auto;
  z-index: 7;
  &--logo {
    width: 85px;
    display: flex;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &--nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 450px;
    .nav-item {
      text-decoration: none;
      color: var(--v-default-base);
    }
  }
}
@media (max-width: 959px) {
  .navbar {
    padding: 10px 20px;
    &--nav {
      display: none;
    }
  }
}
</style>