const chatInput = document.querySelector(".chat-input textarea")
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotContainer = document.querySelector("#chatbot-container");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputHeight = chatInput.scrollHeight;


const createChatLi = (message,className) =>{
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat",className);
    let chatContent = className == "outgoing" ? `<p>${message}</p>` :`<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>` 
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role:"system",content:"You are a helpful pharmacy assistant. You cannot reply about anything else. If asked anything beside pharamacy related reply with that you cannot talk about anything else"},{role:"user",content:userMessage}]
        })
    }

    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(()=>  chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.style.height = `${inputHeight}px`;
    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
   

    setTimeout(()=>{
        const incomingChatLi = createChatLi("Thinking...","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown",(e)=>{
    if(e.key=="Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

sendChatbtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener('click', () => {chatbotContainer.classList.remove("show-chatbot")});
chatbotToggler.addEventListener('click', () => {chatbotContainer.classList.toggle("show-chatbot")});