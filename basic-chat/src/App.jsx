import { useEffect, useState, useRef } from "react";
import angus from "./assets/angus.png";

function App() {
  const [apiMode, setApiMode] = useState("legacy");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [apiHealth, setApiHealth] = useState("unknown");
  const [dialogueState, setDialogueState] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);


  useEffect(() => {
    // Check API health on component mount
    const checkApiHealth = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/health");
        if (response.ok) {
          setApiHealth("Around and ready!");
        } else {
          setApiHealth("Off hiking the Highlands");
        }
      } catch (error) {
        setApiHealth("Off hiking the Highlands");
      }
    };

    checkApiHealth();
  }, [input]); 

 const sendMessage = async () => {
  if (!input.trim()) return;

  // Add user's message
  setMessages(prev => [...prev, { sender: "user", text: input }]);

  let endpoint;
  if (apiMode === "legacy") {
    endpoint = "http://localhost:3001/api/legacy-chat";    
  }
  else if (apiMode === "advanced") 
    {
    endpoint = "http://localhost:3001/api/chat";
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: input,
      treeState: dialogueState // ← SEND dialogue state if active
    }),
  });

  const data = await response.json();
  console.log("Response from server:", data);

  // Handle DIALOGUE TREE continuation
  if (data.mode === "dialogue_tree") {
    setDialogueState(data.treeState || null); // update or clear
    setMessages(prev => [...prev, { sender: "Angus", text: data.message }]);
    setInput("");
    return;
  }

  // Handle PROMPT MODE (question escalation)
  if (data.mode === "prompt_user") {
    setDialogueState(null); // ensure tree mode is OFF
    setMessages(prev => [...prev, { sender: "Angus", text: data.message }]);
    setInput("");
    return;
  }

  // Handle NORMAL SCRIPTED REPLIES
  if (data.mode === "script") {
    setDialogueState(null); // reset if tree just ended
    setMessages(prev => [...prev, { sender: "Angus", text: data.message }]);
    setInput("");
    return;
  }

  // Safety fallback (should never hit)
  setMessages(prev => [
    ...prev,
    { sender: "Angus", text: data.message }
  ]);

  setInput("");
};


  return (
    <div className="App">
    <div className="chatbox">
      <h1>🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Pal Chatbot</h1>
      <h3>Yer wee chatbot pal ready tae chat ower a wee dram! 🥃</h3>
      <p>Try selling 'hello', 'who are you?', or 'tell me a fact'. </p>
      <p>Anything else and yer pal might respond in scottish nonsense.</p>

      <div className="message-container">
        {/* Render each message in the messages array */}
        {/* I'm doing a map over the messages array to create a div for each message */}
        {/* And then the other key aspect is, I'm aligning the text based on who the sender is */}

        {messages.map((m, i) => (
          <div className="message"
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <strong>{m.sender === "user" ? "You" : "Angus"}:</strong> {m.text}
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-box"
        />
        <button onClick={sendMessage}>
          Send
        </button>
      </div>
      
      <p>Angus is: {apiHealth}</p>
      <button onClick={() => setMessages([])}>
          clear chat
        </button>
      <h4>Select a pure crackin' API Mode:</h4>
      <label>
        <input
          type="radio"
          name="apiMode"
          value="legacy"
          checked={apiMode === "legacy"}
          onChange={(e) => setApiMode(e.target.value)}
        />
        Leegacy
      </label>

      <label>
        <input
          type="radio"
          name="apiMode"
          value="advanced"
          checked={apiMode === "advanced"}
          onChange={(e) => setApiMode(e.target.value)}
        />
        Advan'dced
      </label>
          

    </div>
    {apiHealth === "Around and ready!" && (
  <img
    src={angus}
    alt="Scottish Chatbot"
    className="angus"
    style={{ width: "20em", marginTop: 20, borderRadius: 8 }}
  />
)}
    </div>

  );
}

export default App;
