import {logger, mapConsoleTransport} from "react-native-logs";

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "error",
  transport: mapConsoleTransport,
  transportOptions: {
    colors: {
      debug: "white",
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
  async: true,
  dateFormat: "utc",
  printLevel: true,
  printDate: true,
};

export const rootLogger = logger.createLogger<"debug" | "info" | "warn" | "error">(config);
