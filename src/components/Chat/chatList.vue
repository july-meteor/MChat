<script>
import Utils from "./utils";
import Scroll from "@/utils/scroll";

function noop() {}

const default_msg = {
  index: undefined,
  username: undefined,
  avatar: undefined, //头像
  //chat id
  id: undefined, // chat的id // 如果当前chat是私聊则为私聊目标的id
  fromid: undefined, //发起人id
  type: undefined, // 消息类型
  mine: false, //是不是自己发的
  content: undefined, // 内容
  timestamp: undefined, //发起的时间戳
};

const default_config = {};

export default {
  name: "MCaht-list",
  componentName: "MChatList",
  props: {
    //聊天记录
    list: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => ({
        width: "525px",
        height: "382px",
      }),
    },
  },
  data() {
    return {
      open: false,
      load: false,
      scroll: null,
      scrollTimer: null,
      // 标题前消息
      beforeTitle: "",
      // 标题时间
      titleTimer: "",
      //下载历史
      loadHistory: false,
      // 历史是否下载了
      historyLoding: false,
    };
  },
  watch: {
    //
    load(newval) {
      if (newval) {
        setTimeout(() => {
          this.scroll && this.scroll.refresh();
          this.load = false;
        }, 1000);
      }
    },
    //
    "config.scrollToButton"(newval) {
      if (newval) {
        this.scrollBottom();
      }
    },
    // 未读
    unread(newval) {
      if (newval) {
        this.beforeTitle && this.resetTitle(this.beforeTitle);
        this.saveTitle();
        this.changeTitle();
        this.showBrowser();
      } else {
        this.resetTitle(this.beforeTitle);
      }
    },
  },
  computed: {
    //是否在最下面
    isBottom() {
      return this.scroll && this.scroll.isBottom;
    },
    // 滚动条类型
    scrollType() {
      const { scrollType: type = "noroll" } = this.config;
      return type;
    },
    //未读
    unread() {
      const { unread = 0 } = this.scroll || {};
      return unread;
    },
  },
  methods: {
    /******  滚动条设置 ******/
    scrollBottom() {
      if (this.scroll) {
        this.scroll.refresh();
        setTimeout(() => {
          this.scroll.scrollTo(0, this.scroll.maxScrollY, 200);
        }, 800);
      }
    },
    createScroll() {
      const that = this;
      const dom = this.$refs.scroller;
      this.scroll = new Scroll(dom, {
        click: true,
        scrollbars: true,
        mouseWheel: true,
        preventDefault: false,
        interactiveScrollbars: true,
        hijackInternalLinks: true,
        // useTransform: false,
      });
      // copy code
      dom.addEventListener(
        "ontouchstart" in window ? "touchstart" : "mousedown",
        function (e) {
          e.stopPropagation();
          var target = e.target;
          // while (target.nodeType != 1) target = target.parentNode;
          if (target.tagName === "SPAN") {
            var clipBoardContent = target.innerText;
            if (!clipBoardContent) return;
            const input = document.createElement("input");
            document.body.appendChild(input);
            input.setAttribute("value", clipBoardContent);
            input.select();
            if (document.execCommand("copy")) {
              document.execCommand("copy");
              that.$message({
                message: "复制成功",
                type: "success",
              });
            }
            document.body.removeChild(input);
          }
        }
      );
      // scroll done callback
      this.scroll.on("scrollEnd", function () {
        // console.log('scroll')
        that.scrollTop();
        if (that.historyLoding) return;
        that.scroll.savePosition();
        that.scroll.read();
      });
    },
    // 读取 历史记录强行拉动滚动条
    scrollTop() {
      const { isTop } = this.scroll;
      if (isTop) {
        if (this.loadHistory) {
          this.historyLoding = true;
        } else this.loadHistory = true;
        return;
      }
      this.closeTopTip();
    },
    closeTopTip() {
      this.loadHistory = false;
      this.historyLoding = false;
    },
    childnodeLoad() {
      if (this.scrollType === "scroll") return;
      const parent = this.$refs.main;
      if (!parent) return;
      const childs = parent.children;
      childs.forEach((i) => {
        const top = i.offsetTop;
        this.scroll.setPosition(top, i);
      });
    },
    scrollRefresh() {
      setTimeout(() => {
        this.scroll && this.scroll.refresh();
        this.scrollRefresh();
      }, 1000);
      return;
    },
    /**** 滚动条结束 ********/
    /*** 标签标题  开始***/
    saveTitle() {
      const { title } = document;
      this.beforeTitle = title;
    },
    resetTitle(title) {
      document.title = title;
      clearTimeout(this.titleTimer);
    },
    changeTitle() {
      const that = this;
      let flage = 0;
      change();
      function change() {
        let title = "【未读】";
        if (flage) {
          title = "【" + that.unread + "条】";
        }
        flage = !flage;
        that.titleTimer = setTimeout(() => {
          that.resetTitle(title + that.beforeTitle);
          change();
        }, 1000);
      }
    },
    showBrowser() {
      if (window.Notification && Notification.permission !== "denied") {
        const { unread } = this;
        Notification.requestPermission(function (status) {
          if (status === "granted")
            new Notification("新消息", {
              body: `您总共有${unread}条消息未读。`,
            });
        });
      }
    },
    /****标签标题 结束 ***/

    handleOpen() {},
  },
  mounted() {
    this.createScroll();
    this.scrollRefresh();
  },
  render(h) {
    let { list, open, handleOpen } = this;

    const recordList = this._l(list, (item, index) => {
      let contentHtml = h("div", {
        domProps: {
          innerHTML: Utils.ConvertContext(item.content),
        },
      });
      let leftName = item.mine ? "" : item.username;
      let rightName = item.mine ? item.username : "";
      let tiem = Utils.dateFormat(item.timestamp);
      return (
        <li class={{ "content-mine": item.mine }}>
          <div class="content-user">
            <img src={item.avatar} />
            <cite>
              {leftName}
              <i>{tiem}</i> {rightName}
            </cite>
          </div>
          <div class="content-text"> {contentHtml}</div>
        </li>
      );
    });

    return (
      <div
        class={{
          "im-chat-content": true,
          "listActive": false,
        }}
        ref="scroller"
      >
        <div>查看更多消息</div>
        <span
          on-click={(ev) => handleOpen()}
          class={{
            "im-chat-btn-expand": true,
            close: open,
          }}
        >
          <i
            class={{
              "im-icon": true,
              "el-icon-arrow-left": !open,
              "el-icon-arrow-right": open,
            }}
          ></i>
        </span>
        <ul>{recordList}</ul>
      </div>
    );
  },
};
</script>