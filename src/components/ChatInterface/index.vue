<script>
import { constant } from "../../const";
import MChatTabs from "./chatTabs";

let btnRecord = constant.btnRecord;
let btnRecording = constant.btnRecording;

const msgJAson = {
  username: "测试1",
  avatar: undefined,
  id: 1,
  fromid: -1,
  type: undefined, //
  mine: false,
  content: "ccccc",
  timestamp: "2019-12-14 23:38:44",
};

export default {
  name: "MChat-index",
  components: {
    MChatTabs,
  },
  provide() {
    return {
      rootChat: this,
    };
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        img: "image/cover.png",
        name: "MChat",
        dept: "Meteor chat",
        callback: () => {},
      }),
    },
    list: {
      type: Array,
      default: () => [],
    },
    value: {
      default: "",
    },
  },
  data() {
    return {
      panes: [],
      msg: "",
      selected:'0',
    };
  },

  methods: {
    handleEnter(msg) {
      this.$emit("enter", msg);
    },
    handPanesDrag(e) {
      let el = this.$refs.chat;
      var oDiv = el;
      var disX = e.clientX - oDiv.offsetLeft;
      var disY = e.clientY - oDiv.offsetTop;
      document.onmousemove = function (e) {
        e.preventDefault();
        var l = e.clientX - disX;
        var t = e.clientY - disY;
        oDiv.style.left = l + "px";
        oDiv.style.top = t + "px";
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    //生成panes的数据
    calcPaneInstances(isForceUpdate = false) {
      //绕了一圈最终决定由chat-box 来决定 chat-tabs的属性
      if (this.$children) {
        const childPanes = this.$children.filter(
          (item) =>
            item.$vnode.tag &&
            item.$vnode.componentOptions &&
            item.$vnode.componentOptions.Ctor.options.name === "MChat"
        );
        // update indeed
        const panes = childPanes.map((item) => item.$vnode.componentInstance);
        const panesChanged = !(
          panes.length === this.panes.length &&
          panes.every((pane, index) => pane === this.panes[index])
        );
        if (isForceUpdate || panesChanged) {
          this.selected = '0'
          this.panes = panes;
        }
      } else if (this.panes.length !== 0) {
        this.panes = [];
      }
    },
  },
  render(h) {
    let { handPanesDrag, list ,panes} = this;
 
    // 窗口页面
    const el_chat_panes = this._l(list, (channle, index) => {
      let lazy = true;
      let data_chat = {
        props: {
          id: channle.id,
          name: channle.name,
          label: channle.name,
          type: channle.type,
        },
        ref: "MChat",
      };
      return <m-chat {...data_chat}></m-chat>;
    });
    // 标签页面
    const el_chat_tabs = {
      props:{
        panes,
      },
         ref: "MChatTabs"
    }




    return (
      <div>
        <div
          class={{
            "im-layer  layer-anim im-box im-chat": true,
            "chat-show": true,
          }}
          ref="chat"
          style={{
            "z-index": 1002,
            left: "296.5px",
            display: "inline",
          }}
        >
          <div
            class="im-layer-title"
            style="cursor: move;"
            on-mousedown={(ev) => {
              handPanesDrag(ev);
            }}
          ></div>
          <div class="im-layer-tabs im-layer-content">
            <m-chat-tabs {...el_chat_tabs}></m-chat-tabs>
          {el_chat_panes}</div>
          <span class="im-box-setwin">
            <a class="im-btn-min" href="javascript:;">
              <cite></cite>
            </a>
            <a class="im-ico im-icon-max" href="javascript:;"></a>
            <a class="im-ico im-icon-close" href="javascript:;"></a>
          </span>
          <span class="im-icon-resize"></span>
        </div>
      </div>
    );
  },
  created() {
        // this.chatInitializaiton();
  },
  mounted() {
       this.calcPaneInstances();
  },
  updated() {
       this.calcPaneInstances();
  },
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

