import { Client } from "pg";
import { CONNECTION_SETTINGS } from "./pool.js";

const createGameTableQuery = `
CREATE TABLE IF NOT EXISTS games (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(512) NOT NULL,
developer_id INTEGER REFERENCES developers(id),
release_year INT
);`;

const createDeveloperTableQuery = `
CREATE TABLE IF NOT EXISTS developers (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR(512) UNIQUE,
country VARCHAR(255)
);`;

const createGenreTableQuery = `
CREATE TABLE IF NOT EXISTS genres (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR(512) UNIQUE
);`;

const createGameGenresTableQuery = `
CREATE TABLE IF NOT EXISTS game_genres (
game_id INTEGER REFERENCES games(id),
genre_id INTEGER REFERENCES genres(id),
PRIMARY KEY(game_id, genre_id)
);`;

const insertGenres = async (client) => {
  const insertIntoGenresQuery = `
INSERT INTO genres (name) VALUES
($1);`;

  const genres = [
    "Not defined genre",
    "Action",
    "Open World",
    "Role-Playing Game",
  ];

  for (const genre of genres) {
    client.query(insertIntoGenresQuery, [genre]);
  }
};

const insertDevelopers = async (client) => {
  const insertIntoDevelopersQuery = `
INSERT INTO developers (name, country) VALUES
($1, $2);`;

  const developers = [
    ["CD Project Red", "Poland"],
    ["FromSoftware", "Japan"],
    ["BioWare", "Canada"],
  ];

  await client.query(`INSERT INTO developers (name, country) VALUES
  ('Not defined developer', NULL)`);

  for (const [name, country] of developers) {
    await client.query(insertIntoDevelopersQuery, [name, country]);
  }
};

const insertGames = async (client) => {
  const insertIntoGamesQuery = `
INSERT INTO games(title, developer_id, release_year) VALUES
($1, $2, $3);`;

  const gamesValues = [
    ["Elden Ring", 3, 2022],
    ["Cyberpunk 2077", 2, 2020],
    ["Mass Effect", 4, 2007],
  ];

  for (const [title, developerId, releaseYear] of gamesValues) {
    await client.query(insertIntoGamesQuery, [title, developerId, releaseYear]);
  }
};

const insertGameGenres = async (client) => {
  const insertIntoGameGenresQuery = `
INSERT INTO game_genres (game_id, genre_id) VALUES
($1, $2);`;

  const gameGenres = [
    [1, 3],
    [2, 4],
    [2, 2],
    [3, 4],
  ];

  for (const [gameId, genreId] of gameGenres) {
    await client.query(insertIntoGameGenresQuery, [gameId, genreId]);
  }
};

async function main() {
  const client = new Client(CONNECTION_SETTINGS);
  await client.connect();

  try {
    await client.query(createDeveloperTableQuery);
    await client.query(createGenreTableQuery);
    await client.query(createGameTableQuery);
    await client.query(createGameGenresTableQuery);

    await insertDevelopers(client);
    await insertGenres(client);
    await insertGames(client);
    await insertGameGenres(client);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
}

main();
