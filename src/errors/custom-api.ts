class CustomAPIError extends Error {
    errors?: {
      item?: {
        message?: string;
      };
    };
    code?: number;
    keyValue?: object;
    value?: string;
  
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export default CustomAPIError;