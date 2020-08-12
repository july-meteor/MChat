<template>
  <div class="im-notice" style="resolve">
    <P class="im-notic-title">群通知</P>

    <ul class="im-notic-list">
      <li v-for="(item ,k) in config" :key="k">
        <span>【{{item.type}}】{{item.title}}</span>
      </li>
    </ul>

    <!-- <img class="im-notice-img" src="/static/images/unnotic.png" /> -->
  </div>
</template>
<script>
export default {
  name: "NoticeBox",
  props: {
    config: {},
  },
  data() {
    return {};
  },
};
</script>

<style>
.im-notice {
  height: 30%;
  text-align: left;
  position: relative;
}
.im-notic-title {
  padding-left: 15px;
  font-size: 14px;
  font-weight: bold;
}

.im-notic-list li {
  font-size: 12px;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
.im-notic-item {
  font-size: 12px;
}
.im-notic-lable {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding: 0 0.2rem;
}

.im-notice-img {
  width: 100%;
}
</style>