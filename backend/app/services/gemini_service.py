from typing import Optional
import re

import google.generativeai as genai

from app.config import get_settings

settings = get_settings()


def _client():
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")
    genai.configure(api_key=settings.gemini_api_key)
    return genai.GenerativeModel("gemini-2.5-flash")


def _contains_explicit_format_instruction(text: str) -> bool:
    if not text:
        return False
    # Detect phrases like: "in 4 lines", "4 lines", "in 3 sentences", "2 paragraphs", "one line"
    pattern = re.compile(r"\b(in\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(line|lines|sentence|sentences|paragraph|paragraphs)\b", re.I)
    if pattern.search(text):
        return True
    # Also accept explicit "use bullets" / "as bullet points" or "use paragraphs" instructions
    if re.search(r"\b(bullet|bullet points|bulleted|as bullets)\b", text, re.I):
        return True
    if re.search(r"\b(paragraph|paragraphs|sentences)\b", text, re.I):
        return True
    return False


def _extract_lines_from_text(text: str) -> Optional[int]:
    if not text:
        return None
    m = re.search(r"\b(in\s+)?(\d+)\s+lines?\b", text, re.I)
    if m:
        try:
            return int(m.group(2))
        except Exception:
            return None
    # words like 'one','two' etc.
    words = {
        'one': 1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10
    }
    m2 = re.search(r"\b(in\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+lines?\b", text, re.I)
    if m2:
        return words.get(m2.group(2).lower())
    return None


def generate_content(
    prompt: str,
    context: Optional[str] = None,
    document_type: str = "docx",
    side_heading: Optional[str] = None,
    lines_count: Optional[int] = None,
) -> str:
    client = _client()
    # Determine effective number of lines: priority -> explicit param -> prompt/context -> default
    effective_lines = None
    if lines_count and lines_count > 0:
        effective_lines = lines_count
    else:
        # try to extract from prompt or context
        effective_lines = _extract_lines_from_text(prompt) or _extract_lines_from_text(context or "")
    if not effective_lines:
        effective_lines = 4  # default when user does not specify

    header_prefix = f"Side heading: '{side_heading}'.\n" if side_heading else ""

    # Always produce plain lines (one per line) for both PPT and DOCX as requested
    compiled_prompt = (
        f"{header_prefix}Produce exactly {effective_lines} concise lines for the heading/context: '{prompt}'. "
        "Return plain lines separated by newlines. Do NOT use bullets, numbering, asterisks, or extra markup. "
        "Each line should be a self-contained sentence relevant to the heading/context."
    )
    if context:
        compiled_prompt += f"\nContext:\n{context}"

    response = client.generate_content(compiled_prompt)
    return response.text


def suggest_outline(document_type: str, main_topic: str, desired_sections: int) -> list[dict]:
    client = _client()
    prompt = (
        f"You are planning a {document_type} deliverable about '{main_topic}'. "
        f"Return exactly {desired_sections} JSON objects with 'title' and 'element_type' keys. "
        "Use 'section' for Word docs and 'slide' for decks."
    )
    response = client.generate_content(prompt)
    try:
        import json

        parsed = json.loads(response.text)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        pass
    fallback_type = "section" if document_type == "docx" else "slide"
    return [
        {
            "title": f"{main_topic} - {fallback_type.capitalize()} {idx+1}",
            "element_type": fallback_type,
        }
        for idx in range(desired_sections)
    ]


