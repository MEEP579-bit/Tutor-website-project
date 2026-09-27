# Dockerfile cho apps/api — build từ THƯ MỤC GỐC dự án (context: .)
# vì đây là monorepo (apps/api có thể dùng chung packages/shared)
FROM node:20-alpine

WORKDIR /app

# Copy toàn bộ monorepo (đã lọc bớt qua .dockerignore ở thư mục gốc)
COPY . .

RUN npm install
RUN npm run prisma:generate -w apps/api
RUN npm run build -w apps/api

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/server.js"]
