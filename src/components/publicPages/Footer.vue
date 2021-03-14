<template>
  <div class="footer">
    <v-row class="py-10">
      <v-col class="col-3">
        <div class="logo-conatiner">
          <img src="" alt="" />
        </div>
      </v-col>
      <v-col class="col-3">
        <p class="white--text">
          26 Adewale Kolawole Crescent, Marwa, Lagos, Nigeria
        </p>
      </v-col>
      <v-col class="col-3">
        <p class="white--text">Info@brandmobileafrica.com</p>
      </v-col>
      <v-col class="col-3">
        <p class="white--text">+234 818 655 1443</p>
      </v-col>
    </v-row>
    <p class="mt-8 white--text">Kuuzza is a product of BrandMobileAfrica</p>

    <div class="mask"></div>
  </div>
</template>
<script>
export default {
  name: "Footer",
};
</script>
<style lang="scss" scoped>
.footer {
  padding: 50px 70px;
  width: 100%;
  background: var(--v-primary-base);
  position: relative;
  .logo-conatiner {
    width: 120px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .mask {
    background: url("../../assets/images/footer-mask.png");
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-attachment: fixed;
  }
}

</style>