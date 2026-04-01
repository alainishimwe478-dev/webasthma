import { ASTHMA_CHAT_REFERENCE } from "../src/utils/asthmaKnowledgeBase.js";

const CHAT_ROUTE = "/api/chat";
const TTS_ROUTE = "/api/tts";

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const getPathname = (req) => {
  try {
    return new URL(req.url || "/", "http://localhost").pathname;
  } catch {
    return req.url || "/";
  }
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      try {
        resolve(rawBody ? JSON.parse(rawBody) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });

const buildOpenAIInput = (messages, userName) => {
  const input = messages.map((message) => ({
    role: message.sender === "user" ? "user" : "assistant",
    content: [{ type: "input_text", text: message.text }],
  }));

  input.unshift({
    role: "developer",
    content: [
      {
        type: "input_text",
        text:
          `You are Asthma Shield AI, a supportive asthma information assistant for ${userName}. ` +
          "Answer questions about asthma disease, symptoms, triggers, prevention, inhaler use, medications, environment, and when to seek urgent care. " +
          "Be clear, warm, and educational. Keep answers concise and practical. " +
          "Never claim to diagnose. For emergencies like severe trouble breathing, blue lips, or no relief from a rescue inhaler, tell the user to seek emergency care immediately. " +
          "Use the knowledge base below as the preferred factual guide when it is relevant, especially for Rwanda treatment costs and insurance context. " +
          "Do not mention internal policies.\n\n" +
          ASTHMA_CHAT_REFERENCE,
      },
    ],
  });

  return input;
};

export const createChatHandler = (env = process.env) => async (req, res) => {
  const pathname = getPathname(req);

  if (pathname === CHAT_ROUTE && req.method === "POST") {
    const apiKey = env.OPENAI_API_KEY;
    const model = env.OPENAI_MODEL || "gpt-5.2";

    if (!apiKey) {
      sendJson(res, 500, {
        error: "OPENAI_API_KEY is not configured on the server.",
      });
      return true;
    }

    try {
      const parsed = await readJsonBody(req);
      const messages = Array.isArray(parsed.messages)
        ? parsed.messages.slice(-12)
        : [];
      const userName = parsed.userName || "Patient";

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: buildOpenAIInput(messages, userName),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        sendJson(res, response.status, {
          error: data?.error?.message || "OpenAI request failed.",
        });
        return true;
      }

      sendJson(res, 200, {
        reply: data.output_text || "I could not generate a response right now.",
      });
    } catch (error) {
      sendJson(res, 500, {
        error: error.message || "Chat request failed.",
      });
    }

    return true;
  }

  if (pathname === TTS_ROUTE && req.method === "POST") {
    const apiKey = env.OPENAI_API_KEY;
    const ttsModel = env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
    const ttsVoice = env.OPENAI_TTS_VOICE || "alloy";

    if (!apiKey) {
      sendJson(res, 500, {
        error: "OPENAI_API_KEY is not configured on the server.",
      });
      return true;
    }

    try {
      const parsed = await readJsonBody(req);
      const text = String(parsed.text || "").trim();

      if (!text) {
        sendJson(res, 400, {
          error: "Text is required for speech generation.",
        });
        return true;
      }

      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: ttsModel,
          voice: ttsVoice,
          input: text.slice(0, 2000),
          instructions:
            "Speak clearly and warmly for a patient learning about asthma. This is AI-generated voice audio.",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedError = {};

        try {
          parsedError = errorText ? JSON.parse(errorText) : {};
        } catch {
          parsedError = {};
        }

        sendJson(res, response.status, {
          error: parsedError?.error?.message || errorText || "Speech generation failed.",
        });
        return true;
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      res.statusCode = 200;
      res.setHeader("Content-Type", "audio/mpeg");
      res.end(audioBuffer);
    } catch (error) {
      sendJson(res, 500, {
        error: error.message || "Speech generation failed.",
      });
    }

    return true;
  }

  {
    return false;
  }
};

export const createViteChatMiddleware = (env) => {
  const handleChat = createChatHandler(env);

  return async (req, res, next) => {
    try {
      const handled = await handleChat(req, res);
      if (!handled) {
        next();
      }
    } catch (error) {
      if (!res.writableEnded) {
        sendJson(res, 500, {
          error: error.message || "Chat request failed.",
        });
      }
    }
  };
};
