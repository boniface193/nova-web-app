<template>
  <div>
    <input
      type="file"
      style="display: none"
      ref="imageInput"
      accept="image/x-png,image/jpeg"
      :multiple="multiple"
      @change="onImagePicked"
    />

    <div
      class="fileUploader"
      :style="{ width: width, height: height }"
      :class="{ errorStatus: inputStatus }"
      @click="pickImageFromUserFile()"
    >
      <div
        class="fileUploader-content d-flex align-center justify-space-between"
      >
        <span
          class="selected-color"
          style="height: 25px; overflow: hidden; word-break: break-all"
          >{{ imageName }}</span
        >
        <span
          ><v-icon :color="caretColor" class="caret"
            >mdi-chevron-down</v-icon
          ></span
        >
      </div>
    </div>
    <!-- error message -->
    <div v-show="inputStatus" class="error--text inputError">
      {{ imageErrorMsg }}
    </div>
  </div>
</template>
<script>
export default {
  name: "imageUploader2",
  props: [
    "width",
    "height",
    "caretColor",
    "multiple",
    "imageErrorMsg",
    "inputStatus",
  ],
  data: function () {
    return {
      imageName: "Select image",
      numberOfImage: 0,
    };
  },
  methods: {
    minimizeModal() {},
    pickImageFromUserFile() {
      this.$refs.imageInput.click();
    },
    onImagePicked(event) {
      const files = event.target.files;
      this.imageName = files[0].name;
      this.$emit("setImage", files);
    },
  },
};
</script>
<style lang="scss" scoped>
.fileUploader {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  padding: 0px 12px;
  outline: none;
  position: relative;
  z-index: 3;
  &:hover {
    border-color: rgba(0, 0, 0, 0.87);
  }
  .custom-placeholder {
    color: rgba(0, 0, 0, 0.38);
  }
  .selected-color {
    color: rgba(0, 0, 0, 0.87);
  }
  .caret {
    font-size: 30px;
  }
  &-content {
    height: 100%;
  }
}
.focus {
  border: 2px solid #029b97;
  &:hover {
    border-color: #029b97;
  }
}
.errorStatus {
  border: 2px solid #e62222 !important;
  &:hover {
    border-color: #e62222 !important;
  }
}
.inputError {
  line-height: 12px;
  word-break: break-word;
  word-wrap: break-word;
  font-size: 12px;
  padding-left: 12px;
  margin-top: 8px;
}
</style>