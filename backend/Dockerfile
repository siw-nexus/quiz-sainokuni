FROM python:3.12-slim

# nc (netcat) をインストール (DBの起動待ちで使用)
RUN apt-get update && \
    apt-get install -y netcat-traditional tzdata && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# entrypoint スクリプトをコピー
COPY ./entrypoint.sh /app/entrypoint.sh
# 実行権限を付与
RUN chmod +x /app/entrypoint.sh

COPY . .

# コンテナ起動時に entrypoint.sh を実行するよう設定
ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]