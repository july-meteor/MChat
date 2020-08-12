<template>
  <div class="im-user-list">
    <ul>
      <li>
        <div class="list-title">成员(24/30)</div>
      </li>
      <li>
        <div class="im-list-filter">
          <input class="im-input-search" placeholder="搜索成员" />
          <span class="im-input-search-prefix">
            <i class="im-icon el-icon-search"></i>
          </span>
        </div>
      </li>
      <li v-for="(item,k) in list" :key="k">
        <user-item :item="item" @click="bindClick"></user-item>
      </li>
    </ul>
  </div>
</template>
<script>
import UserItem from "./UserItem";
export default {
  name: "UserList",
  components: {
    UserItem,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    bindClick(type) {
      this.$emit("click", type);
    },
  },
};
</script>
