export default class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors: string[] = []) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message: string, errors: string[] = []) {
    return new ApiError(400, message, errors);
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Не авторизован');
  }

  static NotFound(message: string, errors: string[] = []) {
    return new ApiError(404, message, errors);
  }

  static Gone(message: string, errors: string[] = []) {
    return new ApiError(410, message, errors);
  }

  static ServerError(message: string, errors: string[] = []) {
    return new ApiError(500, message, errors);
  }
}
