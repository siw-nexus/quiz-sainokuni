# 共通の依存関係インストール
FROM node:24-alpine AS base
WORKDIR /app

# 依存関係の定義だけ先にコピーしてキャッシュを効かせる
COPY package.json package-lock.json* ./
RUN npm install

# ローカル開発用 (Nマークが出る)
FROM base AS development

COPY . .

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]


# 本番用資材の作成
FROM base AS builder

COPY . .

RUN npm run build

# --- 4. Production Runner Stage: EC2本番実行用 (Nマークが消える) ---
FROM node:24-alpine AS runner
WORKDIR /app

# 本番環境であることを明示
ENV NODE_ENV=production

# ビルド済みの成果物と、実行に必要な最小限のファイルだけをbuilderからコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 本番用サーバーを起動
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]