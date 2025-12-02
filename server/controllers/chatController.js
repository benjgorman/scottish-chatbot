import { scriptedResponses, jumbleText } from "../services/chatService.js";
import { askOpenAI } from "../services/openAIService.js";

export async function handleMessage(req, res) {
    const { text } = req.body;
    const trimmedMessage = req.trimmedMessage;

    if (scriptedResponses[trimmedMessage]) 
    {
        return res.json({ message: scriptedResponses[trimmedMessage] });
    }

    if (text.includes("?")) {
        try 
        {
            //check if any swear words are present
            // If so, return a humorous response instead of calling OpenAI
            const swearWords = ["damn", "hell", "shit", "fuck"];
            const containsSwear = swearWords.some((word) =>
                text.toLowerCase().includes(word)
            );
            
            if (containsSwear) {
                return res.json({ message: "Whoa there! Mind yer language, pal!" });
            }
            else
            {
                const aiResponse = await askOpenAI(text);

                return res.json({ message: aiResponse });
            
            }
        } 
        catch (err) 
        {
            console.error("Error calling OpenAI:", err);
            return res.json({ message: "Ach, somethin' went wrong talkin' tae the big AI brain." });

        }
    }

    return res.json({ message: jumbleText(text) });
}