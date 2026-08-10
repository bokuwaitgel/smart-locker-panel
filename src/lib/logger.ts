type LogLevel = "info" | "warn" | "error" | "debug";

const IS_DEV = process.env.NODE_ENV === "development";

const COLORS: Record<LogLevel, string> = {
  info: "#2196F3",
  warn: "#FF9800",
  error: "#F44336",
  debug: "#9E9E9E",
};

function format(level: LogLevel, context: string, message: string, data?: unknown) {
  // In production: use plain console methods — no groupCollapsed, no trace (expensive)
  if (!IS_DEV) {
    const timestamp = new Date().toISOString();
    const line = `[${level.toUpperCase()}] ${timestamp} [${context}] ${message}`;
    if (level === "error") {
      data !== undefined ? console.error(line, data) : console.error(line);
    } else if (level === "warn") {
      data !== undefined ? console.warn(line, data) : console.warn(line);
    } else {
      data !== undefined ? console.log(line, data) : console.log(line);
    }
    return;
  }

  // Development: styled group output (browser only)
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

  // NOTE: console.trace() captures the full V8 call stack on every call.
  // Only enable in development and only for debug level if truly needed.
  console.groupEnd();
}

export function createLogger(context: string) {
  return {
    info: (message: string, data?: unknown) => format("info", context, message, data),
    warn: (message: string, data?: unknown) => format("warn", context, message, data),
    error: (message: string, data?: unknown) => format("error", context, message, data),
    debug: (message: string, data?: unknown) => {
      if (IS_DEV) {
        format("debug", context, message, data);
      }
    },
  };
}
