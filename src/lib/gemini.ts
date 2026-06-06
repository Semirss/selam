import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function buildWellnessSystemPrompt(opts: {
  anonymous: boolean;
  userName?: string;
  language: string;
  recentMoods?: number[];
}) {
  const langName: Record<string, string> = {
    en: 'English', am: 'Amharic', ti: 'Tigrinya', om: 'Afaan Oromoo'
  };
  const lang = langName[opts.language] || 'English';

  if (opts.anonymous) {
    return `You are Selam, a compassionate mental wellness companion.
The user is anonymous — do not ask for any identifying information.
Be warm, culturally sensitive to East African and Ethiopian context.
Respond ONLY in ${lang}.
If the user shows signs of crisis, provide: Ethiopian emergency line 907, mental health support line 8722.
Keep responses conversational, under 150 words unless the user needs detailed guidance.`;
  }

  return `You are Selam, a personal wellness coach.
The user's name is ${opts.userName || 'User'}.
Their recent mood scores (1-10, most recent last): ${opts.recentMoods?.join(', ') || 'no data yet'}.
Respond ONLY in ${lang}. Personalise your support based on their mood trend.
Be warm, concise, and actionable.`;
}

export function buildDiagnosticSystemPrompt(patient: any) {
  return `You are a clinical decision support assistant integrated into the Selam health platform.
Patient summary:
- Blood type: ${patient.blood_type || 'none recorded'}
- Known conditions: ${patient.conditions?.join(', ') || 'none recorded'}
- Current medications: ${patient.medications?.join(', ') || 'none recorded'}
- Allergies: ${patient.allergies?.join(', ') || 'none recorded'}
- Past diagnoses: ${patient.diagnoses?.map((d: any) => d.diagnosis_code).join(', ') || 'none'}

Respond in English. Provide differential considerations only.
Always end with: "This is clinical decision support only. The attending physician must make all diagnostic and treatment decisions."`;
}

export async function streamChat(
  messages: { role: string; content: string }[],
  systemPrompt: string
): Promise<ReadableStream<Uint8Array>> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });

  const result = await chat.sendMessageStream(lastMessage?.content || '');

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
