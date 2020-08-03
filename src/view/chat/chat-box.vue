<script>
import {constant} from '../../const'
import {mapGetters, mapActions} from 'vuex'
import chatRecord from "./chat-record";
import chatUserList from './chat-userlist'
/**
 * 聊天窗主要核心组件
 */
function noop() {}
export default {
  name: "ChatBox",
  componentName: "ChatBox",
  props: {
    id: Number,
    name: String,
    label: String,
    labelContent: Function,
    closable: Boolean,
    disabled: Boolean,
    type: Number,

    //懒加载
    lazy: Boolean,
    // 窗口关闭
    channelClose: {
      type: Function,
      default: noop
    },
    channelRecord: {
      type: Function,
      default: noop
    },
    emitMessage: {
      type: Function,
      default: noop
    }
  },
  components: {
    chatRecord,
    chatUserList
  },
  inject: ["rootChat"],
  data() {
    return {
      //序号
      index: null,
      //已加载
      loaded: true,
      chatLog: [],
      //内容
      content: undefined
    };
  },
  computed: {
    ...mapGetters(['mine' ,'chat']),
    isClosable() {
      return this.closable || this.$parent.closable;
    },
    active() {
      const active = this.chat.selected === this.index;
      if (active) {
        this.loaded = true;
      }
      return active;
    },
    //对话状态
    recording() {
      if (!this.active) return false;
    

      return this.chat.mike;
    },
    chatName() {
      return this.index;
    }
    //聊天记录
  },
  methods: {
    ...mapActions(["setChannelInfo"]),
    //这个方法由上层调用
    getMessage(param) {
      // if (!param) return;
      if (param.id == this.id) {
        this.chatLog.push(param);
        //补一个聊天焦点拉动
        this.$refs.chatRecord.handleScrollTop();
        //补一个加历史记录的
      }
    },
    //发送
    sendMessage() {
      if (!this.content || this.content.length < 1) return;
      const msg = {
        username: this.mine.username,
        avatar: this.mine.avatar, //头像
        channel: this.id, // chat的id // 如果当前chat是私聊则为私聊目标的id
        fromid: this.mine.id, //发起人id
        type: this.type, //
        mine: true, //是不是自己发的
        content: this.content , // 内容
        timestamp: new Date() //发起的时间戳
      };
      this.content = undefined;
      this.emitMessage(msg);
    }
  },
  render(h) {
    let {
      id,
      type,
      lazy,
      loaded,
      name,
      active,
      chat,
      chatName,
      chatLog,
      recording,
      channelClose,
      channelRecord,
      sendMessage,
      setChannelInfo,
    } = this;
    let el_chat_titel, chatMain, chatRecordData, chatFooter, chatToolbar;

     el_chat_titel = (
      <div class=" im-chat-title">
        <div class="im-chat-info" title="编辑群组"  >
          <img src={constant.avatar_terminal}  on-click={ev=>{
          setChannelInfo(id)
        }} />
          <span class="im-chat-username">
            {name}
          </span>
          <p class="im-chat-group">
            <span>
            群组
            </span>
          </p>
        
            <div class="im-chat-msg" > {chat.titleMsg}</div>
        </div>
      
      </div>
    );
    chatRecordData = {
      props: {
        values: chatLog
      },
      ref: "chatRecord"
    };

    var self = this;
    const textareaVnode = h("textarea", {
      domProps: {
        value: self.content
      },
      on: {
        input: function(event) {
          self.content = event.target.value;
        },
        keydown: function(ev) {
          let keyCode = ev.keyCode;
          let ctrlKey = ev.ctrlKey;
          //  if(ctrlKey && keyCode === 13){
          //   self.sendMessage();
          //  }
          if (keyCode === 13) {
            if(ctrlKey){
              self.content +='\n';
            }else{
               ev.preventDefault();
              sendMessage();
            }
        
          }
        }
      }
    });

    chatFooter = (
      <div  class={{
            "im-chat-footer":true ,
            "listActive":  chat.userlistShow}}
      >
        <div class="im-chat-toolbar"></div>
        <div class="im-chat-textarea">{textareaVnode}</div>
        <div class="im-chat-bottom">
          <div class="im-chat-btn-bar">
            <span
              on-click={event => {
                channelClose(null, id, type, event);
              }}
            >
              关闭
            </span>
            <span
              on-click={ev => {
                channelRecord(null, recording, ev);
              }}
              style={{ "background-color": recording ? "red" : "" }}
            >
              PTT
              <svg-icon class="im-icon" icon-class="mike"></svg-icon>
            </span>
            <span
              class="im-btn-send"
              on-click={() => {
                sendMessage();
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
    const chatBoxContext = (
      <div
        class="im-chat-main"
    
        id={`chat-${chatName}`}
        key={`chat-${chatName}`}
      >
          <div
          class={{
            "im-pane-item":true ,
            "show": active && this.chat.contentShow}}
         
        >
           <chat-userList>
          </chat-userList>
          {chatTitel}
          <chat-record {...chatRecordData}> </chat-record>
          {chatFooter}
          </div>

      </div>
    );

    //  还没想起这部分是干嘛的 先不删  return ((!lazy || loaded) || active) ? chatBoxContext : null;
    return chatBoxContext;
  },
  created() {}
};
</script>
