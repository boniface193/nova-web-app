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

    <div @click="openImageModal" style="height: 70px">
      <!-- <label for="" class="text-field">Upload product pictures</label> -->
      <v-card class="text-center pa-4" link outlined width="70">
        <v-icon color="primary">mdi-plus-circle</v-icon>
      </v-card>
    </div>

    <!-- dialog for upload -->
    <Modal :dialog="dialog" width="650">
      <div class="white pa-3 pb-10 dialog">
        <div class="d-flex justify-end">
          <v-icon class="secondary--text close-btn mr-2" @click="minimizeModal"
            >mdi-minus</v-icon
          >
          <v-icon class="error--text close-btn" @click="cancelModal"
            >mdi-close</v-icon
          >
        </div>

        <div class="px-4 px-sm-7">
          <h4 class="secondary--text mt-5 mb-2">Upload Product Image</h4>
          <p
            class="mb-0 error--text"
            style="font-size: 14px"
            v-show="imageError"
            v-html="imageErrorMsg"
          ></p>
          <!-- upload image -->
          <div class="upload-container" v-if="status === 'upload'">
            <div class="upload-content" @click="pickImageFromUserFile">
              <span class="image-uploader">
                <img src="@/assets/icons/upload.svg" alt="" />
                <span color="#979797" v-show="imageNames.length == 0"
                  >Upload Image</span
                >
                <span
                  color="#979797"
                  style="min-width: fit-content"
                  v-show="imageNames.length > 0"
                  v-for="(image, index) in imageNames"
                  :key="index"
                  >{{ image.name }},
                </span>
              </span>
            </div>
            <v-btn
              class="px-6 upload-btn white--text primary"
              height="45"
              :disabled="numberOfImage == 0"
              @click="upload()"
            >
              Upload
            </v-btn>
          </div>
          <div
            class="uploading-container"
            :class="{ 'uploading-completed': status === 'uploaded' }"
            v-if="status === 'uploading' || status === 'uploaded'"
          >
            <span class="white--text" v-if="status === 'uploading'"
              >Uploading...</span
            >
            <span v-if="status === 'uploaded'">
              <!-- <img class="mr-4" src="@/assets/img/upload.svg" alt="" /> -->
              <v-icon class="white--text mr-2">mdi-check</v-icon>
              <span class="white--text">Upload Complete</span>
            </span>
            <div class="progress-bar" v-if="status === 'uploading'">
              <progressBar
                :width="uploadProgress"
                height="5px"
                bgColor="transparent"
                borderRadius="5px"
                progressColor="#FFA500"
              />
            </div>
          </div>

          <h4 class="error--text" v-show="numberOfImage === 0">
            No image selected yet!
          </h4>
          <h4 class="primary--text" v-show="numberOfImage !== 0">
            {{ numberOfImage }}
            {{ numberOfImage > 1 ? "images" : "image" }} selected
          </h4>
          <p class="primary--text mb-0">
            <span class="accent--text">NB:</span> maximum of 2MB is allowed
          </p>
        </div>
      </div>
    </Modal>

    <!-- dialog for image selection -->
    <Modal :dialog="imagesDialog" width="650">
      <div class="white pa-3 pb-5 dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="imagesDialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div v-show="!fetchingImages">
          <!-- btn container -->
          <div class="d-flex justify-space-between align-center my-5">
            <!-- description -->
            <p class="mt-5 mr-5 pb-0">Select image from recent uploads</p>
            <v-btn class="primary py-1 px-3" @click="pickImageFromUserFile()"
              >Upload</v-btn
            >
          </div>
          <div class="images-container">
            <div
              class="image mr-3 mb-3"
              v-for="(image, index) in recentImages"
              :key="index"
              @click="selectImage(image.url)"
            >
              <img :src="image.url" alt="" />
            </div>
          </div>
          <!-- pagination -->
          <div class="d-flex justify-space-between align-center flex-wrap">
            <div class="d-flex justify-space-between align-center flex-wrap">
              <p class="mb-2 mr-5">
                Page {{ pageDetails.parameters.current_page }} of
                {{ pageDetails.parameters.last_page }}
              </p>
            </div>
            <div class="pagination mb-2">
              <v-pagination
                v-model="pageDetails.parameters.current_page"
                :length="pageDetails.parameters.last_page"
                @input="getImages"
                circle
              ></v-pagination>
            </div>
          </div>
        </div>
        <div class="text-center py-7" v-show="fetchingImages">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
    </Modal>

    <!-- Modal for error messages -->
    <Modal :dialog="errorDialog" width="400">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="errorDialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div class="mb-7 mt-5 mx-auto status-img">
          <v-img :src="statusImage"></v-img>
        </div>

        <h4>{{ dialogMessage }}</h4>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/secondary/Modal.vue";
