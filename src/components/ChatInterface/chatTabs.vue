<script>
import { constant } from "../../const";
//图标编码
const show = "&#xe61a;";
const unshow = "&#xe602;";

export default {
  name: "MChatTabs",
  //注入父级属性
  inject: ["rootChat"],
  props: {
    panes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      stickyTop: 0,
      zIndex: 1,
    };
  },
  computed: {
    stickyActive() {
      return this.stickyTop > 0;
    },
  },
  methods: {
    handleScroll(event) {
      this.stickyTop = event.target.scrollTop;
    },
    bindClick(event, data) {
      this.$emit("click", { event, data });
    },
  },
  render(h) {
    let { panes, stickyTop, stickyActive, handleScroll, bindClick } = this;
    // 标签组件生成
    const el_chat_tabs = this._l(panes, (pane, index) => {
      const { active, chat } = pane;
      const { name, id, type, avatar } = chat;

      let tabName = name + id + index;
      pane.index = `${index}`;
      //对话是否激活

      let label = name;

      // let recordImg = pane.recording
      //   ? constant.btnRecording
      //   : constant.btnRecord;

      const tabindex = active ? 0 : -1;

      return (
        <li
          class={{ "im-this": active }}
          id={`tab-${tabName}`}
          key={`tab-${tabName}`}
          on-click={(ev) => {
            bindClick("tabClick", { pane, ev });
          }}
        >
          <img
            src={avatar}
            on-click={(ev) => {
              bindClick("tabClick", { pane, ev });
            }}
          />
          <span> {label}</span>
          <i
            class="im-icon el-icon-error"
            on-click={(ev) => {
              bindClick("tabRemove", { pane, ev });
            }}
          ></i>
        </li>
      );
    });
    //render对icon css的方式不支持只能
    const el_icon = (
      <i
        class={{
          "im-icon": true,
          "btn-pane-show": true,
          "el-icon-arrow-right": true,
          "el-icon-arrow-down": false,
        }}
        on-click={() => {}}
      ></i>
    );

    return (
      <ul
        class={{
          " im-chat-tabs": true,
          "tabs-shadow": false,
        }}
        on-mousedown={(ev) => {}}
        on-scroll={(ev) => {
          handleScroll(ev);
        }}
      >
        <li
          class={{
            "im-tabs-title": true,
            active: true,
          }}
          style={{
            top: stickyTop + "px",
          }}
        >
          <span class="im-box-setwin " on-click={() => {}}>
            <a class="im-btn-min" href="javascript:;">
              <cite></cite>
            </a>
          </span>

          {el_icon}
        </li>
        {el_chat_tabs}
      </ul>
    );
  },
};
</script>