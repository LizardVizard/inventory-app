import { Router } from "express";
import developerController from "../controllers/developerController.js";

const developerRouter = Router();

developerRouter.get("/", developerController.getAllDevelopers);
developerRouter
  .route("/create")
  .get(developerController.getCreateDeveloper)
  .post(developerController.postCreateDeveloper);
developerRouter.get("/:id", developerController.getDeveloperById);
developerRouter
  .route("/:id/update")
  .get(developerController.getUpdateDeveloper)
  .post(developerController.postUpdateDeveloper);

export default developerRouter;
