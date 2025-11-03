import { Router } from "express";
import gameController from "../controllers/gameController.js";

const gameRouter = Router();

gameRouter.get("/", gameController.getAllGames);
gameRouter.get("/:id", gameController.getGameById);

export default gameRouter;
