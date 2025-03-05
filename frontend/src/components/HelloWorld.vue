<template>
  <div id="app" class="chat-container">
    <div class="chat-box">
      <!-- 显示用户和AI的消息 -->
      <div v-for="(message, index) in messages" :key="index" :class="message.from">
        <p>{{ message.text }}</p>
      </div>
    </div>

    <div class="input-container">
      <input v-model="userMessage" placeholder="请输入你的问题..." @keyup.enter="sendMessage" />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "App",
  data() {
    return {
      userMessage: "",  // 用户输入的消息
      messages: [],     // 存储消息记录
    };
  },
  methods: {
    async sendMessage() {
      if (this.userMessage.trim() === "") return;

      // 添加用户消息
      this.messages.push({ from: "user", text: this.userMessage });

      // 清空输入框
      const message = this.userMessage;
      this.userMessage = "";

      // 向后端请求 AI 答复
      try {
        const response = await this.$http.post("http://localhost:3000/api/qa", {
          question: message,
          filePath: "data/employee_handbook.pdf",  // 文件路径可以动态变化
        });

        // 添加 AI 的回答
        this.messages.push({ from: "ai", text: response.data.answer });
      } catch (error) {
        console.error("错误:", error);
        this.messages.push({
          from: "ai",
          text: "对不起，我无法理解这个问题。",
        });
      }
    },
  },
};
</script>

<style scoped>
/* 全局字体和背景设置 */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

/* 聊天框样式 */
.chat-container {
  width: 400px;
  height: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-box {
  flex: 1;
  overflow-y: scroll;
  padding: 10px;
}

.chat-box .user {
  text-align: right;
  color: #007bff;
}

.chat-box .ai {
  text-align: left;
  color: #28a745;
}

.input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
