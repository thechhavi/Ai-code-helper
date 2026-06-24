import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

def call_gemini(prompt: str) -> str:
    if not model:
        return f"[Mock Response] Gemini API Key is missing. Here is a simulated response to your request:\n\n{prompt}"
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred while calling the AI: {str(e)}"

def explain_code(code: str, language: str) -> str:
    prompt = f"Explain the following {language} code in simple human language. Keep it beginner-friendly:\n\n```{language}\n{code}\n```"
    return call_gemini(prompt)

def debug_code(code: str, language: str) -> str:
    prompt = f"Find possible errors and suggest fixes for the following {language} code. Keep it beginner-friendly:\n\n```{language}\n{code}\n```"
    return call_gemini(prompt)

def improve_code(code: str, language: str) -> str:
    prompt = f"Suggest an optimized and cleaner version of the following {language} code. Keep it beginner-friendly:\n\n```{language}\n{code}\n```"
    return call_gemini(prompt)
