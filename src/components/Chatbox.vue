<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <q-scroll-area class="q-pt-md" :style="'height:' + height">
        <p-message v-for="(msg, it) in messages" :key="it" :colours="cols"
          :useravatar="useravatar" :username="username" :botavatar="botavatar" :botname="botname"
          :sent="msg.sent" :text="msg.text" :loading="msg.text.length === 0" :type="msg.type"/>
      </q-scroll-area>
    </q-card-section>

    <q-card-actions>
      <q-select label="Select here" stack-label :options="counterargs"
        v-model="counterarg" class="fit" :color="cols.field" filled @input="answer" />
    </q-card-actions>
  </q-card>
</template>

<script>
import {
  QCard,
  QCardActions,
  QCardSection,
  QScrollArea,
  QSelect,
} from 'quasar';
import axios from 'axios';
import PMessage from './Message.vue';

const axiosinst = axios.create({
  baseURL: (process.env.NODE_ENV === 'production' ? 'https://persuadr.ai/api/' : ''),
});

export default {
  name: 'PChatbox',
  components: {
    QCard,
    QCardActions,
    QCardSection,
    QScrollArea,
    QSelect,
    PMessage,
  },
  data() {
    return {
      messages: [],
      cols: {},
      counterarg: '',
      counterargs: [],
    };
  },
  props: {
    useravatar: {
      type: String,
      required: true,
    },
    botavatar: {
      type: [String, Object],
      required: true,
    },
    botname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '500px',
    },
    colours: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    const defaultCols = {
      field: 'cyan-9',
      userbg: 'blue-grey-2',
      usertext: 'black',
      botbg: 'cyan-8',
      bottext: 'white',
    };
    this.cols = Object.assign({}, defaultCols, this.colours);
    if (this.token) {
      axiosinst.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    }
    // Makes sure the dialogue is ended when the tab is closed without going until the end of the conversation
    window.addEventListener('beforeunload', function atclose(e) {
      this.endDialogue(0);
      // the absence of a returnValue property on the event will guarantee the browser unload happens
      delete e.returnValue;
    });
  },
  methods: {
    setBaseUrl(url) {
      axiosinst.defaults.baseURL = url;
    },
    setToken(token) {
      axiosinst.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    $_chatbox_manageCounterarguments(args) {
      const text = [];
      this.counterargs = [];
      let type = 'default';
      args.forEach((arg) => {
        console.error(arg);
        if (arg.metadata && arg.metadata.trigger) {
          this.$emit('trigger', arg.metadata.trigger);
        }
        arg.arg.text.split('\n\n').forEach(s => text.push(s));
        if (arg.metadata && arg.metadata.avatartype) {
          type = arg.metadata.avatartype;
        }
        arg.counters.forEach(c => this.counterargs.push({
          label: c.text,
          value: c.id,
        }));
      });
      let m = text.shift();
      this.messages.push({
        text: [m],
        sent: false,
        type,
      });
      if (text.length) {
        const int = setInterval(() => {
          m = text.shift();
          this.messages[this.messages.length - 1].text.push(m);
          if (!text.length) {
            clearInterval(int);
          }
        }, 500);
      }
    },
    async startDialogue() {
      try {
        const payload = await axiosinst.get('/start');
        this.$_chatbox_manageCounterarguments(payload.data.args);
      } catch (err) {
        this.$_chatbox_catchError(err);
      }
    },
    async answer() {
      this.messages.push({
        text: [this.counterarg.label],
        sent: true,
      });
      try {
        const payload = await axiosinst.post('/arg', {
          args: [{ arg: this.counterarg.value }],
        });
        this.counterarg = '';
        if (payload.data.args.length > 0) {
          this.$_chatbox_manageCounterarguments(payload.data.args);
        } else {
          await this.endDialogue(1);
        }
      } catch (err) {
        this.$_chatbox_catchError(err);
      }
    },
    async endDialogue(metric) {
      try {
        await axiosinst.post('/end', { metrics: metric });
      } catch (err) {
        this.$_chatbox_catchError(err);
      }
    },
    $_chatbox_catchError(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
      console.error(error.config);
    },
  },
};
</script>
