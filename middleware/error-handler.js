const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. try again later",
  };

  //Input checker
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  //Email duplicate checker for REGISTER
  if (err.code && err.code === 11000) {
    customError.msg = `This ${Object.keys(
      err.keyValue
    )} is already taken. Please provide another one.`;
    customError.statusCode = 400;
  }
  //For cast error or more than/less than key
  if (err.name === "CastError") {
    customError.msg = `No job with id: ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
