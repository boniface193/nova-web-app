<template>
  <div class="onboarding">
    <div class="onboarding-container">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  name: "Onboarding",
};
</script>
<style lang="scss" scoped>

.onboarding {
  background: #f9fafe;
  height: 100%;
  display: flex;
  align-items: center;
  &-container {
    width: 450px;
    padding: 10px;
    margin: auto;
    background: #fff;
    border-radius: 15px;
  }
}
@media (max-width: 700px) {
  .onboarding {
    &-container {
      width: 100%;
      height: 100%;
      padding-top: 15%;
    }
  }
}
</style>