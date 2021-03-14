<template>
  <!-- navbar -->
  <div class="navbar">
    <!-- site logo -->
    <div class="navbar--logo">
      <img src="@/assets/images/primary-logo.png" alt="" />
    </div>
    <!-- nav section -->
    <div class="navbar--nav">
      <router-link :to="{ path: '/' }" class="nav-item"
        ><span>List your products</span></router-link
      >
      <router-link :to="{ path: '/' }" class="nav-item">Sell now</router-link>
      <router-link :to="{ path: '/' }" class="nav-item">FAQs</router-link>
      <router-link :to="{ path: '/signin' }" class="nav-item"
        >Sign In</router-link
      >
      <router-link :to="{ path: '/' }" class="nav-item"
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
  position: fixed;
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
    width: 550px;
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