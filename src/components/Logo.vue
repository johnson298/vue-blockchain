<template>
  <router-link class="logo" to="/">
    <img
      src="../assets/images/burger-png.png"
      alt=""
      @click="$router.push('/')"
    />
  </router-link>
</template>

<script>
export default {
  name: "Logo",
};
</script>

<style lang="less" scoped>
.logo {
  display: flex;
  align-items: center;
  height: 100%;

  img {
    height: 100%;
  }
}

@media (max-width: 960px) {
  .logo img {
    height: 30px;
  }
}
</style>
