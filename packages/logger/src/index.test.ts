// MindMark Logger Tests
// Test logging functionality

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { logger } from "./index";

describe("Logger", () => {
  let consoleSpy: any;

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
  });

  afterEach(() => {
    // Restore console methods
    console.log = consoleSpy.log;
    console.error = consoleSpy.error;
    console.warn = consoleSpy.warn;
    console.info = consoleSpy.info;
  });

  it("should be defined", () => {
    expect(logger).toBeDefined();
  });

  it("should have log methods", () => {
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("should log messages without throwing", () => {
    expect(() => {
      logger.info("Test info message");
      logger.warn("Test warning message");
      logger.error("Test error message");
    }).not.toThrow();
  });

  it("should handle objects and arrays", () => {
    expect(() => {
      logger.info("User data", { id: 1, name: "Test User" });
      logger.warn("Array data", [1, 2, 3]);
    }).not.toThrow();
  });

  it("should handle errors", () => {
    const error = new Error("Test error");
    expect(() => {
      logger.error("Error occurred", error);
    }).not.toThrow();
  });
});
