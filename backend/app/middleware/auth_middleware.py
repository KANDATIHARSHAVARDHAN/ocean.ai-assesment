from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from jose import JWTError

from app.database.connection import SessionLocal
from app.services.auth_service import decode_access_token, get_user_by_email


class AuthMiddleware(BaseHTTPMiddleware):
    """Best-effort middleware to attach authenticated user to request.state."""

    async def dispatch(self, request: Request, call_next):
        token = _extract_token(request)
        if token:
            try:
                email = decode_access_token(token)
                with SessionLocal() as db:
                    user = get_user_by_email(db, email)
                    if user:
                        request.state.user = user
            except JWTError:
                request.state.user = None
        response = await call_next(request)
        return response


def _extract_token(request: Request) -> str | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    if not auth_header.startswith("Bearer "):
        return None
    return auth_header.split(" ", 1)[1]


