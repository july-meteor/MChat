<script>
import {constant} from "../../const";
/**
 *  readMe
 *  这里封装了聊天列表的 chat-list
 *  设计模式为mvc模式
 *  chatTabs不做任何影响model 的操作，只提供view 【视图】
 *  所有事件都通过回调
 *  其中的panes 是指
 */
//图标编码
const show = "&#xe61a;";
const unshow = "&#xe602;";

function noop() {}
export default {
  name: "ChatTabs",
  //注入父级属性
  inject: ["rootChat"],
  props: {
    panes: Array, //指的是实际chat对话框
    chatShow: {
      type: Boolean,
      default: true
    },
    // 以下是回调事件集合
    callTabClick: {
      type: Function,
      default: noop
    },
    callTabRemove: {
      type: Function,
      default: noop
    },
    callPanesDrag: {
      type: Function,
      default: noop
    },
    callChatshow: {
      type: Function,
      default: noop
    },
    callChatMin: {
      type: Function,
      default: noop
    },
    callRecording: {
      type: Function,
      default: noop
    }
  },
  data() {
    return {
      stickyTop: 0,
      zIndex: 1
    };
  },
  computed: {
    stickyActive() {
      return this.stickyTop > 0;
    }
  },
  methods: {
    handleScroll(event) {
      this.stickyTop = event.target.scrollTop;
    }
  },
  render(h) {
    let {
      panes,
      chatShow,
      stickyTop,
      stickyActive,
      handleScroll,
      callTabClick,
      callTabRemove,
      callPanesDrag,
      callChatshow,
      callChatMin,
      callRecording
    } = this;

    //对话框对应标签生成
    const tabs = this._l(panes, (pane, index) => {
      let tabName = pane.name + pane.index + index;
      pane.index = `${index}`;
      //对话是否激活
      let active = pane.active;
      let label = pane.name; //测试
      let type =pane.type; // 到时候看是否得设计标签不一样
      let recordImg = pane.recording
        ? constant.btnRecording
        : constant.btnRecord;

      const tabindex = pane.active ? 0 : -1;
      return (
        <li
          class={{ "im-this": pane.active }}
          id={`tab-${tabName}`}
          key={`tab-${tabName}`}
          on-click={ev => {
            callTabClick(pane, index, ev);
          }}
        >
          <img
            src={recordImg}
            on-click={ev => {
              callTabClick(pane, index, ev),
                callRecording(pane, pane.recording, ev);
            }}
          />
       <span> {label }</span>
          <i
            class="im-icon el-icon-error"
            on-click={ev => {
              callTabRemove(pane, pane.id, pane.type, ev);
            }}
          >
          </i>
        </li>
      );
    });
    //render对icon css的方式不支持只能
    const showIcon = (
      <i
        class={{'im-icon': true,
        'btn-pane-show':true,
        'el-icon-arrow-right': !chatShow ,
        'el-icon-arrow-down': chatShow ,
        }}
        on-click={() => {
          callChatshow();
        }}
      >
      </i>
    )
    return (
      <ul
        class={{
          " im-chat-tabs": true,
            "tabs-shadow": !chatShow
        }}
        on-mousedown={ev => {
          callPanesDrag(ev);
        }}
        on-scroll={ev => {
          handleScroll(ev);
        }}
      >
        <li
          class={{
            "im-tabs-title": true,
            'active': true
          }}
          style={{
            top: stickyTop + "px"
          }}
           
        >
 
          <span class="im-box-setwin "     on-click={() => {
                callChatMin();
              }}>
            <a
              class="im-btn-min"
              href="javascript:;"
         
            >
              <cite></cite>
            </a>
          </span>

          {showIcon}
        </li>
        {tabs}
      </ul>
    );
  }
};
</script>


