import ApiResponse from "../api/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import { sqlConstraintMessages } from "../utils/sqlErrors.js";

export function errorHandler(err, _req, res, _next) {
  // Erros ja tratados
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(false, null, err.message));
  }

  // Erro de violação de unique do PostgreSQL
  if (err.code === "23505") {
    const message =
      sqlConstraintMessages[err.constraint] ||
      "Violação de chave única no banco de dados.";
    return res.status(400).json(new ApiResponse(false, null, message));
  }

  // Erro genérico
  return res
    .status(500)
    .json(new ApiResponse(false, null, "Erro interno do servidor"));
}
