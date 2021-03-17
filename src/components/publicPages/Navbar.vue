<template>
  <!-- navbar -->
  <div class="navbar">
    <!-- site logo -->
    <div class="navbar--logo">
      <img src="@/assets/images/primary-logo.png" alt="" />
    </div>
    <!-- menu icon -->
    <v-icon size="25" class="menu-icon" @click="toggleMobileNav()">
      mdi-segment</v-icon
    >

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
    <!-- mobile nav section -->
    <div class="mobile-navbar--nav" :class="{ 'open-mobile-nav': mobileNav }">
      <div class="content px-5">
        <div class="d-flex justify-end mb-8">
          <v-icon
            color="white"
            size="32"
            @click="toggleMobileNav()"
            style="cursor: pointer"
            >mdi-close</v-icon
          >
        </div>
        <a
          href="http://nova-front-end.s3-website-eu-west-1.amazonaws.com/"
          target="_blank"
          style="text-decoration: none"
          class="nav-item white--text"
          >List your products
        </a>
        <router-link :to="{ path: '/' }" class="nav-item white--text"
          >FAQs</router-link
        >
        <router-link :to="{ path: '/signin' }" class="nav-item white--text"
          >Sign In</router-link
        >
        <router-link :to="{ path: '/signup' }" class="nav-item white--text"
          ><v-btn class="background primary--text px-8 mx-auto"
            >Sell now</v-btn
          ></router-link
        >
      </div>
      <div
        :class="{ 'close-body': mobileNav }"
        @click="toggleMobileNav()"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Navbar",
  data: function () {
    return {
      mobileNav: false,
    };
  },
  methods: {
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
  },
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
  .mobile-navbar--nav {
    position: fixed;
    height: 100%;
    height: 100vh;
    top: 0px;
    left: 0;
    max-height: calc(100% - 0px);
    .content {
      min-width: 250px;
      transition: 0.5s ease;
      height: 100%;
      background: var(--v-primary-base);
      text-align: center;
      padding-top: 20px;
      margin-left: -250px;
      .nav-item {
        text-decoration: none;
        display: block;
        margin: 0px 0px 15px 0px;
      }
    }
  }
  .menu-icon {
    display: none;
    color: black;
  }
}
@media (max-width: 959px) {
  .navbar {
    padding: 10px 20px;
    box-shadow: 0px 3px 12px #3653541a;
    &--nav {
      display: none;
    }
    .menu-icon {
      display: block;
    }
    .open-mobile-nav {
      .content {
        margin-left: 0px;
      }
    }
    .close-body {
      opacity: 0.46;
      background-color: #212121;
      z-index: -1;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
    }
  }
}
</style>