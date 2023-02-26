# bloglistApp

## BloglistApp TODO
- Noden asennus koneelle
- node -v

### Frontti sovellus
*
- Frontin repo luonti
- Luodan react-sovellus
    - npx create-react-app sovelluksen-nimi
    - package.json: "start": "node index.js",
- React sovelluksen conffaus
    - Turhien tiedostojen poisto src-kansiosta
    - index.js: siistiminen
    - app.js: Hello World
- ESLintin conffaus
    - npm install --save-dev eslint-plugin-react
    - package.js: "lint": "eslint ."
    - .eslintrc.js
    - .eslintignore
- Luodaan kovakoodattu data
    - db.json
- useStaten käyttöönotto
    - import { useState } from 'react'
- JSON Serverin käyttöönotto
    - db.json
    - väliaikainen ratkaisu: npx json-server --port=3001 --watch db.json
    - npm install json-server --save-dev
    - package.json: "server": "json-server -p3001 --watch db.json",
    - npm run server
- Axios käyttöönotto
    - selaimen ja palvelimen väliseen kommunikointiin
    - npm install axios
    - services/files.js: import axios from 'axios'
- Blogilistan näyttäminen
- Blogin lisääminen listalle
- Blogin äänestäminen
- Blogin poistaminen listalta
- Tyylien lisääminen
- Ilmoitusten näyttäminen
- Virheenkäsittely
***
- Frontin buildaus
    - npm run build
- Frontin buildaus bäkkäriin
    - cp -r build ../bäkkärin-kansio
    - const baseUrl = '/api/notes'
*** **
- Proxyn käyttöönotto
    - "proxy": "http://localhost:3001"

- Validaatioiden virheilmoitukset frontissa

### Backend sovellus
**
- Backend repon luonti
- Luodaan node-sovellus
    - npm init
    - index.js: `console.log('hello world')`
    - node index.js
    - package.json konffaus
    - npm start
- Expressin käyttöönotto
    - npm install express
    - .gitignore node_modules
- Nodemonin käyttöönotto
    - npm install --save-dev nodemon
    - package.json: `"dev": "nodemon index.js",`
    - npm run dev
- Kovakoodatun datan määrittely
  - Data JS olioon
- HTTP pyyntöjen määrittely 
  - HTTP GET all json data
  - HTTP GET :id json data (huom! muuttuja id on merkkijono ja olion id numero)
  - HTTP DELETE 
- Rest-client testien käyttöönotto
    - asenna Rest Client plugari VSCodeen
    - requests/get_all_files.rest: GET http://localhost:3001/api/notes/
- Datan vastaanottaminen
  - json-parseri käyttöön: `app.use(express.json())`
  - HTTP POST-pyyntö
- ???
- Cors middleware käyttöönotto
    - npm install cors
    - app.js: middwaren käyttöönotto
- requestLoggerin käyttöönotto
- Error handlerin käyttöönotto
- Oteaan ympäristömuuttujassa määritelty portti käyttöön
  - `const PORT = process.env.PORT || 3001`
- Herokun setuppaus
    - [herokun asennus ympäristöön](https://devcenter.heroku.com/articles/heroku-cli)
    - `heroku login`
    - Procfilen luonti: `web: npm start`
    - `heroku create`
    - `git push heroku main`
    - `heroku ps:scale web=1`
    - `heroku open`

- Konsolin tulostelu
    - utils/logger.js: info & error
- Web-palvelimen määrittely
    - index.js: sovelluksen käynnistys
    - app.js: logger.info('hello world')
- ESLintin käyttöönotto
    - npm install eslint --save-dev
    - npx eslint --init
    - .eslintignore: build
    - Visual Studion ESLint-plugin
- ESLint konffaus
    - .eslintrc.js
    - npx eslint index.js
    - package.json: "lint": "eslint ."
    - npm run lint
- Tietojen näyttäminen
    - controllers/files.js: GET All
    - app.js: route middlewaren käyttöönotto
    - files.js: GET ID
    - utils/middleware.js: virheidenhallinta

- Tiedon poistaminen
    - files.js: DELETE ID
    - delete_file.rest
- Tiedon lisääminen
    - files.js: POST
    - get_file.rest
- Morgan middlewaren käyttöönotto
    - sovelluksen loggauksen käyttöönotto
    - app.js: middwaren käyttöönotto

- Herokun setuppaus
    - Procfilen luonti: web: npm start
    - heroku create
- Backend tuotantoon
    - git push heroku main
    - heroku logs -t

- Tiedon muuttaminen
    - files.js: PUT
*** *
- Frontin käyttöönotto bäkkärissä
    - app.use(express.static('build'))
- Fullstack sovellus tuotantoon
- Pipelinen käyttöönotto
    - "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
    - "deploy": "git push heroku main",
    - "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",    
    - "logs:prod": "heroku logs --tail"
    - npm run deploy:full
- Debuggaus Chromessa
    - node --inspect index.js
*** **
- MongoDB setuppaus
    - npm install mongoose
    - app.js: 
    - Heroku config vars: MONGODB_URI & PORT
- Mongoosen ja tietokannan käyttöönotto
    - npm install mongoose
    - app.js: DB yhteyden muodostus
    - models/file.js: Scheman luonti
    - node file.js salasana
    - MongoDB version piilotus????
- DotEnv käyttöönotto
    - .env: MongoDB:n konffit
    - .gitignore: .env
- Routet käyttämään tietokantaa
    - GET All
    - GET ID
    - POST
    - DELETE
    - PUT

- Mongoose validaatiot
    - skeeman määritys
    - PUT findOneAndUpdate validointi
- Tietokantaversio tuotantoon

## Node sovelluksen rakenne
- Node sovelluksen rakenne
    + index.js -> sovelluksen käynnistys
    + app.js -> sovelluslogiikka, middlewarejen käyttöönotto, DB yhteyden muodostus
    - build
        - ...
    - node_modules
        - ...
    + controllers
        - files.js -> routejen tapahtumakäsittelijät (middleware)
    + models
        - file.js -> tietokanta skeeman ja validaatiot
    + utils
        - logger.js -> konsoliin tulostamisen
        - config.js -> ympäristömuuttujien käsittely
        - middleware.js -> diy middlewaret esim. virheidenhallinta
    + requests
        - get_all_files.rest
        - create_file.rest
        - delete_file.rest
    + package.json
    - .gitignore
    - .eslintignore -> tyylien määrittely
    - .env -> tietokantaan kirjautuminen
    - .eslintrc.js
    - Procfile
    + README.md