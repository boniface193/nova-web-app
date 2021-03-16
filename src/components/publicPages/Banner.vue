<template>
  <!-- banner -->
  <div class="banner">
    <v-row>
      <v-col class="d-flex align-center col-12 col-md-6">
        <div class="text-center text-md-left">
          <h1 class="slogan mb-3">
            <span class="primary--text">Anyone </span>can sell.
          </h1>
          <p class="secondary--text mb-5">
            With Kuuzzza, absolutely anyone can sign up, gain access to
            inventory and become a seller for our partner brands, with no
            upfront costs
          </p>
          <v-btn class="primary px-10 py-6 mx-auto mx-md-0">Sell now</v-btn>
        </div>
      </v-col>
      <v-col class="col-12 col-md-6 banner--img"></v-col>
    </v-row>
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
  .slogan {
    font-size: 50px;
  }
}
@media (max-width: 959px) {
  .banner {
    padding: 50px 20px;
    .slogan{
      font-size: 35px;
    }
    &--img{
      display: none;
    }
  }
}
</style>