export function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    }
  };
}

export function nextCapture() {
  const calls = [];
  const next = (error) => calls.push(error || null);
  next.calls = calls;
  return next;
}

