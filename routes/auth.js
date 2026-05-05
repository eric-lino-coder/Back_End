import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// CRUD Routes
router.post("/login", authController.login); // CREATE
router.post("/logout", authController.logout); // DELETE

export default router;
