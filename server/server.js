/**
 * Simple Express server for Scottish Pal Chatbot
 * Listens for POST requests at /api/message
 * Responds with predefined silly Scottish responses or jumbled text
 * 
 * THIS IS A BASIC EXAMPLE SERVER FOR DEMONSTRATION PURPOSES ONLY
 * You should not have all these responses hardcoded in a real app
 * In a real app you would have more complex logic or call an AI API
 * 
 * You would also have server.js split into multiple files for maintainability
 * This is kept simple for clarity in this example
 * 
 * You should have controllers, routes, services, and possibly a database
 * 
 * AUTHOR: Benjamin Gorman
 */

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

const angusPersonality = JSON.parse(fs.readFileSync("data/angus.json", "utf8"));
app.locals.angusPersonality = angusPersonality;

console.log(app.locals.angusPersonality);

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api", chatRoutes);

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});