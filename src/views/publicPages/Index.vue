<template>
  <div style="position: relative; width: 100%">
    <!-- navbar section -->
    <Navbar />
    
    <router-view />

    <!-- Footer section -->
    <Footer />  
  </div>
</template>
<script>
import Navbar from "@/components/publicPages/Navbar.vue";
import Footer from "@/components/publicPages/Footer.vue";
export default {
  name: "Index",
  components: {
    Navbar,
    Footer
  },
};
</script>