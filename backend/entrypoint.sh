#!/bin/sh

# -e オプション: コマンドが失敗したらスクリプトを終了する
set -e

# DB_HOST と DB_PORT は docker-compose.yml から環境変数として渡される
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}

echo "Waiting for database at $DB_HOST:$DB_PORT..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 0.1
done

echo "Database started"

# 1. Alembic マイグレーションの実行
echo "Running database migrations..."
alembic upgrade head

# 2. シードデータの投入
echo "Seeding database"
python app/seed.py

# 3. Dockerfile の CMD で指定されたもの を実行
echo "Starting server..."
exec "$@"