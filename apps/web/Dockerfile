# Dockerfile cho apps/web — build từ THƯ MỤC GỐC dự án (context: .)
# vì đây là monorepo (apps/web phụ thuộc packages/shared)
FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build -w apps/web

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npm", "start"]
