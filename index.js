import {API_KEY, LIVE_ID} from './security.js'

// Step 2: Get the live chat ID using the live broadcast's video ID
function getLiveChatId(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items.length > 0) {
        const liveChatId = data.items[0].liveStreamingDetails.activeLiveChatId;
        setInterval(fetchLiveChatMessages, 200, liveChatId);
      } else {
        console.log('Live broadcast details not found.');
      }
    })
    .catch(error => console.error('Error getting live chat ID:', error));
}
let lastms = 0;
// Step 3: Fetch live chat messages using the live chat ID
function fetchLiveChatMessages(liveChatId) {
  const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items.length > lastms) {
        data.items.slice(lastms, undefined).forEach(message => {
          addHTML(`${message.authorDetails.displayName}: ${message.snippet.displayMessage}`)
        });
      } else {
        console.log('No messages found in live chat.');
      }
      lastms = data.items.length
    })
    .catch(error => console.error('Error fetching live chat messages:', error));
}
const addHTML = (html) => {
  const messages = document.getElementById("messages")
  let message = document.createElement("div")
  message.className = "message"
  message.innerHTML = html
  messages.appendChild(message)
}

addHTML("system: <nobr/><h4>script init</h4>")
const dinp = document.getElementById("dev-input")
dinp.onkeydown = (event) => {
  if(event.key === 'Enter') {
    addHTML("dev 1: " + dinp.value)
    dinp.value = ""       
  }
}
// Start the process
getLiveChatId(LIVE_ID)