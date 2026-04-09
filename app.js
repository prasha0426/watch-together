// 🔥 YOUR FIREBASE CONFIG (replace this)
const firebaseConfig = {
  apiKey: "AIzaSyAd0al5YISdP1Apl7YK7clWKjYOhovspz8",
  authDomain: "watch-together-7e08f.firebaseapp.com",
  projectId: "watch-together-7e08f",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🎥 VIDEO
const video = document.getElementById("video");
const fileInput = document.getElementById("fileInput");

// Load offline file
fileInput.onchange = (e) => {
  const file = e.target.files[0];
  console.log(file);
  video.src = URL.createObjectURL(file);
};

// ROOM SYSTEM
const room = prompt("Enter Room ID");

// 📡 SYNC VIDEO
video.onplay = () => {
  db.collection("rooms").doc(room).set({
    action: "play",
    time: video.currentTime
  });
};

video.onpause = () => {
  db.collection("rooms").doc(room).set({
    action: "pause",
    time: video.currentTime
  });
};

// Listen for sync
db.collection("rooms").doc(room).onSnapshot(doc => {
  const data = doc.data();
  if (!data) return;

  if (data.action === "play") {
    video.currentTime = data.time;
    video.play();
  }

  if (data.action === "pause") {
    video.currentTime = data.time;
    video.pause();
  }
});

// 💬 CHAT
function sendMessage() {
  const input = document.getElementById("msgInput");

  db.collection("chat").add({
    room: room,
    text: input.value,
    time: Date.now()
  });

  input.value = "";
}

db.collection("chat")
  .orderBy("time")
  .onSnapshot(snapshot => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const msg = doc.data();
      if (msg.room === room) {
        const div = document.createElement("div");
        div.textContent = msg.text;
        messagesDiv.appendChild(div);
      }
    });
  });

// 📹 JITSI VIDEO CALL
const jitsiFrame = document.getElementById("jitsi");
jitsiFrame.src = `https://meet.jit.si/${room}`;
