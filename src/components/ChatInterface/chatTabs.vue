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
    },``
  },
  render(h) {
    let { panes, stickyTop, stickyActive, handleScroll } = this;
    // 标签组件生成
    const el_chat_tabs = this._l(panes, (pane, index) => {
      let tabName = pane.name + pane.index + index;
      pane.index = `${index}`;
      //对话是否激活
      let active = pane.active;
      let label = pane.name;

      let type = pane.type;
      let recordImg = pane.recording
        ? constant.btnRecording
        : constant.btnRecord;

      const tabindex = pane.active ? 0 : -1;
      return (
        <li
          class={{ "im-this": pane.active }}
          id={`tab-${tabName}`}
          key={`tab-${tabName}`}
          on-click={(ev) => {
            callTabClick(pane, index, ev);
          }}
        >
          <img
            src={recordImg}
            on-click={(ev) => {
              callTabClick(pane, index, ev),
                callRecording(pane, pane.recording, ev);
            }}
          />
          <span> {label}</span>
          <i
            class="im-icon el-icon-error"
            on-click={(ev) => {
              callTabRemove(pane, pane.id, pane.type, ev);
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