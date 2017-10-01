<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/fifteen">Fifteen</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default
{
  name: 'carcass',
}
</script>