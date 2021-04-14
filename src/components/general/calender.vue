<template>
  <div class="text-center">
    <!-- displays calendar filter -->
    <date-range-picker
      v-model="dateRange"
      :opens="opens"
      :minDate="minDate"
      :maxDate="maxDate"
      :autoApply="autoApply"
      :ranges="false"
      :linkedCalendars="linkedCalendars"
      :showWeekNumbers="showWeekNumbers"
      :singleDatePicker="singleDatePicker"
      :alwaysShowCalender="alwaysShowCalender"
      @update="updateValues"
    >
      <template v-slot:input="picker">
        {{ picker.startDate | moment("dddd") }}
        <v-icon>mdi-chevron-down</v-icon>
      </template>
    </date-range-picker>
  </div>
</template> 

<script>
import DateRangePicker from "vue2-daterange-picker";
//you need to import the CSS manually (in case you want to override it)
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

// this is to initialize the date ranges
let today = new Date();

today.setHours(0, 0, 0, 0);
// last 7 days
let lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 13);
// 1 day ago
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

export default {
  name: "calendar",
  components: { DateRangePicker },
  props: {
    minDate: null,
    maxDate: null,
    showWeekNumbers: Boolean,
    linkedCalendars: Boolean,
    singleDatePicker: Boolean,
    showDropdowns: Boolean,
    timePicker: Boolean,
    timePicker24Hour: Boolean,
    autoApply: Boolean,
    alwaysShowCalender: Boolean,
  },
  data() {
    return {
      opens: "left",
      // To specify ranges you need to pass and array where each element is an array with exactly two Date objects (from, to) or their timestamp equivalent.
      ranges: {
        Today: [today, today],
        Yesterday: [yesterday, yesterday],
        "Last 7 days": [lastWeek, today],
        "Last 30 days": [
          new Date(today.getFullYear(), today.getMonth() - 1, 1),
          new Date(today.getFullYear(), today.getMonth(), 0),
        ],
        "This year": [
          new Date(today.getFullYear(), 0, 1),
          new Date(today.getFullYear(), 11, 31),
        ],
      },
      dateRange: {
        startDate: Date.now(),
        endDate: Date.now(),
      },
    };
  },

  methods: {
    updateValues() {
      this.$emit("updateDate", this.dateRange);
    },
  },
};
</script>
<style lang="scss">
.reportrange-text[data-v-00277188] {
  border-radius: 8px !important;
  .fa {
    color: #5064cc !important;
  }
}
.ranges.col-12.col-md-auto {
  width: 20%;
}

.reportrange-text[data-v-2359713c] {
  background: #fff;
  cursor: pointer;
  padding: 0px 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.form-control {
  display: block;
  width: 58px;
  font-size: 8px;
  padding: 0;
  color: #2b2b2b;
  background-color: #f3f5ff;
  background-clip: padding-box;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  border-radius: 5px;
}
.form-control:focus {
  color: #2b2b2b;
  background-color: #fff;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.daterangepicker .drp-calendar.left {
  padding: 8px 0 8px 8px;
  box-shadow: 0 0.5rem 1rem #5e5e5e1a !important;
  border-radius: 12px;
  border: none;
}
.daterangepicker {
  border: none;
  margin-top: 55px;
}
.daterangepicker:after, .daterangepicker:before {
  content: none
}
</style>
