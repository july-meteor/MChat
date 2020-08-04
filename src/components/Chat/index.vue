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
  },
  inject: ["rootChat"],
  props: {
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
    config: {},
  },
  data() {
    return {
      // pane index
      index: null,
      // 聊天记录
      taleList:[],
      //已加载
      loaded: true,
      // 滚动按钮
      scrollToButton: false,
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
        this.msg = this.value;
      },
      immediate: true,
    },
    msg: {
      handler() {
        this.$emit("input", this.msg);
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
    handleEnter(msg) {
      this.$emit("enter", msg);
    },
    // 处理收到的消息
    getMessage(msg){
      this.taleList.push(msg)
    }
  },
  render(h) {
    let { chat,active, taleList, handleEnter } = this;
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
    };

    let data_enter_box = {
      props: {
        value: "",
      },
      on: {
        submit: function (data) {
          handleEnter(data);
        },
      },
    };

    el_chat_footer = (
      <div
        class={{
          "im-chat-footer": true,
          listActive: false,
        }}
      >
        <div class="im-chat-toolbar"></div>
        <enter-box {...data_enter_box}></enter-box>
      </div>
    );

    el_chat = (
      <div class="im-chat-main" id={`chat-${name}`} key={`chat-${name}`}>
        <div
          class={{
            "im-pane-item": true,
            "display": active,
          }}
        >
          {el_chat_titel}
          <chat-list {...data_chat_list}> </chat-list>
          {el_chat_footer}
        </div>
      </div>
    );
    return el_chat;
  },
  created() {},
};
</script>
