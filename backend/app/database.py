import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def db_connect():
    # .envからDATABASE_URLを読み込む
    DATABASE_URL = os.environ['DATABASE_URL']


    engine = create_engine(
        DATABASE_URL,
        connect_args={"charset": "utf8mb4"}
    )
    
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)