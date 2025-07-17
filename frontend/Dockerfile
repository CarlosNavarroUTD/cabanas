FROM node:18
WORKDIR /app
COPY . .
RUN npm install

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=https://api-cabanas.fly.dev/api


RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
