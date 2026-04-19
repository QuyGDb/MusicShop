export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }

  // Helper check status
  isUnauthorized(): boolean { return this.status === 401; }
  isForbidden(): boolean    { return this.status === 403; }
  isNotFound(): boolean     { return this.status === 404; }
  isServerError(): boolean  { return this.status >= 500; }
}
