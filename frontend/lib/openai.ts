import { de } from "@faker-js/faker";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({ apiKey });
export default openai;
