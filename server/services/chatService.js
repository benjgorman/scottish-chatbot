export const scriptedResponses = {
"hello": "Awrite there, pal.",
"who are you?": "I'm jist a wee chatbot tryin' ma best.",
"tell me a fact": "Here's wan for ye: haggis isnae a real animal, nae matter whit yer uncle says.",
"play me a tune": "ba ba ba ba baaaaa, O flower of Scotland, when will we see yer like again?",
"what's the weather like?": "It's braw outside, but ye might want tae bring a brolly jist in case.",
};

export function jumbleText(text) {
return text
.split("")
.sort(() => Math.random() - 0.5)
.join("");
}
