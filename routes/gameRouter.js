import { Router } from "express";
import gameController from "../controllers/gameController.js";

const gameRouter = Router();

gameRouter.get("/", gameController.getAllGames);
gameRouter
  .route("/create")
  .get(gameController.getCreateGame)
  .post(gameController.postCreateGame);
gameRouter.get("/:id", gameController.getGameById);
gameRouter
  .route("/:id/update")
  .get(gameController.getUpdateGame)
  .post(gameController.postUpdateGame);

export default gameRouter;
