<template>
  <div id="app">
    <chatbox />
  </div>
</template>

<script>
import Chatbox from './components/Chatbox.vue';

export default {
  name: 'app',
  components: {
    Chatbox,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
