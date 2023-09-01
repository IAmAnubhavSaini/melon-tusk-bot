# embedchain-showcase

A very basic application to showcase the use of the [embedchain](https://github.com/embedchain/embedchain) library.

First, `export OPENAI_API_KEY=YOUR_API_KEY` in your terminal.

docker-compose can read `.env` files, but we are using Dockerfile.

## Building images

```bash

## server
cd server
docker build -t melon-tusk-server --build-arg OPENAI_API_KEY=$OPENAI_API_KEY .
## the build-arg is not needed if you are using -e to override it later.

## client
cd client
docker build -t melon-tusk-client .

```

## Running containers

```bash

## server
docker run  --rm -e "OPENAI_API_KEY=$OPENAI_API_KEY" -p5000:5000 melon-tusk-server

## client
docker run --rm -p3000:3000 melon-tusk-client

```

## Known issues

1. OpenAI API key was not working properly at the time of publishing this repo.
   1. So, if source has not been updated then it means, it might not work properly.
2. The server is not using any database, so it will not persist any data.
3. The client docker image is created in dev mode, this is because it was not working in production mode.
   1. NextJS and `node server.js` didn't work properly.
   2. Couldn't get `withDocker` example to work.
4. The UI is bare-bones.
5. The files (pdf, and txt) do get uploaded to flask server.
6. It is an incomplete example that was built within 4 hours, and most time went to dockerizing the app.
