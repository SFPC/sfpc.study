# sfpc.study
This repo houses the code for the sfpc.study repo. Most of the code is served through a static site in the 'public' folder, some pages like sessions and classes are served via templates with routes defined in 'index.js' and templates in 'public/templates'. The site pulls in data from the sfpc notion, so can be updated that way.

Whenever there is a push to the main branch of this repo, the site will deploy to our digital ocean droplet.

To Set up:
- clone this repo into a folder.
- Get the .env file from Discord or Todd and put it in the root level of the directory
- cd into this folder and run `npm install` in the terminal
- run `npm start` 
- go to https://localhost:3000 in your browser
- template test currently at http://localhost:3000/sessions/spring-22/darkmatters
