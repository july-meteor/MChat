<script>
import { mapGetters,mapActions } from "vuex";
import Utils from "./utils";
import { copyFileSync } from "fs";
import {constant} from '../../const'

function noop() {}
const recordVO = {
  index: undefined,
  username: undefined,
  avatar: undefined, //头像
  //chat id
  id: undefined, // chat的id // 如果当前chat是私聊则为私聊目标的id
  fromid: undefined, //发起人id
  type: undefined, // 消息类型
  mine: false, //是不是自己发的
  content: undefined, // 内容
  timestamp: undefined //发起的时间戳
};

/**
 *  聊天框内容主要提供 聊天记录，图片预览等组件
 */
export default {
  name: "chatRecord",
  componentName: "chatRecord",
  props: {
    values: {
      type: Array,
      defalut: noop
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["chat"])
  },
  methods: {
    ...mapActions(["openUserlist"]),
    handleScrollTop() {
      this.$nextTick(() => {
        this.$el.scrollTop = this.$el.scrollHeight;
      });
    }
  },
  render(h) {
    let { values, chat ,openUserlist} = this;
    //聊天记录列表
    const recordList = this._l(values, (item, index) => {
      let contentHtml = h("div", {
        domProps: {
          innerHTML: Utils.ConvertContext(item.content)
        }
      });
      let leftName = item.mine ? "" : item.username;
      let rightName = item.mine ? item.username : "";
      let tiem = Utils.dateFormat(item.timestamp);

      return (
        <li class={{ "content-mine": item.mine }}>
          <div class="content-user">
            <img src={constant.avatar_terminal} />
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
          listActive: chat.userlistShow
        }}
      >
        <div>查看更多消息</div>
        <span
         on-click={ev=>openUserlist()}
          class={{
            "im-chat-btn-expand": true,
            close: chat.userlistShow,
          }}
        >
          <i 
            class={{
            "im-icon": true,
            "el-icon-arrow-left": !chat.userlistShow,
            "el-icon-arrow-right": chat.userlistShow
          }}
          
          > </i>
        </span>
        <ul>{recordList}</ul>
      </div>
    );
  }
};
</script>

<style scoped>
</style>

