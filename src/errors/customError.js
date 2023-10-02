export default class CustomError {

  static createError({ name, cause, message, code }) {
    const error = Error(message, { cause });
    error.name = name;
    error.code = code;
    throw error;
  }

}


