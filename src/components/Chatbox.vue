<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <q-scroll-area class="q-px-md q-pt-md" style="height: 500px">
        <message v-for="(msg, it) in messages" :key="it"
          :sent="msg.sent" :text="msg.text" :loading="msg.text.length === 0" :type="msg.type"/>
      </q-scroll-area>
    </q-card-section>

    <q-card-actions>
      <q-select label="Select here" stack-label :options="counterargs"
        v-model="counterarg" class="fit" color="cyan-9" filled @input="answer" />
    </q-card-actions>
  </q-card>
</template>

<script>
import Message from './Message.vue';

export default {
  name: 'Chatbox',
  components: {
    Message,
  },
  data() {
    return {
      messages: [{
        text: ['Hello!', 'If you would like to talk with me, just select your topic below.'],
        sent: false,
        type: 'normal',
      }],
      counterarg: '',
      counterargs: [{ label: 'jeifjeijriejirezi rjrizejrijeir erjiezjriejirje rezirjezirji Arg1', value: 'arg1' }],
      token: '',
    };
  },
  methods: {
    manageCounterarguments(args) {
      const text = [];
      this.counterargs = [];
      let type = 'normal';
      args.forEach((arg) => {
        if (arg.meta.route) {
          this.$router.push(arg.meta.route);
        }
        text.push(arg.arg.text);
        if (arg.meta.avatartype) {
          type = arg.meta.avatartype;
        }
        arg.counters.forEach(c => this.counterargs.push({
          label: c.text,
          value: c.id,
        }));
      });
      this.messages.push({
        text,
        sent: false,
        type,
      });
    },
    async startDialogue() {
      try {
        let payload = await this.$axios.post('/apikey', { description: '' });
        const apikeypair = payload.data.key;
        payload = await this.$axios.post('/conversation', { graphId: this.graphId }, {
          auth: {
            username: apikeypair.public.clientid,
            password: apikeypair.secret,
          },
        });
        this.token = payload.data.token;
        await this.$axios.delete(`/apikey/${apikeypair.public.id}`);
        payload = await this.$axios.get('/start', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.manageCounterarguments(payload.data.args);
      } catch (err) {
        console.log(err);
      }
    },
    async answer() {
      this.messages.push({
        text: [this.counterarg.label],
        sent: true,
      });
      try {
        const payload = await this.$axios.post('/arg', {
          args: [{ arg: this.counterarg.value }],
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        if (payload.data.args.length > 0) {
          this.manageCounterarguments(payload.data.args);
        } else {
          await this.$axios.post('/end', {}, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
