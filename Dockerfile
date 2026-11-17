# syntax=docker/dockerfile:1.7

FROM node:16-bullseye-slim AS frontend-build
WORKDIR /src/frontend
COPY FrontEnd/tarkov-gunsmith/package.json FrontEnd/tarkov-gunsmith/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY FrontEnd/tarkov-gunsmith/ ./
ENV REACT_APP_WISHGRANTER_API_URL=""
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build
WORKDIR /src
COPY BackEnd/WishGranter/ ./
ARG GITHUB_PACKAGES_USER
RUN --mount=type=secret,id=github_token,target=/run/secrets/github_token,required=false \
    set -eu; \
    token=""; \
    if [ -f /run/secrets/github_token ]; then token="$(cat /run/secrets/github_token)"; fi; \
    if [ -n "$token" ]; then \
      if [ -z "${GITHUB_PACKAGES_USER:-}" ]; then \
        echo "Set GITHUB_PACKAGES_USER when supplying the GitHub Packages token." >&2; \
        exit 1; \
      fi; \
      dotnet nuget add source "https://nuget.pkg.github.com/Xerxes-17/index.json" \
        --name github-packages \
        --username "$GITHUB_PACKAGES_USER" \
        --password "$token" \
        --store-password-in-clear-text; \
    fi; \
    dotnet restore ./WishGranter.csproj; \
    dotnet publish ./WishGranter.csproj --configuration Release --no-restore --output /app/publish; \
    rm -f /root/.nuget/NuGet/NuGet.Config

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS app
WORKDIR /app
COPY --from=backend-build /app/publish/ ./
COPY --from=frontend-build /src/frontend/build/ ./wwwroot/
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "WishGranter.dll"]
