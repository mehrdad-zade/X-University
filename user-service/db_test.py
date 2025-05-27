import os
from sqlalchemy import create_engine

# Always load .env to ensure DATABASE_URL is set correctly
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

db_url = os.getenv("DATABASE_URL", "postgresql://xuniv_user:xuniv_pass@localhost:5432/xuniversity")
print(f"Testing DB connection with: {db_url}")
engine = create_engine(db_url)
try:
    with engine.connect() as conn:
        conn.execute("SELECT 1")
    print("Manual DB connection: SUCCESS")
except Exception as e:
    print(f"Manual DB connection: FAILED\n{e}")
