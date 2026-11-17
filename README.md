# TarkovGunsmith

## Self-host with Docker

The root `Dockerfile` builds the React frontend and .NET API into one image. The frontend calls the API on the same origin, so only one port needs to be exposed.

The API references a NuGet package from the `Xerxes-17` GitHub Packages feed. If you have access to that package, provide a GitHub token with `read:packages` permission and your GitHub username at build time:

```sh
read -rp "GitHub username: " GITHUB_PACKAGES_USER
read -rsp "GitHub Packages token: " GITHUB_PACKAGES_TOKEN
echo
export GITHUB_PACKAGES_USER GITHUB_PACKAGES_TOKEN
DOCKER_BUILDKIT=1 docker build \
  --build-arg GITHUB_PACKAGES_USER="$GITHUB_PACKAGES_USER" \
  --secret id=github_token,env=GITHUB_PACKAGES_TOKEN \
  -t tarkov-gunsmith .
```

The token is mounted as a BuildKit secret and is not included in the resulting image. If the NuGet package is publicly accessible, the image can be built without the token.

Run the app on port 8080:

```sh
docker run --rm -p 8080:8080 tarkov-gunsmith
```

Open `http://localhost:8080`. For public access, put a TLS-enabled reverse proxy in front of the container. No database volume is required by this app.
The backend currently targets .NET 6, which is out of support; avoid exposing it directly to the internet until the target framework is upgraded.

## Local development

1. In `FrontEnd/tarkov-gunsmith`, run `npm install`.
2. The frontend development server defaults to the API at `http://localhost:5000`; set `REACT_APP_WISHGRANTER_API_URL` to override it.
3. In `BackEnd/WishGranter`, run `dotnet restore WishGranter.csproj`, `dotnet build WishGranter.csproj`, and `dotnet run --project WishGranter.csproj`.
4. Start the frontend with `npm start`.

This project has a C# backend using the [Ratstash][ratstash] library with item data from [Escape from Tarkov][escape-from-tarkov] and [tarkov-api][tarkov-api].

The front end is functional React with TypeScript.

Come check out [the website][tarkovgunsmith] or [the discord][discord]

[tarkovgunsmith]: http:tarkovgunsmith.com
[discord]: https://discord.gg/F7GZE4H7fq
[tarkov-api]: https://github.com/the-hideout/tarkov-api
[escape-from-tarkov]: https://www.escapefromtarkov.com/
[ratstash]: https://github.com/RatScanner/RatStash
