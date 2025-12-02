export function parseMessage(req, res, next) {
const { text } = req.body;
req.trimmedMessage = text.toLowerCase().trim();
next();
}