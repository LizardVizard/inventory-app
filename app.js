import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import genreRouter from "./routes/genreRouter.js";
import gameRouter from "./routes/gameRouter.js";
import developerRouter from "./routes/developerRouter.js";
import indexRouter from "./routes/indexRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsPath = path.join(__dirname, "public");

const PORT = process.env.PORT || 3000;

const app = express();

// TODO:
// Games table
//  - ? price
// Other:
//  - add view all to games and devs
//  - CRUD actions
//    - how to handle input fields
//    - how to send data
//  - index view has first 5 items,
//    for games by release date, for developers by games developed,
//    for genres count of games
//  - delete functionality; how to handle items that depend on the item deleted
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/genres", genreRouter);
app.use("/games", gameRouter);
app.use("/developers", developerRouter);

app.listen(PORT, (req, res) => {
  console.log(`App is listening on PORT: ${PORT}`);
});
