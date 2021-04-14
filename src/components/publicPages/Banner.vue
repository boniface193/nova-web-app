<template>
  <!-- banner -->
  <div class="banner">
    <v-row>
      <v-col class="d-flex align-center col-12 col-md-6">
        <div class="text-center text-md-left mx-md-0 mx-auto">
          <!-- site description -->
          <div class="slogan-primary" style="margin-top: -120px">
            <h1 class="primary--text">Anyone</h1>
            <h1 class="slogan mb-3">can sell.</h1>
          </div>
          <h1 class="slogan-secondary mb-3">
            <span class="primary--text">Anyone </span>can sell.
          </h1>
          <p class="secondary--text mb-5">
            <!-- With Kuuzzza, anyone can sign up, gain access to inventory and
            become a seller for our partner brands, at no upfront costs -->
            Sign up and gain access to thousands of Products to sell to your <br class="breaker"/>customers - at zero cost!
          </p>
          <!-- <router-link :to="{ path: '/signup' }" style="text-decoration: none">
            <v-btn class="primary px-10 mx-auto mx-md-0">Sell now</v-btn>
          </router-link> -->
          <a
            href=" https://share.hsforms.com/1_UvzlcUDQkO20aievfd3Zwbnc5b"
            target="_blank"
            style="text-decoration: none"
            ><v-btn class="primary px-10 mx-auto mx-md-0">Join Waitlist</v-btn></a
          >
        </div>
      </v-col>
      <v-col class="col-12 col-md-6 banner--img pb-10">
        <div class="image-container">
          <img src="@/assets/images/banner-image.png" alt="" />
        </div>
        <img class="play-img1" src="@/assets/images/Group12487.svg" alt="" />
        <img class="play-img2" src="@/assets/images/Group12482.svg" alt="" />
        <img class="play-img3" src="@/assets/images/Group13976.svg" alt="" />
        <div class="banner-design1"></div>
        <div class="banner-design2"></div>
      </v-col>
    </v-row>
    <div class="curved-design1"></div>
  </div>
</template>
<script>
export default {
  name: "Banner",
};
</script>
<style lang="scss" scoped>
.banner {
  padding: 20px 70px;
  background: var(--v-background-base);
  position: relative;
  .slogan-primary {
    h1 {
      font-size: 90px;
    }
    .slogan {
      margin-top: -50px;
    }
  }
  .slogan-secondary {
    display: none;
  }
  &--img {
    position: relative;
    .image-container {
      width: 100%;
      img {
        width: 100%;
      }
    }
    .play-img1 {
      position: absolute;
      bottom: 2%;
      left: 45%;
      width: 85px;
    }
    .play-img2 {
      position: absolute;
      top: 10%;
      right: 2%;
      width: 60px;
      //animation: rotation 5s infinite linear;
    }
    .play-img3 {
      position: absolute;
      left: 15%;
      top: 25%;
      width: 80px;
    }
    .banner-design1 {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ffa500;
      bottom: 23%;
      left: 15%;
      position: absolute;
    }
    .banner-design2 {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: #029b97;
      bottom: 35%;
      right: 0%;
      position: absolute;
    }
  }
  .curved-design1 {
    border: 1px solid #ffa500;
    position: absolute;
    width: 100%;
    height: 0px;
    display: none;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
  }
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
@media (max-width: 959px) {
  .banner {
    .breaker{
      display: none;
    }
    padding: 50px 20px;
    .slogan-primary {
      display: none;
    }
    .slogan-secondary {
      display: block;
      font-size: 35px;
      margin-top: 0px;
    }
    &--img {
      display: none;
    }
  }
}
</style>