import progressBar from "@/components/primary/ProgressBar.vue";
import failedImage from "@/assets/images/failed-img.svg";
import mediaServiceHttpClient from "@/services/media.service.js";
export default {
  name: "imageUploader",
  components: { Modal, progressBar },
  props: ["width", "height", "caretColor", "multiple"],
  data: function () {
    return {
      imageName: "Select image",
      status: "upload",
      uploadProgress: "0%",
      dialog: false,
      imagesDialog: false,
      imageNames: [],
      recentImages: [],
      fetchingImages: false,
      numberOfImage: 0,
      inputError: false,
      errorDialog: false,
      dialogMessage: "",
      statusImage: null,
      imageErrorMsg: "",
      imageError: false,
    };
  },
  computed: {
    pageDetails() {
      return {
        parameters: {
          current_page: 1,
          from: 1,
          last_page: null,
          per_page: 15,
          to: 15,
          total: null,
        },
      };
    },
  },
  methods: {
    cancelModal() {
      this.dialog = false;
    },
    minimizeModal() {},
    openImageModal() {
      this.status = "upload";
      this.fetchingImages = true;
      this.imagesDialog = true;
      this.getImages();
    },
    setError() {
      this.inputError = true;
    },
    pickImage() {
      this.dialog = false;
      this.imagesDialog = true;
    },
    pickImageFromUserFile() {
      this.imagesDialog = false;
      this.dialog = true;
      this.$refs.imageInput.click();
    },
    onImagePicked(event) {
      const files = event.target.files;
      this.imageNames = files;
      this.numberOfImage = this.imageNames.length;
    },
    selectImage(url) {
      this.imagesDialog = false;
      this.inputError = false;
      this.imageName = url;
      this.$emit("images", { imageUrl: url, error: this.inputError });
    },
    upload() {
      if (this.imageNames !== null) {
        const formData = new FormData();
        if (this.imageNames[0].size < 2242880) {
          formData.set("image", this.imageNames[0]);
          this.uploadImage(formData);
          this.imageError = false;
        } else {
          this.imageError = true;
          this.imageErrorMsg =
            "Image size too large, kindly compress <a class='primary--text' target='_blank' href='https://compressjpeg.com/'>here</a> and re-upload";
        }
      }
    },
    uploadImage(data) {
      this.status = "uploading";
      mediaServiceHttpClient
        .post("/media/upload", data, {
          onUploadProgress: (uploadEvent) => {
            this.uploadProgress = String(
              Math.round((uploadEvent.loaded / uploadEvent.total) * 100) + "%"
            );
          },
        })
        .then(() => {
          this.status = "uploaded";
          this.uploadProgress = "0%";
          this.inputError = false;
          this.imageError = false;
          setTimeout(() => {
            this.dialog = false;
            this.openImageModal();
          }, 1000);
        })
        .catch((error) => {
          this.status = "upload";
          this.imageError = true;
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.imageErrorMsg = error.response.message;
          }
        });
    },
    getImages() {
      mediaServiceHttpClient
        .get(`/media?page=${this.pageDetails.parameters.current_page}`)
        .then((response) => {
          this.errorDialog = false;
          this.recentImages = response.data.data;
          this.fetchingImages = false;
          this.pageDetails.parameters = response.data.meta;
        })
        .catch(() => {
          this.errorDialog = true;
          this.imagesDialog = false;
          this.statusImage = failedImage;
          this.dialog = false;
        });
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
  border: 2px solid #5064cc;
  &:hover {
    border-color: #5064cc;
  }
}
.errorStatus {
  border: 2px solid #e62222 !important;
  &:hover {
    border-color: #e62222 !important;
  }
}
.close-btn {
  cursor: pointer;
}

.upload-container {
  width: 100%;
  height: 55px;
  border: 1px solid #d3d9de;
  border-radius: 5px;
  margin: 0px 0px 20px 0px;
  display: flex;
  align-items: center;
  padding: 5px;
  position: relative;
  .upload-content {
    padding-left: 20px;
    margin: 0px 5px;
    width: 81%;
    overflow: hidden;
    cursor: pointer;
    .image-uploader {
      overflow: hidden;
      display: flex;
      img {
        margin-right: 15px;
      }
    }
  }
}
.uploading-container {
  width: 100%;
  height: 55px;
  border-radius: 5px;
  background: var(--v-primary-base);
  margin: 0px 0px 20px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .progress-bar {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 5px;
    overflow: hidden;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
}
.uploading-completed {
  background: var(--v-accent-base) !important;
}
.images-container {
  display: flex;
  flex-wrap: wrap;
  .image {
    width: 120px;
    height: 120px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    cursor: pointer;
    &:hover {
      transform: scale(1.01);
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.pagination {
  max-width: 250px;
}
@media (max-width: 550px) {
  .upload-container {
    display: grid;
    height: 100px;
    .upload-content {
      padding: 0px 10px;
      margin: 0px;
      width: 100%;
      .image-uploader {
        margin: 7px 0px 10px 0px;
      }
    }
  }
}
</style>