import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

function formatError(statusCode: number, defaultStatusPhrase: string) {
  return (
    message = defaultStatusPhrase,
    details = null,
    originalError = null
  ) => {
    const err: createError.HttpError<number> = createError(statusCode, message);

    err.toJSON = () => {
      const response = {
        statusCode: statusCode,
        error: {
          statusPhrase: defaultStatusPhrase,
          message: message,
          details: null,
        },
      };

      if (details) {
        response.error.details = details;
      }

      return response;
    };

    if (originalError) {
      err.originalError = originalError;
    }
    return err;
  };
}

// 400-409 Errors
const BadRequest = formatError(400, "Bad Request");
const Unauthorized = formatError(401, "Unauthorized");
const PaymentRequired = formatError(402, "Payment Required");
const Forbidden = formatError(403, "Forbidden");
const NotFound = formatError(404, "Not Found");
const MethodNotAllowed = formatError(405, "Method Not Allowed");
const NotAcceptable = formatError(406, "Not Acceptable");
const ProxyAuthenticationRequired = formatError(
  407,
  "Proxy Authentication Required"
);
const RequestTimeout = formatError(408, "Request Timeout");
const Conflict = formatError(409, "Conflict");
const InternalServerError = formatError(500, "Internal Server Error");
const CustomError = (statusCode: number, message: string) =>
  formatError(statusCode, message);

/**
 * @returns Error Handler Middlware
 */
const ExceptionHandler = () => {
  return (err: any, req: Request, res: Response, next: NextFunction): any => {
    let statusCode = 500;
    let message = "Something went wrong.";

    if (err.toJSON) {
      const errorResponse = err.toJSON();
      if (errorResponse.statusCode) {
        statusCode = errorResponse.statusCode;
      }
      if (errorResponse?.error?.message) {
        message = errorResponse.error.message;
      }
      return res.status(statusCode).json(errorResponse);
    }

    console.log("Error Log: ", err);
    return res.status(500).json({
      statusCode: 500,
      error: {
        statusPhrase: "Internal Server Error",
        message: "Something went wrong.",
      },
    });
  };
};

const HttpExceptions = {
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  ProxyAuthenticationRequired,
  RequestTimeout,
  Conflict,
  CustomError,
  ExceptionHandler,
  InternalServerError,
};

export default HttpExceptions;
