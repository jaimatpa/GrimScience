export default class CustomError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}