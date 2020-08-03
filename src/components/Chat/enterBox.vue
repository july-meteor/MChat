<script>
export default {
  name: "MChat-enter-box",
  componentName: "MChatEnterBox",
  props: {
    placeholder: {
      type: String,
      default: "请输入内容...",
    },
    value: {
      default: "",
    },
  },
  data() {
    return {
      content: undefined,
      recording: false,
    };
  },
  methods: {
    // 数据格式往上抛
    handleSend() {
      // if (!this.content || this.content.length < 1) return;
      // const msg = {
      //     username: this.mine.username,
      //     avatar: this.mine.avatar, //头像
      //     channel: this.id, // chat的id // 如果当前chat是私聊则为私聊目标的id
      //     fromid: this.mine.id, //发起人id
      //     type: this.type, //
      //     mine: true, //是不是自己发的
      //     content: this.content , // 内容
      //     timestamp: new Date() //发起的时间戳
      // };
      this.content = undefined;
      this.$emit("submit", msg);
      this.$nextTick(() => {
        this.content = "";
      });
    },
  },
  render(h) {
    let { value, handleSend, content, recording} = this;
    var self = this;

    const textareaVnode = h("textarea", {
      domProps: {
        value: self.content,
      },
      on: {
        input: function (event) {
          self.content = event.target.value;
        },
        keydown: function (ev) {
          let keyCode = ev.keyCode;
          let ctrlKey = ev.ctrlKey;
          //  if(ctrlKey && keyCode === 13){
          //   self.sendMessage();
          //  }
          if (keyCode === 13) {
            if (ctrlKey) {
              self.content += "\n";
            } else {
              ev.preventDefault();
              handleSend();
            }
          }
        },
      },
    });

    let el_enter_box = (
      <div>
        <div class="im-chat-textarea">{textareaVnode}</div>
        <div class="im-chat-bottom">
          <div class="im-chat-btn-bar">
            <span
              on-click={(event) => {
                // channelClose(null, id, type, event);
              }}
            >
              关闭
            </span>
            <span
              on-click={(ev) => {
                // channelRecord(null, recording, ev);
              }}
              style={{ "background-color": recording ? "red" : "" }}
            >
              PTT
           
            </span>
            <span
              class="im-btn-send"
              on-click={() => {
                handleSend();
              }}
            >
              发送
            </span>
            <span class="im-send-set">
              <em class="icon-edge"></em>
            </span>
            <ul class="im-menu-box">
              <li class="im-this">
                <i class="im-icon el-icon-check"></i>
                按Enter键发送消息
              </li>
              <li>
                <i class="im-icon el-icon-check"></i>按Ctrl+Enter键发送消息
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
    return el_enter_box;
  },
};
</script>