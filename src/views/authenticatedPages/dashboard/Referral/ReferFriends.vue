/* eslint-disable prettier/prettier */
<template>
  <div class="refer-friends-container">
    <h3 class="mb-6">
      Referral ID: <span class="primary--text">{{ user.id }}</span>
    </h3>
    <!-- refer step 1 -->
    <div class="refer-friends-container__item">
      <div class="refer-friends-container__item__number">1</div>
      <div>
        <h3 style="font-weight: normal">Invite your friends to Kuuzza</h3>
        <p class="refer-friends-container__item__extra">
          It’s as easy as sharing the link below
        </p>
      </div>
    </div>
    <!-- refer step 2 -->
    <div class="refer-friends-container__item">
      <div class="refer-friends-container__item__number">2</div>
      <div>
        <h3 style="font-weight: normal">They join Kuuzza</h3>
        <p class="refer-friends-container__item__extra">
          They sign up using your unique link
        </p>
      </div>
    </div>
    <!-- refer step 3 -->
    <div class="refer-friends-container__item">
      <div class="refer-friends-container__item__number">3</div>
      <div>
        <h3 style="font-weight: normal">You earn!</h3>
        <p class="refer-friends-container__item__extra">
          You earn a commission for every sale they make on Kuuzza!
        </p>
      </div>
    </div>
    <!-- referral link -->
    <div class="refer-friends-container__link py-3 px-2">
      <img src="@/assets/icons/link.svg" alt="" />
      <span
        style="cursor: pointer; height: 25px; overflow: hidden"
        v-clipboard:copy="referralLink.link"
        @click="showCopyStatus"
        >{{ referralLink.link }}</span
      >
      <span style="position: relative">
        <v-icon
          class="ml-5 copy-btn"
          v-clipboard:copy="referralLink.link"
          @click="showCopyStatus"
          >mdi-content-copy</v-icon
        >
        <span v-show="copyStatus" class="copy-status primary--text py-1 px-2"
          >Copied</span
        >
      </span>
    </div>
    <v-btn class="primary mt-2" @click="shareDialog = true"
      >Share referral link with friends</v-btn
    >
    <!-- Modal for dialog messages -->
    <Modal :dialog="shareDialog" width="250">
      <div class="white pa-3 pb-5 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="shareDialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div class="d-flex align-center justify-space-between px-8">
          <whats-app
            class="mt-3 mr-3"
            :url="referralLink.link"
            :title="`Referral link`"
            scale="2"
          ></whats-app>
          <twitter
            class="mt-3 mr-3"
            :url="referralLink.link"
            :title="`Referral link`"
            scale="2"
          ></twitter>
          <facebook
            class="mt-3 mr-3"
            :url="referralLink.link"
            scale="2"
            :title="`Referral link`"
          ></facebook>
        </div>
        <p class="mt-4 mb-0 secondary--text">
          Share referral link with friends
        </p>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Modal from "@/components/secondary/Modal.vue";
import { Facebook } from "vue-socialmedia-share";
import { Twitter } from "vue-socialmedia-share";
import { WhatsApp } from "vue-socialmedia-share";
export default {
  name: "ReferFriends",
  components: { Modal, Facebook, Twitter, WhatsApp },
  data: function() {
    return {
      copyStatus: false,
      shareDialog: false
    };
  },
  computed: {
    ...mapGetters({
      user: "settings/profile"
    }),
    referralLink() {
      return {
        link: `${window.location.origin}/signup?referral_id=${this.user.id}`
      };
    }
  },
  methods: {
    showCopyStatus() {
      this.copyStatus = true;
      setTimeout(() => {
        this.copyStatus = false;
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.refer-friends-container {
  &__item {
    display: flex;
    margin-bottom: 20px;
    &__number {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 2px;
      padding-left: 1px;
      margin-right: 15px;
      color: var(--v-primary-base);
    }
    &__extra {
      color: #979797;
    }
  }
  &__link {
    background: white;
    color: #029b97;
    text-align: center;
    border-radius: 12px;
    border: 1px solid var(--v-primary-base);
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-all;
    width: 450px;
    img {
      margin-right: 10px;
    }
    .copy-btn {
      cursor: pointer;
      &:hover {
        color: #03a09b;
      }
    }
    .copy-status {
      position: absolute;
      bottom: 100%;
      background: #e0e7ff;
      word-break: none;
      width: 90px;
      right: 0;
      border-radius: 8px;
    }
  }
}
@media (max-width: 500px) {
  .refer-friends-container {
    &__link {
      width: 100%;
    }
  }
}
</style>
