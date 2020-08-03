<template>
  <div id="app" class="wrapper">
    <MChat-index :list="channleList"></MChat-index>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      channleList: [{ id: 1, name: "测试" }],
    };
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