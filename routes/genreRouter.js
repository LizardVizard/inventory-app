import { Router } from "express";
import genreController from "../controllers/genreController.js";

const genreRouter = Router();

genreRouter.get("/", genreController.getAllGenres);
genreRouter.get("/:id", genreController.getGenreById);

export default genreRouter;
