<template>
  <div id="app">
    <keep-alive>
      <transition :name="animate">
        <router-view />
      </transition>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      animate: "",
    };
  },
  watch: {
    $route(to, from) {
      if (to.meta.tx > from.meta.tx) {
        this.animate = "right";
      } else {
        this.animate = "left";
      }
    },
  }
};
</script>
<style lang="scss">
#app {
  font-family: "helvetica neue", tahoma, "hiragino sans gb", stheiti,
    "wenquanyi micro hei", \5fae\8f6f\96c5\9ed1, \5b8b\4f53, sans-serif;
  color: #888;
}
.auto-img {
  width: 100%;
  display: block;
}
.right-enter-active,
.right-leave-active,
.left-enter-active,
.left-leave-active {
  transition: all 200ms;
}
.right-enter {
  transform: translate3d(-100%, 0, 0);
}
.right-leave-to {
  transform: translate3d(100%, 0, 0);
}
.left-enter {
  transform: translate3d(100%, 0, 0);
}
.left-leave-to {
  transform: translate3d(-100%, 0, 0);
}
</style>
