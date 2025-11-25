import uvicorn
import sys

from app.config import get_settings

settings = get_settings()


def main():
    try:
        # Try to initialize database on startup
        from init_db import create_database
        print("Checking database...")
        create_database()
    except Exception as e:
        print(f"Warning: Could not initialize database: {e}")
        print("Please run 'python init_db.py' manually to set up the database.")
        sys.exit(1)

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.backend_port,
        reload=settings.debug,
    )


if __name__ == "__main__":
    main()


