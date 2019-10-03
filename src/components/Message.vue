<template>
  <q-chat-message v-if="sent" text-color="black" size="8" :avatar="useravatar"
    :text="text" sent class="q-mx-md" :name="username" bg-color="blue-grey-2" />
  <q-chat-message v-else text-color="white" :avatar="botavatars" bg-color="cyan-8"
    :text="text" class="q-mx-md" :size="loading ? '' : '8'" :name="botname">
    <q-spinner-dots size="2rem" v-if="loading"/>
  </q-chat-message>
</template>

<script>
import {
  QChatMessage,
  QSpinnerDots,
} from 'quasar';

export default {
  name: 'PMessage',
  components: {
    QChatMessage,
    QSpinnerDots,
  },
  // TODO: param bg color and font color
  props: {
    sent: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      default: 'default',
    },
    useravatar: {
      type: String,
      required: true,
    },
    botavatar: {
      type: [String, Object],
      required: true,
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
    botavatars() {
      if (typeof this.botavatar === 'string') {
        return this.botavatar;
      }
      if (typeof this.botavatar === 'object') {
        return this.botavatar[this.type];
      }
      return '';
    },
  },
};
</script>
