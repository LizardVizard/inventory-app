import { Router } from "express";
import developerController from "../controllers/developerController.js";

const developerRouter = Router();

developerRouter.get("/", developerController.getAllDevelopers);
developerRouter
  .route("/create")
  .get(developerController.getCreateDeveloper)
  .post(developerController.postCreateDeveloper);
developerRouter.get("/:id", developerController.getDeveloperById);

export default developerRouter;
