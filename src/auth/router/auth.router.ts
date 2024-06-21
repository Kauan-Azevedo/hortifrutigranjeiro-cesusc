import express from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../services/auth.service";

const router = express.Router();
const authService = new AuthService(); // Instanciando o serviço
const authController = new AuthController(authService);

/**
 * @swagger
 * components:
 *   requestBodies:
 *     AuthBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *   responses:
 *     AuthResponse:
 *       description: A auth object
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 */

/**
 * @swagger
 *  /auth/login:
 *      post:
 *          summary: Faz login de um usuário
 *          requestBody:
 *              $ref: '#/components/requestBodies/AuthBody'
 *          responses:
 *              200:
 *                  $ref: '#/components/responses/AuthResponse'
 *              401:
 *                  $ref: '#/components/responses/Invalid'
 * */
router.post("/login", authController.login.bind(authController));

export default router;