import express from "express";

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

app.get("/", (req, res) => {
  res.end("HI");
});

app.listen(PORT, (req, res) => {
  console.log(`App is listening on PORT: ${PORT}`);
});
