<template>
  <div class="basic-filter">
    <!-- filter btn -->
    <div @click="filterActive = !filterActive">
      <FilterIcon :toolTipText="toolTipText" />
    </div>

    <div class="basic-filter-content" v-show="filterActive">
      <div class="header white--text px-4">
        <p class="pa-0 ma-0">
          <v-icon class="mr-3 white--text">mdi-tune</v-icon>{{ headerName }}
        </p>
        <v-icon class="white--text close-filter" @click="filterActive = false"
          >mdi-close</v-icon
        >
      </div>
      <div class="content">
        <!-- Price filter -->
        <div class="filter" ref="priceFilter" v-if="price === true">
          <div
            class="filter-item px-4 py-2 d-flex align-center justify-space-between"
            @click="toggleFilterItem('priceFilter')"
          >
            Price (&#8358;)
            <span><v-icon color="#5064cc">mdi-chevron-right</v-icon></span>
          </div>
          <div class="py-2 px-4">
            <multipleRange
              :minNum="numberRange.minNum"
              :maxNum="numberRange.maxNum"
              @minMaxNumber="setPriceRange"
              ref="priceRange"
            />
          </div>
        </div>
        <div class="d-flex justify-end px-4 mb-2 mt-2">
          <!-- reset filter btn -->
          <v-btn
            class="px-4 py-2 mr-2 primary--text"
            @click="resetFilter"
            style="background: #5064cc26"
            >Reset</v-btn
          >
          <!-- apply filter btn -->
          <v-btn class="primary px-4 py-2" @click="filterItems">Apply</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import multipleRange from "@/components/general/multipleRange";
import FilterIcon from "@/components/general/FilterIcon.vue";
export default {
  name: "BasicFilter",
  components: {
    multipleRange,
    FilterIcon,
  },
  props: ["headerName", "price", "toolTipText"],
  data: function () {
    return {
      filterActive: false,
      minPrice: 0,
      maxPrice: 0,
    };
  },
  computed: {
    numberRange() {
      return {
        maxNum: 1000000000,
        minNum: 0,
      };
    },
  },
  methods: {
    setPriceRange(params) {
      this.minPrice = params.minNum;
      this.maxPrice = params.maxNum;
    },
    toggleFilterItem(refName) {
      this.$refs[`${refName}`].classList.toggle("filter--active");
    },
    filterItems() {
      this.$emit("filterOption", {
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      });
      this.filterActive = false;
    },
    resetFilter() {
      this.$emit("resetFilter");
      this.filterActive = false;
      this.$refs.priceRange.resetRange();
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-filter {
  position: relative;
  .basic-filter-content {
    width: 300px;
    border-radius: 8px;
    position: absolute;
    z-index: 5;
    box-shadow: 0px 10px 30px #6e6e6e29;
    right: 0px;
    margin-top: 10px;
    .header {
      height: 40px;
      background: #5064cc;
      width: 100%;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .close-filter {
        cursor: pointer;
      }
    }
    .content {
      background: #ffffff;
      border-bottom-right-radius: 8px;
      border-bottom-left-radius: 8px;
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
      .filter {
        border-bottom: 1px solid #e2e2e2;
        position: relative;
        overflow-y: hidden;
        height: 40px;
        transition: 0.5s ease;
        &-item {
          cursor: pointer;
          &:hover {
            background: #f9f9f9;
          }
          &:last-child {
            border: none !important;
          }
          span {
            transition: 0.5s ease;
          }
        }
        &--active {
          height: auto;
          .filter-item {
            span {
              transform: rotate(90deg);
            }
          }
        }
      }
    }
  }
}
@media (max-width: 900px) {
  .basic-filter {
    .basic-filter-content {
      width: 300px;
      left: 0;
      right: 0;
      margin: 10px auto;
    }
  }
}
</style>