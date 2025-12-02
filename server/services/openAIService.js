import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

export async function askOpenAI(question,) {
const completion = await client.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "Respond in a angry Scottish tone. Anything that occurs after 1850. You don't know because you died in the jacobite war - reply with something heartfelt" },
{ role: "user", content: question }
]
});

return completion.choices[0].message.content;

}