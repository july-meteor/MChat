<script>
/**
 *  聊天的主体采用  rander 方式渲染
 */
import { constant } from '../../const';
// 聊天内容框
import chatList from "./chatList";
import enterBox from "./enterBox";


// 频道模型
const default_channel = {
  // 频道名称
  name: undefined,
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
  props: {
    // 聊天记录
    taleList: {
      type: Array,
      default: () => [],
    },
    channle: {
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
      //已加载
      loaded: true,
      // 滚动按钮
      scrollToButton: false,
      channle_name:'测试'
    };
  },
  computed: {
    // 是否被激活
    active() {
      return true;
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
  },
  render(h) {
    let {  channle, taleList, handleEnter } = this;
    // let { channle_name , type, img } = channle;

  let   channle_name ='11'
    let el_chat_titel, data_chat_list, el_chat_footer, el_chat_tool;
    // 标题栏
    el_chat_titel = (
      <div class=" im-chat-title">
        <div class="im-chat-info" title="编辑群组">
          <img src={constant.avatar_terminal} on-click={(ev) => {}} />
          <span class="im-chat-username">{channle_name}</span>
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
    const chatBoxContext = (
      <div
        class="im-chat-main"
        id={`chat-${channle_name}`}
        key={`chat-${channle_name}`}
      >
        <div
          class={{
            "im-pane-item": true,
            'show': true,
          }}
        >
          {el_chat_titel}
          <chat-list {...data_chat_list}> </chat-list>
          {el_chat_footer}
        </div>
      </div>
    );
    return chatBoxContext;
  },
  created() {},
};
</script>
