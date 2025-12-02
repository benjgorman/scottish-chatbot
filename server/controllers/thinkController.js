import { scriptedResponses, jumbleText } from "../services/chatService.js";
import { askOpenAI } from "../services/openAIService.js";

export async function handleThink(req, res) {
    const { text } = req.body;
    const trimmedMessage = req.trimmedMessage;

    if (scriptedResponses[trimmedMessage]) 
    {
        return res.json({ message: scriptedResponses[trimmedMessage] });
    }

    if (text.includes("?")) {
        try 
        {
            //determine which AI to use based on environment variable
            const aiResponse = await askOpenAI(text);
            return res.json({ message: aiResponse });
        } 
        catch (err) 
        {
            console.error("Error calling OpenAI:", err);
            return res.json({ message: "Ach, somethin' went wrong talkin' tae the big AI brain." });

        }
    }

    return res.json({ message: jumbleText(text) });
}