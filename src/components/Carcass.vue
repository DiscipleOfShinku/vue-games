<template>
  <div id="app" class="app">
    <nav class="secondary-nav">
      <router-link class="secondary-nav__link" to="/">Home</router-link>
      <router-link class="secondary-nav__link" to="/fifteen">Fifteen</router-link>
      <router-link class="secondary-nav__link" to="/snake">Snake</router-link>
    </nav>
    <router-view class="game-area"></router-view>
  </div>
</template>

<script>
export default
{
  name: 'carcass',
}
</script>