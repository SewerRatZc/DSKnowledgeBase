<template>
  <div class="chat-container">
    <div class="chat-header">公司规定查询系统</div>
    <div class="chat-body">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['chat-message', message.type]"
      >
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="userInput"
        placeholder="请输入问题..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.title = '公司政策解读';
  },
  data() {
    return {
      messages: [
        {
          type: "user",
          content: "我想了解一下公司除法定节假日外的年假日期",
        },
        {
          type: "bot",
          content: `除法定节假日外，公司的年假制度如下：

年假天数
入职不足2年：10天
满2年后：每满一年增加1天，最多不超过24天

年假使用规则
优先使用法定年休假：年假总天数中已包含国家规定的法定年休假（5天、10天或15天），剩余天数为基金会提供的福利年休假。
年假使用期限：
年假原则上应在当财年使用。
未休完的年假可在下个财年9月30日前继续使用。
9月30日后未使用的福利年假将被取消，且无现金补偿。


年假申请
提前申请：连续休年假超过5个工作日的，应在休假开始前至少两周向主管领导提交申请。
最小单位：年假申请最小单位为0.5个工作日。

总结
公司的年假制度在法定年休假的基础上，提供了额外的福利年休假，具体天数根据员工的服务年限递增。年假需在当财年使用，未休完的部分可在下财年9月30日前使用，之后未使用的福利年假将被取消。`,
        },
      ],
      userInput: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.userInput.trim()) {
        this.messages.push({ type: "user", content: this.userInput });
        this.messages.push({
          type: "bot",
          content: `除法定节假日外，公司的年假制度如下：

年假天数
入职不足2年：10天
满2年后：每满一年增加1天，最多不超过24天

年假使用规则
优先使用法定年休假：年假总天数中已包含国家规定的法定年休假（5天、10天或15天），剩余天数为基金会提供的福利年休假。
年假使用期限：
年假原则上应在当财年使用。
未休完的年假可在下个财年9月30日前继续使用。
9月30日后未使用的福利年假将被取消，且无现金补偿。

总结
公司的年假制度在法定年休假的基础上，提供了额外的福利年休假，具体天数根据员工的服务年限递增。年假需在当财年使用，未休完的部分可在下财年9月30日前使用，之后未使用的福利年假将被取消。`,
        });
        this.userInput = "";
      }
    },
  },
};
</script>

<style scoped>
.chat-container {
  position: fixed;      /* 固定定位 */
  top: 0;
  left: 0;
  width: 100vw;         /* 覆盖视口宽度 */
  height: 100vh;        /* 覆盖视口高度 */
  background: white;    /* 背景色 */
  border: 2px solid #fafafa; /* 橙色边框 */
  box-sizing: border-box;    /* 防止边框溢出 */
}

.chat-header {
  background-color: #f1a41f;
  color: #fff;
  padding: 15px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.chat-body {
  padding: 20px 30px;
  height: calc(100vh - 120px); /* 减去头部和输入框高度 */
  overflow-y: auto;     /* 允许内容滚动 */
}

.chat-message {
  margin-bottom: 15px;
}

.chat-message.user {
  text-align: right;
}

.chat-message.bot {
  text-align: left;
}

.chat-message .message-content {
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
}

.chat-message.user .message-content {
  background-color: #f1a41f;
  color: #fff;
}

.chat-message.bot .message-content {
  background-color: #f1f1f1;
  color: #333;
}

.chat-input {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 40px;
  background: #f9f9f9;
}

.chat-input input {
  flex: 1;
  padding: 10px 250px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #f1a41f;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #f1a41f;
}
</style>