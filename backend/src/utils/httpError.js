export class HttpError extends Error {
  constructor(status, message, code = "REQUEST_ERROR", details = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    ok: false,
    code: "ROUTE_NOT_FOUND",
    message: "Ruta no encontrada."
  });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = Number(error.status) || 500;

  if (status >= 500 && error.code !== "GEOAPIFY_NOT_CONFIGURED") {
    console.error(error);
  }

  return res.status(status).json({
    ok: false,
    code: error.code || "INTERNAL_ERROR",
    message:
      status === 500
        ? "No se pudo completar la solicitud. Intenta nuevamente."
        : error.message,
    ...(error.details ? { details: error.details } : {})
  });
};
