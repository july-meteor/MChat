<script>
import { unwatchFile } from 'fs';
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
      currentContent: '',
    };
  },
  watch: {
    value: {
      handler() {
        this.currentContent = this.value;
      },
      immediate: true,
    },
    currentContent: {
      handler(newval) {
        const msg = newval;
        this.$emit("input", msg);
      },
      immediate: true,
    },
  },
  created(){

  },
  methods: {
    // 数据格式往上抛
    handleSend() {
      if (!this.currentContent) return;
      this.$emit("submit", this.currentContent);
      this.$nextTick(() => {
        this.currentContent = "";
      });
    },
  },
  render(h) {
    let { value, handleSend, currentContent, placeholder, recording } = this;
    var self = this;
    const textareaVnode = h("textarea", {
      domProps: {
        value: self.currentContent,
        placeholder,
      },
      on: {
        input: function (event) {
          self.currentContent = event.target.value;
        },
        keydown: function (ev) {
          let keyCode = ev.keyCode;
          let ctrlKey = ev.ctrlKey;
          //  if(ctrlKey && keyCode === 13){
          //   self.sendMessage();
          //  }
          if (keyCode === 13) {
            if (ctrlKey) {
              self.currentContent += "\n";
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