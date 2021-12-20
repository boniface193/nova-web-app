<template>
  <v-app>
    <!-- app root -->
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  metaInfo() {
    return {
      title:
        "Kuuzza Seller | Gain access to thousands of products at zero cost and start selling!",
      meta: [
        {
          name: "description",
          content:
            "Kuuzza Seller | Gain access to thousands of products at zero cost and start selling!",
        },
        {
          property: "og:title",
          content:
            "Kuuzza Seller | Gain access to thousands of products at zero cost and start selling!",
        },
        {
          property: "og:site_name",
          content:
            "Gain access to thousands of products at zero cost and start selling!",
        },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
};
</script>
<style lang="scss">
@import "./assets/styling/index.scss";
</style>
