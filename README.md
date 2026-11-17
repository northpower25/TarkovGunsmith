# TarkovGunsmith

## Self-host with Docker

The root `Dockerfile` builds and serves the React frontend. By default, the browser sends API requests to the official `https://api.tarkovgunsmith.com` API. No backend or GitHub Packages token is needed in the container.

```sh
docker build -t tarkov-gunsmith .
docker run --rm -p 8080:8080 tarkov-gunsmith
```

Open `http://localhost:8080`. For public access, put a TLS-enabled reverse proxy in front of the container.

The official API receives your calculation inputs, and the app depends on its availability, CORS policy and terms of use. To use a different compatible API, rebuild the image with `--build-arg REACT_APP_WISHGRANTER_API_URL=https://your-api.example`. The URL is embedded at build time; changing container environment variables at runtime will not change it.

## GitHub Pages

Set the repository's Pages source to **GitHub Actions**. The Pages workflow builds the frontend with hash-based routing for the repository subpath and deploys it on pushes to `main` or `copilot/selfhost-single-container`. The deployed site uses the official API and is subject to the same availability and CORS limitations described above.

## Local development

1. In `FrontEnd/tarkov-gunsmith`, run `npm install`.
2. Set `REACT_APP_WISHGRANTER_API_URL` to the desired API URL when running `npm start`; `.env.development` otherwise selects the development API.
3. If running the backend locally, restore its GitHub Packages dependency and start it from `BackEnd/WishGranter` with `dotnet run --project WishGranter.csproj`. Set the frontend API URL to `http://localhost:5000`.

This project has a C# backend using the [Ratstash][ratstash] library with item data from [Escape from Tarkov][escape-from-tarkov] and [tarkov-api][tarkov-api].

The front end is functional React with TypeScript.

Come check out [the website][tarkovgunsmith] or [the discord][discord]

[tarkovgunsmith]: http:tarkovgunsmith.com
[discord]: https://discord.gg/F7GZE4H7fq
[tarkov-api]: https://github.com/the-hideout/tarkov-api
[escape-from-tarkov]: https://www.escapefromtarkov.com/
[ratstash]: https://github.com/RatScanner/RatStash
