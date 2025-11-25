"""
Database initialization script.
Creates the database and tables if they don't exist.
Run this once before starting the application.
"""

import pymysql
from pymysql import Error as MySQLError

from app.config import get_settings
from app.database.connection import Base, engine

settings = get_settings()


def create_database():
    """Create the database if it doesn't exist."""
    # Parse the database URL
    # Format: mysql+pymysql://username:password@host:port/database
    from sqlalchemy.engine.url import make_url

    url = make_url(settings.database_url)

    connection = None
    try:
        # Connect to MySQL server without specifying a database
        connection = pymysql.connect(
            host=url.host or "localhost",
            port=url.port or 3306,
            user=url.username or "root",
            password=url.password or "",
        )
        cursor = connection.cursor()

        # Create the database if it doesn't exist
        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS `{settings.database_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
        print(f"✓ Database '{settings.database_name}' ready")

        cursor.close()
        connection.close()
        connection = None

        # Now create tables
        Base.metadata.create_all(bind=engine)
        print("✓ All tables created successfully")

    except MySQLError as e:
        print(f"✗ Error creating database: {e}")
        raise
    finally:
        if connection:
            connection.close()


if __name__ == "__main__":
    print("Initializing database...")
    create_database()
    print("✓ Database initialization complete")
