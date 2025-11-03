import { Router } from "express";
import genreController from "../controllers/genreController.js";

const genreRouter = Router();

genreRouter.get("/", genreController.getAllGenres);
genreRouter
  .route("/create")
  .get(genreController.getCreateGenre)
  .post(genreController.postCreateGenre);
genreRouter.get("/:id", genreController.getGenreById);

export default genreRouter;
