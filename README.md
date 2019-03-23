# Big AL 3

## To start
Download or pull project from github

```
npm i
cd client
npm i
cd..
npm run dev
```

May need to install:

`npm install -g nodemon`

## Server Side Packages
**Express** - HTTP server

**CORS** - Middleware package that can is used to enable CORS with various options.

**excel4node** - used to generate Excel files for client to download

**passport** - used for easier access/security of user login system

**PG** - Easier to connect to Postgres Database

**Body-Parser** - Get data from form submits

**momentjs** - Used to easily format dates that helps with convert PG date to JS date

**request-promise** - API requests from the server

**nodemon** - instead of having to restart server manually to see file changes, restarts server automatically to see changes


## Client Side Packages
**React** - UI Framework

**React-bootstrap** - Bootstrap framework converted to work with React

**momentjs** - Used to easily format dates and compare dates for onscreen table creations

**react-dropzone** - drop images/video from user file system to upload to amazon s3 bucket

**rc-slider** - slider type input used to toggle dates to display for onscreen table

**glamor** - helps with styling a react component in the same files

**downloadjs** - gets data from client to submit to server to format a PDF file to be returned to client to download, in short this turns POST request into a DATA
