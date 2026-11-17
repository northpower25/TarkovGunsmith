FROM node:16-bullseye-slim AS frontend-build
WORKDIR /src/frontend
COPY FrontEnd/tarkov-gunsmith/package.json FrontEnd/tarkov-gunsmith/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY FrontEnd/tarkov-gunsmith/ ./
ARG REACT_APP_WISHGRANTER_API_URL=https://api.tarkovgunsmith.com
ENV REACT_APP_WISHGRANTER_API_URL=$REACT_APP_WISHGRANTER_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /src/frontend/build/ /usr/share/nginx/html/
EXPOSE 8080
