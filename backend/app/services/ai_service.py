import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

PROMPT_TEMPLATE = """You are a project management assistant. Based on the following project goal or meeting notes, generate a list of clear, actionable tasks.

Input:
{input_text}

Return ONLY valid JSON in this exact format, no markdown formatting, no explanation text:
{{"tasks": [{{"title": "short task title", "description": "1-2 sentence description"}}]}}

Generate between 3 and 8 tasks."""

def generate_tasks(prompt_text: str):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set on the server")

    client = Groq(api_key=api_key)
    full_prompt = PROMPT_TEMPLATE.format(input_text=prompt_text)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": full_prompt}],
            response_format={"type": "json_object"},
        )
    except Exception as e:
        raise RuntimeError(f"Groq API call failed: {e}")

    try:
        data = json.loads(response.choices[0].message.content)
        return data.get("tasks", [])
    except (json.JSONDecodeError, AttributeError, ValueError, IndexError) as e:
        raise RuntimeError(f"Could not parse Groq response: {e}")
