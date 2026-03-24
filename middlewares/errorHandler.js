import ApiResponse from "../src/api/ApiResponse.js";
import { AppError } from "../src/utils/AppError.js";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(false, null, err.message));
  }

  return res
    .status(500)
    .json(new ApiResponse(false, null, "Erro interno do servidor"));
}
