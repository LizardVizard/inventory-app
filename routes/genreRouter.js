import { Router } from "express";
import genreController from "../controllers/genreController.js";

const genreRouter = Router();

genreRouter.get("/", genreController.getAllGenres);
genreRouter
  .route("/create")
  .get(genreController.getCreateGenre)
  .post(genreController.postCreateGenre);
genreRouter.get("/:id", genreController.getGenreById);
genreRouter
  .route("/:id/update")
  .get(genreController.getUpdateGenre)
  .post(genreController.postUpdateGenre);
genreRouter
  .route("/:id/delete")
  .get(genreController.getDeleteGenre)
  .post(genreController.postDeleteGenre);

export default genreRouter;
