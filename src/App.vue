<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="scss">
@font-face {
  font-family: "Product Sans Bold";
  src: local("Product Sans Bold"),
    url("~@/assets/fonts/Product Sans Bold.ttf") format("truetype");
}
@font-face {
  font-family: "Product Sans Regular";
  src: local("Product Sans Regular"),
    url("~@/assets/fonts/Product Sans Regular.ttf") format("truetype");
}
* {
  box-sizing: border-box;
  font-family: "Product Sans Regular";
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Product Sans Bold";
}
body {
  padding: 0;
  margin: auto;
}
#app {
  max-width: 1800px;
  margin: auto;
  .v-btn {
    text-transform: capitalize;
    display: flex;
    align-items: center;
    justify-content: center;
    .v-btn__loader {
      color: #029b97;
    }
  }
  .v-btn:not(.v-btn--round).v-size--default {
    height: 40px;
    border-radius: 8px;
  }
}
</style>
