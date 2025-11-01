import { Router } from "express";
import developerController from "../controllers/developerController.js";

const developerRouter = Router();

developerRouter.get("/:id", developerController.getDeveloperById);

export default developerRouter;
