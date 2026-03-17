class Request {
  constructor(defaultHeaders = {}) {
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders
    };
  }

  async #send(url, method = "GET", data = null) {
    const options = {
      method,
      headers: this.defaultHeaders
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (response.status === 404) {
      return null;
    }

    return response.json();
  }

  async get(url) {
    return this.#send(url, "GET");
  }

  async post(url, data) {
    return this.#send(url, "POST", data);
  }

  async put(url, data) {
    return this.#send(url, "PUT", data);
  }

  async delete(url) {
    return this.#send(url, "DELETE");
  }
}

export default Request;