<template>
  <div class="KycProfile-container">
    <div class="align-center justify-center">
      <!-- profile section -->
      <div class="profile-holder background mx-auto">
        <p v-show="profileImage == null" class="primary--text mb-0">
          No profile<br />yet
        </p>
        <img :src="profileImage" alt="" v-show="profileImage != null" />
      </div>
    </div>
    <!-- image uploader -->
    <div class="mb-9">
      <p class="mb-1">Upload profile image</p>
      <div class="select-item">
        <imageUploader
          width="100%"
          height="57px"
          caretColor="#029B97"
          :multiple="false"
          :inputStatus="profileError"
          :imageErrorMsg="profileErrorMsg"
          @setImage="setProfileFile"
        />
      </div>
    </div>

    <!-- btn container -->
    <div class="d-flex justify-end mt-5">
      <v-btn
        class="primary px-8"
        @click="submit()"
        >Next</v-btn
      >
    </div>
  </div>
</template>
<script>
import imageUploader from "@/components/secondary/ImageUploader2.vue";
export default {
  name: "KycProfileUplaod",
  components: { imageUploader },
  data: function () {
    return {
      profileFile: null,
      profileError: false,
      profileErrorMsg: "",
      profileImage: null,
    };
  },
  methods: {
    // set url uploaded for profile
    setProfileFile(params) {
      this.profileFile = params;
      this.profileError = false;
      this.readProfile(this.profileFile);
    },
    validateProfile() {
      if (this.profileFile !== null) {
        if (this.profileFile[0].size < 10000000) {
          this.profileError = false;
        } else {
          this.profileError = true;
          this.profileErrorMsg  ="Profile image size must be less than 500kb";
        }
      } else {
        this.profileError = true;
        this.profileErrorMsg = " A profile image is required";
      }
    },
    // submit
    submit() {
      this.validateProfile();
      if (this.profileError == false) {
        this.$emit("setImage", {
          profileImage: this.profileFile,
        });
      }
    },
    // show the profile image
    readProfile(files) {
      let file = files[0];
      this.profileImage = URL.createObjectURL(file);
    },
  },
};
</script>
<style lang="scss" scoped>
.KycProfile-container {
  .profile-holder {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .card-holder {
    width: 300px;
    min-height: 200px;
    max-height: 200px;
    border-radius: 8px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    text-align: center;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.select-item {
  height: 58px;
  position: relative;
}
</style>