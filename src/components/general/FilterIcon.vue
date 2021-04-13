<template>
  <!-- filter btn -->
  <div class="filter-btn">
    <v-icon class="white--text">mdi-tune</v-icon>
    <span class="tooltiptext">{{ toolTipText }}</span>
  </div>
</template>
<script>
export default {
  name: "FilterIcon",
  props: ["toolTipText"],
};
</script>
<style lang="scss" scoped>
.filter-btn {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #5064cc;
  .tooltiptext {
    color: #5064cc;
    background-color: rgb(239, 245, 255);
    width: 120px;
    text-align: center;
    border-radius: 3px;
    padding: 5px;
    top: 45px;
    position: absolute;
    z-index: 2;
    display: none;
  }
  &:hover .tooltiptext {
    display: block;
  }
}
</style>