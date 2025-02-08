export const LogLevel = {
  NONE: "NONE",
  ERROR: "ERROR",
  WARN: "WARN",
  DEBUG: "DEBUG",
  ALL: "ALL",
} as const;

type LogFlags = Record<keyof typeof LogLevel, boolean>;

interface LoggerOptions {
  prefix?: string;
  flags?: LogFlags;
}

class Logger {
  protected prefix: string;
  private flags: LogFlags | undefined;

  constructor({ prefix = "", flags }: LoggerOptions) {
    this.prefix = prefix;
    this.flags = flags;
  }

  debug = (...args: unknown[]): void => {
    if (this.canWrite(LogLevel.DEBUG)) {
      this.write(LogLevel.DEBUG, ...args);
    }
  };

  warn = (...args: unknown[]): void => {
    if (this.canWrite(LogLevel.WARN)) {
      this.write(LogLevel.WARN, ...args);
    }
  };

  error = (...args: unknown[]): void => {
    if (this.canWrite(LogLevel.ERROR)) {
      this.write(LogLevel.ERROR, ...args);
    }
  };

  throwable = (...messages: string[]) => {
    throw new Error(this.prefix + [].join.call(messages, ""));
  };

  private canWrite(level: keyof typeof LogLevel): boolean {
    return this.flags ? this.flags[level] : true;
  }

  private write(level: keyof typeof LogLevel, ...args: unknown[]): void {
    let prefix = this.prefix;

    if (level === LogLevel.ERROR) {
      console.error(prefix, ...args);
    } else {
      console.log(prefix, ...args);
    }
  }
}

export function createLogger({ prefix, flags }: LoggerOptions = {}): Logger {
  return new Logger({ prefix, flags });
}
