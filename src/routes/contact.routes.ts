import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  contactController,
  contactSchema,
} from "../controllers/contact.controller.js";

const router = Router();

router.post("/", validateRequest(contactSchema), contactController);

export default router;
