<template>
  <div
    class="layui-layer layui-layer-page layui-box layui-layim-min layer-anim-02"
    style="z-index: 19891020; top: 94%;left: 50%;height: 55px;"
  >
    <div id class="layui-layer-content">
      <img
        :src="!chat.mike ? btnImg.btnRecord : btnImg.btnRecording"
        @click="callRecording(null, chat.mike)"
      />
      <span  class="contextMax">{{ msgContext }}</span>
    </div>
    <span class="layui-layer-setwin">
      <a
        class="layui-layer-ico layui-layer-max"
        href="javascript:;"
        @click="callChatMin"
      ></a>
    </span>
  </div>
</template>
<script>

import {constant} from "../../const";
function noop() {}

export default {
  name: "ChatMin",
  props: {
    chat:{},
    msgContext: {
      type: String,
      default: "加载中……"
    },
    callRecording: {
      type: Function,
      default: noop
    },
    callChatMin: {
      type: Function,
      default: noop
    }
  },
  computed: {
    contextMax(){
      return this.msgContext.length >8 ?true :false;
    }
  },
  data() {
    return {
      btnImg: {
        btnRecord: constant.btnRecord,
        btnRecording: constant.btnRecording
      }
    };
  },
  methods: {}
};
</script>
<style>
.contextMax {
   min-width: 50px;
   width: auto !important;
   padding-right: 15px;
   margin-right: 11px;
}


</style>