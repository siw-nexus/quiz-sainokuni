import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# .envからDATABASE_URLを読み込む
DATABASE_URL = os.environ['DATABASE_URL']


engine = create_engine(
    DATABASE_URL,
    connect_args={"charset": "utf8mb4"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def db_connect():
    db = SessionLocal()
    
    try:
        yield db
    finally:
        db.close()