<template>
  <div>
    <notice-box :config="notices"></notice-box>
    <user-list :list="userList"></user-list>
  </div>
</template>
<script>
import NoticeBox from "./component/NoticeBox";
import UserList from "./component/UserList";

export default {
  name: "chat-right-list",
  componentName: "chatRightList",
  components: {
    NoticeBox,
    UserList,
  },
  props: {
    config: {},
  },
  data() {
    return {
      notices: {},
      userList: [],
    };
  },
  created() {
    // const
    this.fetchUserList();
    this.fetchNotics();
  },
  methods: {
    fetchNotics(id) {
      let notics = [
        {
          id: 1,
          type: "文件",
          title: "RocketMQ原理.dock",
        },
        {
          id: 2,
          type: "公告",
          title: "公主连接Rank推荐",
        },
      ];
      this.notices = notics;
    },
    fetchUserList(id) {
      // do something
      let list = [
        {
          id: 1,
          name: "七月",
          type: "",
          avatar: "/static/avatar/avatar_meteor.png",
        },
        {
          id: 1,
          name: "初音",
          type: "",
          avatar: "/static/avatar/初音.png",
        },
        {
          id: 2,
          name: "雪",
          type: "",
          avatar: "/static/avatar/雪.png",
        },
        {
          id: 3,
          name: "可可罗",
          type: "",
          avatar: "/static/avatar/可可罗.png",
        },
        {
          id: 4,
          name: "栞",
          type: "",
          avatar: "/static/avatar/栞.png",
        },
      ];
      this.userList = list;
    },
  },
};
</script>