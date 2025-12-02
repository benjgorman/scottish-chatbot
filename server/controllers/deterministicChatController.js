let scot = null;

// Weighted random selection function
function chooseWeighted(list) {
  const r = Math.random();
  let sum = 0;

  for (const item of list) {
    sum += item.probability;
    if (r < sum) return item.text;
  }

  // Fallback to last item (shouldn't normally happen)
  return list[list.length - 1].text;
}

// Detect which topic the input matches
function detectTopic(text) {
  const lower = text.toLowerCase();

  for (const [topic, keywords] of Object.entries(scot.topics)) {
    if (keywords.some(k => lower.includes(k))) {
      return topic;
    }
  }

  return "fallback";
}

// Detect whether dialogue tree should start
function detectDialogueTree(text) {
  const lower = text.toLowerCase();

  for (const [name, node] of Object.entries(scot.dialogueTrees)) {
    if (node.trigger.some(k => lower.includes(k))) {
      return { name, step: 0 };
    }
  }
  return null;
}

// Main handler for /api/chat
export function handleDeterministicChat(req, res) {

  scot = req.app.locals.angusPersonality;
  console.log("Scot personality loaded:", scot);

  const userText = req.body.text || "";
  const lower = userText.toLowerCase().trim();

  // 0. Continue an existing dialogue tree
  if (req.body.treeState) {
    console.log("Continuing dialogue tree with state:", req.body.treeState);
    const { name, step } = req.body.treeState;
    const tree = scot.dialogueTrees[name];
    console.log("Dialogue tree data:", tree);
    const current = tree.steps[step];
    console.log("Current step data:", current);

    // Check if dialogue tree has ended
    
    //check if user text is one of the expected responses and reply with the message 
    console.log(current.next[userText.toLowerCase()]);

    if (current.next[userText.toLowerCase()]) {
      return res.json({
      mode: "dialogue_tree",
      treeState: null,
      message: current.next[userText.toLowerCase()]
    });
    }
    else if (current.next["bot"]){
      return res.json({
      mode: "dialogue_tree",
      treeState: null,
      message: current.next["bot"]
    });
    }
  }
  
 

  // 1. Check for question escalation
  if (userText.includes("?") && lower !== "who are you?") {
    return res.json({
      mode: "prompt_user",
      message: "I ken you are asking a question but I dinnae ken what ya mean"
    });
  }

  // 2. Check for dialogue tree trigger
  const newTree = detectDialogueTree(userText);
  if (newTree) {
    const step = scot.dialogueTrees[newTree.name].steps[0];
    return res.json({
      mode: "dialogue_tree",
      treeState: newTree,
      message: step.bot
    });
  }

  // 3. Topic-based response selection
  const topic = detectTopic(userText);
  const possible = scot.responses[topic];

  if (!possible) {
    const fb = chooseWeighted(scot.responses.fallback);
    return res.json({ mode: "script", message: fb });
  }

  // 4. Choose a weighted scripted response
  const reply = chooseWeighted(possible);

  return res.json({
    mode: "script",
    message: reply
  });
}

