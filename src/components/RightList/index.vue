<template>
  <div>
    <notice-box :items="notices" @click="bindClick"></notice-box>
    <user-list :list="userList" @click="bindClick"></user-list>
  </div>
</template>
<script>
import NoticeBox from "./component/NoticeBox";
import UserList from "./component/UserList";

/**
 *  开发思路
 * 1、内部维护 list 通过提供方法来修改 内部数据
 *    这种方案存在一种问题，如果方法不够全面则会造成封装残缺
 * 2、提供基础method及view mode 由上层提供
 */

function noop(){
  return []
}

export default {
  name: "chat-right-list",
  componentName: "chatRightList",
  components: {
    NoticeBox,
    UserList,
  },
  props: {
    // config: {},
    // getUserList: {
    //   type: Function,
    //   default: () => {},
    // },
    // getNotics: {
    //   type: Function,
    //   default: () => {},
    // },
    notices:{
      type: Array,
      default:noop
    },
    userList:{
    type:Array,
      default:noop
    }
  },
  data() {
    return {

    };
  },
  created() {
    // 放弃方案一
    // this.handleUserList();
    // this.handleNotices();
  },
  methods: {
    bindClick(event) {
      this.$emit("click", event);
    },
    // handleNotices() {
    //   let list = this.getNotics(this.config);
    //   this.notices = list;
    // },
    // handleUserList() {
    //   let list = this.getUserList(this.config);
    //   this.userList = list;
    // },
  },
};
</script>