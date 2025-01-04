import Groq from "groq-sdk";

let GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const chatCompletion = await getGroqChatCompletion(message);

    return new Response(
      JSON.stringify(chatCompletion.choices[0]?.message?.content || ""),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred", { status: 500 });
  }
}

async function getGroqChatCompletion(message: string) {
  return groq.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "llama3-8b-8192",
  });
}
