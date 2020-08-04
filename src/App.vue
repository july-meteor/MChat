<template>
  <div id="app" class="wrapper">
    <MChat-index :config="config" @talkEvent="talkEvent" @sendMessage="sendMessage"></MChat-index>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      config: {
        //获取主面板列表信息，下文会做进一步介绍
        init: {},
        //我的信息
        mine: {
          // 昵称
          username: "Meteor",
          // 用户id
          id: "10001",
          //状态
          status: "online",
          //签名
          sign: "与其感慨路难行,不如马上出发！",
          avatar: "/static/avatar/user_avatar.png",
        },
        //会话
        chats: [
          {
            id: 1,
            name: "测试1",
            type: "friend",
            avatar: "http://tp1.sinaimg.cn/5619439268/180/40030060651/1",
          },
          {
            id: 2,
            name: "测试组",
            type: "group",
            avatar: "http://tp1.sinaimg.cn/5619439268/180/40030060651/1",
          },
        ],
      },

      channleList: [
        {
          id: 1,
          name: "测试1",
          avatar: "http://tp1.sinaimg.cn/5619439268/180/40030060651/1",
          type: "friend",
        },
        {
          id: 2,
          name: "测试2",
          avatar: "http://tp1.sinaimg.cn/5619439268/180/40030060651/1",
          type: "friend",
        },
      ],
    };
  },
  methods: {
    talkEvent({ event, data }) {
      switch (event) {
        case "removeChat":
          let channels = this.channleList;
          let len = channels.length;
          if (len < 1) return;
          let ary = [];
          for (let i = 0; i < len; i++) {
            let model = channels[i];
            if (model.id != data.id) {
              ary.push(model);
            }
          }
          this.channleList = ary;
          break;
      }
    },

    sendMessage(data) {
      
      const { mine, to, content, timestamp } = data;
      let message = {
        //消息来源用户名
        username: mine.username,
        //消息来源用户头像
        avatar: mine.avatar,
        //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
        id: to.id,
        //聊天窗口来源类型，从发送消息传递的to里面获取
        type: to.type,
        //消息内容
        content,
        //消息id，可不传。除非你要对消息进行一些操作（如撤回）
        cid: 0,
        //是否我发送的消息，如果为true，则会显示在右方
        mine: true,
        //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
        fromid: mine.id,
        //服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
        timestamp,
      };

       this.$im.emit("getMessage",message)
    },
  },
};
</script>




<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>