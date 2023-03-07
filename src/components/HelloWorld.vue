<template>
  <div>
    <div class="chat-log">
      <div class="message" v-for="message in messages" :key="message._id">
        <span v-if="message.user">{{ message.user }}:</span>
        <span>{{ message.ai }}</span>
        <button v-if="message._id" @click="deleteMessage(message._id)">Delete</button>
      </div>
    </div>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="inputText" placeholder="Enter your message...">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { Configuration, OpenAIApi }  from "openai";
export default {
  name: 'app',
  setup() {
    const state = reactive({
      messages: [],
      inputText: ''
    });

    const getResponseFromAI = async () => {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Convert this text to a programmatic command:\n\nExample: Ask Constance if we need some bread\nOutput: send-msg `find constance` Do we need some bread?\n\nReach out to the ski store and figure out if I can get my skis fixed before I leave on Thursday",
        temperature: 0,
        max_tokens: 100,
        top_p: 1.0,
        frequency_penalty: 0.2,
        presence_penalty: 0.0,
        stop: ["\n"],
      });
      state.messages.push(response.data);
    }

    const getChatResponses = async () => {
      try {
        const response = await axios.get(process.env.VUE_APP_API_ENDPOINT + '/getChatResponses');
        state.messages = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const createChatResponse = async () => {
      if (!state.inputText) {
        return;
      }

      try {
        await getResponseFromAI();
        await axios.post(process.env.VUE_APP_API_ENDPOINT +  + '/createChatResponse', { user: 'User', ai: state.inputText });
        // state.messages.push(response.data);
        state.inputText = '';
      } catch (error) {
        console.error(error);
      }
    };

    const deleteChatResponse = async (id) => {
      try {
        await axios.delete(process.env.VUE_APP_API_ENDPOINT + `/deleteChatResponse/${id}`);
        state.messages = state.messages.filter(message => message._id !== id);
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(getChatResponses);

    return {
      state,
      createChatResponse,
      deleteChatResponse
    };
  }
}
</script>

<style>
.chat-log {
  height: 300px;
  overflow-y: auto;
}
.message {
  margin: 10px;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 5px;
}
button {
  margin-left: 10px;
}
</style>
