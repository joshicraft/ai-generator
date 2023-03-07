<template>
  <div>
    <h1>Chat</h1>
    <div v-for="message in messages" :key="message.id">
      {{ message.text }}
      <button @click="deleteMessage(message.id)">Delete</button>
      <button @click="regenerateMessage(message.id)">Regenerate</button>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="newMessageText" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'chat-component',
  data() {
    return {
      messages: [],
      newMessageText: ''
    }
  },
  methods: {
    async getMessages() {
      const response = await fetch('/.netlify/functions/chatResponse')
      const data = await response.json()
      this.messages = data
    },
    async sendMessage() {
      const response = await fetch('/.netlify/functions/chatResponse', {
        method: 'POST',
        body: JSON.stringify({ text: this.newMessageText }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      this.messages.push(data)
      this.newMessageText = ''
    },
    async deleteMessage(id) {
      const response = await fetch(`/.netlify/functions/chatResponse?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        this.messages = this.messages.filter(message => message.id !== id)
      }
    },
    async regenerateMessage(id) {
      const response = await fetch(`/.netlify/functions/chatResponse?id=${id}`, {
        method: 'PUT'
      })
      if (response.ok) {
        const index = this.messages.findIndex(message => message.id === id)
        const updatedMessage = await response.json()
        this.messages.splice(index, 1, updatedMessage)
      }
    }
  },
  created() {
    this.getMessages()
  }
}
</script>
