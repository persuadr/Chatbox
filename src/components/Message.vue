<template>
  <q-chat-message v-if="sent" text-color="black" size="8" avatar="statics/astronaut.png"
    :text="text" sent class="q-mx-md" :name="username" bg-color="blue-grey-2" />
  <q-chat-message v-else text-color="white" :avatar="pedro" bg-color="cyan-8"
    :text="text" class="q-mx-md" :size="loading ? '' : '8'" :name="botname">
    <q-spinner-dots size="2rem" v-if="loading"/>
  </q-chat-message>
</template>

<script>
export default {
  name: 'Message',
  props: {
    sent: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      default: 'normal',
    },
    text: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    botname: {
      type: String,
      default: 'Pedro',
    },
    username: {
      type: String,
      default: 'You, the pioneer',
    },
  },
  computed: {
    pedro() {
      let img;
      switch (this.type) {
        case 'question':
          img = 'pedroquestion.png';
          break;
        case 'assert':
          img = 'pedro!.png';
          break;
        default:
          img = 'pedro.png';
      }
      return `statics/${img}`;
    },
  },
};
</script>
