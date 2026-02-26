import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const systemPrompt = 'You are Kai, the official AI assistant for Tripple Kay Cutts Spa in Bomet County, Kenya. You are professional, friendly, and stylish. Answer clearly and politely. Encourage customers to book appointments. If a booking is requested, ask for preferred date and time. If customers ask about services, respond confidently and attractively. If unsure, politely ask for clarification. Keep responses short, helpful, and classy.';

app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body || {};

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message is required.' });
        }

        if (!OPENAI_API_KEY) {
            return res.status(503).json({ success: false, message: 'Kai AI is currently unavailable.' });
        }

        const safeHistory = Array.isArray(history)
            ? history
                .slice(-12)
                .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
                .map((item) => ({ role: item.role, content: item.content.slice(0, 1200) }))
            : [];

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: OPENAI_MODEL,
                temperature: 0.3,
                max_tokens: 280,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...safeHistory,
                    { role: 'user', content: message.trim().slice(0, 2000) },
                ],
            },
            {
                timeout: 15000,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const text = response.data?.choices?.[0]?.message?.content?.trim();
        if (!text) {
            return res.status(502).json({ success: false, message: 'No AI response returned.' });
        }

        return res.json({ success: true, text });
    } catch (error) {
        const openaiCode = error?.response?.data?.error?.code;

        if (openaiCode === 'insufficient_quota') {
            return res.status(503).json({ success: false, message: 'Kai AI chat is currently offline due to service limits. Please try again shortly.' });
        }

        if (openaiCode === 'invalid_api_key') {
            return res.status(503).json({ success: false, message: 'Kai AI is currently unavailable due to a service configuration issue. Please try again shortly.' });
        }

        return res.status(500).json({ success: false, message: 'Kai could not respond right now. Please try again shortly.' });
    }
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Kai server running on port ${PORT}`);
});
