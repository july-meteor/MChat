<script>
/**
 *  聊天的主体采用  rander 方式渲染
 *  带有业务耦合问题
 *  该页面是chat主页面 需要自己维护聊天信息
 */
import { constant } from "../../const";
// 聊天内容框
import chatList from "./chatList";
import enterBox from "./enterBox";
import tools from "./tools";

// 频道模型
const default_chat = {
  // 频道名称
  name: "在线客服二", //名称
  type: "friend", //聊天类型
  avatar: "http://tp1.sinaimg.cn/5619439268/180/40030060651/1", //头像
  id: -2, //定义唯一的id方便你处理信息
};

// 空方法
function noop() {}
export default {
  name: "MChat",
  componentName: "MChat",
  components: {
    chatList,
    enterBox,
    tools,
  },
  inject: ["rootChat"],
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    chat: {
      type: Object,
      default: () => {},
    },
    // 工具栏配置
    toolConfig: {
      type: Object,
      default: () => ({
        show: ["file", "video", "img"],
        callback: Function,
      }),
    },
    height: {
      default: "500px",
    },
    width: {
      default: "550px",
    },
    //  输入属性 预留给上层模块
    value: {
      default: "",
    },
  },
  data() {
    return {
      // pane index
      index: null,
      // 聊天记录
      taleList: [],
      //已加载
      loaded: true,
      // 滚动按钮
      scrollToButton: false,
      // 未读
      unread: 0,
      content: "",
      rightBox: true,
    };
  },
  computed: {
    // 是否被激活
    active() {
      const active = this.rootChat.selected === this.index;
      if (active) {
        this.loaded = true;
      }
      return active;
    },
  },
  watch: {
    // 滚动
    scroll(newVal) {
      if (typeof newVal === "number") {
        this.setScroll(newVal);
      }
    },
    value: {
      handler() {
        this.content = this.value;
      },
      immediate: true,
    },
    content: {
      handler() {
        this.$emit("input", this.content);
      },
      immediate: true,
    },
    scrollToButton(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.scrollToButton = false;
        }, 0);
      }
    },
  },

  methods: {
    handleRighBox() {
      this.rightBox = !this.rightBox;
    },
    // 拉取历史记录
    loadHistory() {
      let that = this;
      //
      this.$emit("loadHistory", function (list) {
        list.forEach((item) => {
          that.taleList.unshift(item);
        });
      });
    },
    handleEnter(message) {
      this.$emit("enter", message);
    },
    // 处理收到的消息
    getMessage(message) {
      this.taleList.push(message);
    },
    bindEmoji(emoji) {
      this.content += emoji;
    },
    handleUnread(count) {
      if (this.active) {
        this.unread = 0;
      } else {
        this.unread = count;
      }
    },
  },
  mounted() {},
  updated() {},
  render(h) {
    let {
      rootChat,
      chat,
      config,
      active,
      taleList,
      rightBox,
      handleRighBox,
      bindEmoji,
      handleEnter,
      handleUnread,
      loadHistory,
    } = this;
    let { name, type, avatar, id } = chat;

    let el_chat, el_chat_titel, data_chat_list, el_chat_footer, el_chat_tool;
    // 标题栏
    el_chat_titel = (
      <div class=" im-chat-title">
        <div class="im-chat-info" title="编辑群组">
          <img src={avatar} on-click={(ev) => {}} />
          <span class="im-chat-username">{name}</span>
          <p class="im-chat-group">
            <span>群组</span>
          </p>
        </div>
      </div>
    );
    // chat list  的数据
    data_chat_list = {
      props: {
        list: taleList,
      },
      ref: "chatList",
      on: {
        messageUnread: function (count) {
          handleUnread(count);
        },
        loadHistory: function () {
          loadHistory();
        },
      },
    };
    var self = this;
    let data_tools_bar = {
      props: {
        config,
      },
      on: {
        emoji: function (emoji) {
          bindEmoji(emoji);
        },
      },
    };

    let data_enter_box = {
      props: {
        value: self.content,
      },
      on: {
        input: function (value) {
          self.content = value;
        },
        submit: function (data) {
          handleEnter(data);
        },
      },
    };

    el_chat_footer = (
      <div
        class={{
          "im-chat-footer": true,
          listActive: rightBox,
        }}
      >
        <tools {...data_tools_bar}></tools>
        <enter-box {...data_enter_box}></enter-box>
      </div>
    );

    // const data_chat_right_box = {
    //   props: {
    //     display: rightBox,
    //   },
    // };
  
  const el_right_box_slot = h('div', rootChat.$slots.default)

    // 挂载到该目标上
    const el_chat_right_box = (
       <div
        class={{
          "im-chat-right-box": true,
          display: rightBox,
        }}
      >
      {el_right_box_slot}

         </div>
    );

    el_chat = (
      <div class="im-chat-main" id={`chat-${name}`} key={`chat-${name}`}>
        <div
          class={{
            "im-pane-item": true,
            display: active,
          }}
        >
          {el_chat_right_box}
          {el_chat_titel}
          <chat-list {...data_chat_list}> </chat-list>
          {el_chat_footer}
          <span
            class={{
              "im-chat-btn-expand": true,
              close: rightBox,
            }}
            on-click={(ev) => handleRighBox()}
          >
            <i
              class={{
                "im-icon": true,
                "el-icon-arrow-left": !rightBox,
                "el-icon-arrow-right": rightBox,
              }}
            ></i>
          </span>
        </div>
      </div>
    );
    return el_chat;
  },
  created() {},
};
</script>
