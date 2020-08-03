<script>
import { mapGetters, mapActions } from "vuex";
import { controlConst } from "../../const";

import ChatTabs from "./chat-tabs";
import ChatMin from "./chat-min";
import ChatBox from "./chat-box";

const msgJAson = {
  username: "测试1",
  avatar: undefined,
  id: 1,
  fromid: -1,
  type: undefined, //
  mine: false,
  content: "ccccc",
  timestamp: "2019-12-14 23:38:44"
};

/**
 *  readme
 *  整个im的control
 *  1. 协调内部方法
 *  2. 提供对外的方法监听
 *  3. 数据闭源
 *  事件中心 @see
 *  业务中心 @see
 *
 */
export default {
  name: "m-chat",
  components: {
    ChatTabs,
    ChatMin,
    ChatBox
  },

  provide() {
    return {
      rootChat: this
    };
  },
  data() {
    return {
      panes: [],
      btnRecord: require("../../../images/btn/btn_record.png"),
      btnRecording: require("../../../images/btn/btn_recording.png")
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["mine", "chat", "channels"]),
    //状态说明
    msgContext() {
      let text = "加载中……";
      return text;
    }
  },
  methods: {
    ...mapActions([
      "miniOrMaxmize",
      "contentShow",
      "channelDel",
      "channelSelected",
      "channelSwitch",
      "sendVoice",
      'onChannleMessag',
      'emitChannleMessage',
      'chatInitializaiton',
    ]),
    /**
     * 聊天会遇到的事件 需要网上层抛
     * */
    handleChannelAdd() {},
    channelRemove(pane, id, type, event) {
      if (this.chat.mike) {
        return;
      }
      this.channelDel(id);
    },
    // 收到消息
    onMessage(msg) {
      for(let temp of msg){
        this.panes.forEach(item => {
            item.getMessage(temp);
          });
      }
    },
    // 发送数据
    handleSendMessage(data) {
      this.emitChannleMessage(data)
  
    },
    handleRecording(pane, status, event) {
      this.sendVoice({ channel: pane, mike: status });
    },
    //内部操作回调 与方法有关
    handleChatMin(pane, evetn) {
      this.miniOrMaxmize();
    },
    handleChatShow() {
      this.contentShow();
    },
    //内部操作 属性相关
    handleTabClick(pane, tabName, event) {
      //判是否能切换
      this.channelSwitch(pane).then(res => {
        this.channelSelected(tabName);
      })
    },
    //窗口拖拽方法
    handPanesDrag(e) {
      let el = this.$refs.chat;
      var oDiv = el;
      var disX = e.clientX - oDiv.offsetLeft;
      var disY = e.clientY - oDiv.offsetTop;
      document.onmousemove = function(e) {
        e.preventDefault();
        var l = e.clientX - disX;
        var t = e.clientY - disY;
        oDiv.style.left = l + "px";
        oDiv.style.top = t + "px";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    //生成panes的数据
    calcPaneInstances(isForceUpdate = false) {
      //绕了一圈最终决定由chat-box 来决定 chat-tabs的属性
      if (this.$children) {
        const childPanes = this.$children.filter(
          item =>
            item.$vnode.tag &&
            item.$vnode.componentOptions &&
            item.$vnode.componentOptions.Ctor.options.name === "ChatBox"
        );
        // update indeed
        const panes = childPanes.map(item => item.$vnode.componentInstance);
        const panesChanged = !(
          panes.length === this.panes.length &&
          panes.every((pane, index) => pane === this.panes[index])
        );
        if (isForceUpdate || panesChanged) {
          this.channelSwitch(panes[0]).then(res => {
            this.channelSelected("0");
          })
          this.panes = panes;
        }
      } else if (this.panes.length !== 0) {
        this.panes = [];
      }
    }
  },
  // 绘制页面
  render(h) {
    let {
      panes,
      channels,
      chat,
      mine,
      msgContext,
      handleTabClick,
      handleChannelAdd,
      handleSendMessage,
      channelRemove,
      handleChatMin,
      handleChatShow,
      handPanesDrag,
      handleRecording
    } = this;


    //如果对话列表没有用户则不显示
    if (channels.list.length < 1) {
      return;
    }
    if(!chat.show){
      return
    }

    //最小化窗口
    const chatMinData = {
      props: {
        chat,
        msgContext: msgContext,
        callRecording: handleRecording,
        callChatMin: handleChatMin
      },
      ref: "ChatMin"
    };
    //
    const chatMinBox = (
      <chat-min
        {...chatMinData}
        style={{ display: chat.min ? "inline" : "none" }}
      ></chat-min>
    );
    //聊天窗口个数
    const chatPanes = this._l(channels.list, (channle, index) => {
      let lazy = true;
      let boxData = {
        props: {
          id: channle.id,
          name: channle.name,
          label: channle.name,
          type: channle.type,
          lazy: lazy,

          channelClose: channelRemove,
          channelRecord: handleRecording,
          emitMessage: handleSendMessage
        },
        ref: "ChatBox"
      };

      return <chat-box {...boxData}></chat-box>;
    });

    const chatTabsData = {
      props: {
        panes,
        chatShow: chat.contentShow,
        callTabClick: handleTabClick,
        callChatshow: handleChatShow,
        callTabRemove: channelRemove,
        callPanesDrag: handPanesDrag,
        callRecording: handleRecording,
        callChatMin: handleChatMin
      },
      ref: "ChatTabs"
    };

    //最外层
    return (
      <div>
        <div
          class={{
            "im-layer  layer-anim im-box im-chat": true,
            "chat-show": chat.contentShow
          }}
          ref="chat"
          style={{
            "z-index": 1002,
            left: "296.5px",
            display: !chat.min ? "inline" : "none"
          }}
        >
          <div
            class="im-layer-title"
            style="cursor: move;"
            on-mousedown={ev => {
              handPanesDrag(ev);
            }}
          >
          </div>
          <div class="im-layer-tabs im-layer-content">
            <chat-tabs {...chatTabsData}></chat-tabs>
            {chatPanes}
          </div>
          <span class="im-box-setwin">
            <a
              class="im-btn-min"
              href="javascript:;"
            >
              <cite></cite>
            </a>
            <a class="im-ico im-icon-max" href="javascript:;"></a>
            <a
              class="im-ico im-icon-close"
              href="javascript:;"
            ></a>
          </span>
          <span class="im-icon-resize"></span>
        </div>
      
      </div>
    );
  },
  created() {
  
    this.onChannleMessag((msg)=>{
        this.onMessage(msg);
    })
    this.chatInitializaiton();

  },
  mounted() {
    this.calcPaneInstances();
  },
  updated() {
    this.calcPaneInstances();
  }
};
</script>

<style scoped>
.chat-show {
  -webkit-box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
  box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
  min-width: 500px;
  width: 800px;
}
</style>
