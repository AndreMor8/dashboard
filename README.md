# Gidget's dashboard

Rewriting my bot's dashboard, separating the backend into a `/api` path, and using Vue.js for the front-end.

Well now I explain the thing

## Install vue-cli

`npm i -g @vue/cli`

## Build the app

Go to the frontend folder.

Install front-end dependencies with `npm i`

Run `npm run build` or `vue-cli-service build --no-clean`.

It is important to put `--no-clean` so that the original HTML structure is preserved.

## Install the backend dependencies

`npm i`

## Configure the backend .env with the correct data.

Soon an example of it.

## Run the backend

`npm start`

If you chose `SERVESTATIC = 'true'`, then just point to the correct port on your favorite web server.

Otherwise configure your server to always serve `index.html` from the public folder, and the paths with` / api` to the backend.