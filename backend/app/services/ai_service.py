import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT_TEMPLATE = """You are a project management assistant. Based on the following project goal or meeting notes, generate a list of clear, actionable tasks.

Input:
{input_text}

Return ONLY valid JSON in this exact format, no markdown formatting, no explanation text:
{{"tasks": [{{"title": "short task title", "description": "1-2 sentence description"}}]}}

Generate between 3 and 8 tasks."""

def generate_tasks(prompt_text: str):
    model = genai.GenerativeModel("gemini-2.0-flash")
    full_prompt = PROMPT_TEMPLATE.format(input_text=prompt_text)
    response = model.generate_content(
        full_prompt,
        generation_config={"response_mime_type": "application/json"},
    )
    try:
        data = json.loads(response.text)
        return data.get("tasks", [])
    except (json.JSONDecodeError, AttributeError, ValueError):
        return []