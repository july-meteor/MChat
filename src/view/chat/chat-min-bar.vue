<template>
  <div class="chat-nav-container" v-if="barShow">
    <div class="left-box">
      <div class="left-item">
        <svg-icon icon-class="group" />
        
      </div>

      <div class="left-item">
        <span class="title">{{chat.channel.name}}</span>
      </div>
    </div>

    <div class="right-box">
      <div class="right-item">
        <span @click="miniOrMaxmize">最大化</span>
      </div>
    </div>

    <div class="content-box">
      <div class="record-btn">
        <img :src="!chat.mike?btnRecord:btnRecording" @click="handlerVoice" />
      </div>
      <div class="record-status">
        <span>{{chat.titleMsg}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { constant } from "../../const";

export default {
  name: "chat-min-bar",
  data() {
    return {
      btnRecord: constant.btnRecord,
      btnRecording: constant.btnRecording,
    };
  },
  computed: {
    ...mapGetters(["singlecall", "chat", "mine"]),
    barShow() {
      let flag = false;
      if (this.chat.min && !this.singlecall.show) {
        flag = true;
      }
      return flag;
    },
  },
  created() {
    this.chatInitializaiton();
  },
  methods: {
    ...mapActions([
      "chatInitializaiton",
      "miniOrMaxmize",
      "miniOrMaxmize",
      "sendVoice",
    ]),
    handlerVoice() {
      this.sendVoice({ mike: this.chat.mike });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.chat-nav-container {
  height: 74px;
  // width: 100%;
  background: #17202f;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  color: #9cafbd;
  .active {
    background: white;
  }

  .left-box {
    float: left;
    // height: 100%;
    padding: 10px;
    margin-left: 50px;
      .left-item {
      display: inline-block;
      padding: 5px;
      text-align: center;
      list-style: none;
      font-size: 19px;
      svg {
        display: inline-block;;
        font-size: 36px;
      }
      .title {
        text-align: center;
        list-style: none;
        font-size: 26px;
        margin-block-start: 0em;
        margin-block-end: 0em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 0px;
        line-height: 22px;
        margin-left: 10px;
      }
    }
  }
  .content-box {
    // margin: 0 auto;
    // width: 500px;
    margin-left: 30%;
    padding: 10px;
    font-size: 19px;
    display: flex;
    div {
      margin: 0 12px;
    }

    .record-btn {
      // padding: 10px;
      img {
        width: 50px;
        height: 6050pxpx;
        border-radius: 100%;
      }
    }
    .record-status {
      padding: 10px;
    }
  }

  .right-box {
    float: right;
    height: 100%;
    padding: 10px;
    margin-right: 20px;
    &:focus {
      outline: none;
    }
    .right-item {
      display: inline-block;
      margin: 0 3px;
      padding: 10px;
      text-align: center;
      list-style: none;
      font-size: 19px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
  }
}
</style>
