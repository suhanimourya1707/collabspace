import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

PROMPT_TEMPLATE = """You are a project management assistant. Based on the following project goal or meeting notes, generate a list of clear, actionable tasks.

Input:
{input_text}

Return ONLY valid JSON in this exact format, no markdown formatting, no explanation text:
{{"tasks": [{{"title": "short task title", "description": "1-2 sentence description"}}]}}

Generate between 3 and 8 tasks."""

def generate_tasks(prompt_text: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set on the server")
    genai.configure(api_key=api_key)

    model = genai.GenerativeModel("gemini-2.0-flash")
    full_prompt = PROMPT_TEMPLATE.format(input_text=prompt_text)
    try:
        response = model.generate_content(
            full_prompt,
            generation_config={"response_mime_type": "application/json"},
        )
    except Exception as e:
        raise RuntimeError(f"Gemini API call failed: {e}")

    try:
        data = json.loads(response.text)
        return data.get("tasks", [])
    except (json.JSONDecodeError, AttributeError, ValueError) as e:
        raise RuntimeError(f"Could not parse Gemini response: {e}")