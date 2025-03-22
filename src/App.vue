<template>
  <div class="container mx-auto  bg-sky-100">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
  
 
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

 
}
</style>
