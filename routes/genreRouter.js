import { Router } from "express";
import genreController from "../controllers/genreController.js";

const genreRouter = Router();

genreRouter.get("/", genreController.getAllGenres);
genreRouter.get("/:id", genreController.getGenreById);
genreRouter
  .route("/create")
  .get(genreController.getCreateGenre)
  .post(genreController.postCreateGenre);
genreRouter
  .route("/:id/update")
  .get(genreController.getUpdateGenre)
  .post(genreController.postUpdateGenre);

export default genreRouter;
