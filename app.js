const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server Is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//Return list of movies

const convertDbObject = (objectItem) => {
  return {
    movie_id: objectItem.movie_id,
    director_id: objectItem.director_id,
    movie_name: objectItem.movie_name,
    lead_actor: objectItem.lead_actor,
  };
};
app.get("/movies/", async (request, response) => {
  const getMovieNames = `
    SELECT movie_name
    FROM movie;
    `;
  const movieNames = await db.get(getMovieNames);
  response.send(convertDbObject(movieNames));
});

app.post("/movies", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `
    INSERT INTO 
    movie(directorId, movieName, leadActor )
    values('${directorId}', '${movieName}', '${leadActor}');
    `;
  const createMovieResponse = await db.run(addMovieQuery);
  response.send(`Movie added successfully`);
});
module.exports = app;
