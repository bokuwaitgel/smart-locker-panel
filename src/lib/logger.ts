type LogLevel = "info" | "warn" | "error" | "debug";

const COLORS: Record<LogLevel, string> = {
  info: "#2196F3",
  warn: "#FF9800",
  error: "#F44336",
  debug: "#9E9E9E",
};

function format(level: LogLevel, context: string, message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const color = COLORS[level];

  console.groupCollapsed(
    `%c${level.toUpperCase()}%c ${timestamp} %c[${context}]%c ${message}`,
    `color: white; background: ${color}; padding: 1px 6px; border-radius: 3px; font-weight: bold`,
    "color: gray; font-weight: normal",
    "color: #6B7280; font-weight: bold",
    "color: inherit; font-weight: normal"
  );

  if (data !== undefined) {
    if (data instanceof Error) {
      console.error(data);
    } else {
      console.log(data);
    }
  }

  console.trace("Stack");
  console.groupEnd();
}

export function createLogger(context: string) {
  return {
    info: (message: string, data?: unknown) => format("info", context, message, data),
    warn: (message: string, data?: unknown) => format("warn", context, message, data),
    error: (message: string, data?: unknown) => format("error", context, message, data),
    debug: (message: string, data?: unknown) => {
      if (process.env.NODE_ENV === "development") {
        format("debug", context, message, data);
      }
    },
  };
}
