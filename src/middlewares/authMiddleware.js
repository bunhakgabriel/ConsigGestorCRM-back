import admin from "../config/firebaseAdmin.js";
import { AppError } from "../utils/AppError.js";

export const allowedEmails = [
    "gabrielbunhak70@gmail.com",
];

export default async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token não informado!', 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;

        if (!allowedEmails.includes(decodedToken.email)) {
            throw new AppError("Acesso não autorizado!", 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}