import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import genreRouter from "./routes/genreRouter.js";
import gameRouter from "./routes/gameRouter.js";
import developerRouter from "./routes/developerRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();

// TODO:
// Games table
//  - id
//  - title
//  - ? genres
//  - studio
//  - release date
//  - price
// Dev studio table
//  - id
//  - name
// Genre table
//  - id
//  - name
// Many to many relationship:
//  - Justion table, i.e. GameGenre(gameId, genreId)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/genres", genreRouter);
app.use("/games", gameRouter);
app.use("/developers", developerRouter);

app.listen(PORT, (req, res) => {
  console.log(`App is listening on PORT: ${PORT}`);
});
