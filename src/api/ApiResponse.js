class ApiResponse {
  constructor(success, data, message, meta = null) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.meta = meta;
  }
}

export default ApiResponse;
