export class CircuitBreaker {
  constructor(threshold = 3, timeout = 10000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = "CLOSED"; // CLOSED | OPEN | HALF
    this.lastFailureTime = null;
  }

  async exec(fn) {
    if (this.state === "OPEN") {
      const now = Date.now();

      if (now - this.lastFailureTime > this.timeout) {
        this.state = "HALF";
      } else {
        throw new Error("Circuit OPEN - service unavailable");
      }
    }

    try {
      const result = await fn();

      this.reset();
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }
}