import { logger } from "./logger";

export function remoteContextInvariant(
  context: any,
  name: string,
  internal?: boolean,
  throwableMessage?: string
) {
  if (!context)
    logger.throwable(
      name,
      throwableMessage
        ? throwableMessage
        : "Remote context not found. This hook only works in children components from the remote parent component or view manager"
    );

  if (!internal) {
    logger.debug(
      name,
      " This context must be used only for internal library purposes, dont recomend to use directly in the app."
    );
  }
}
