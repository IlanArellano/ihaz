import { logger } from "./logger";

export function uncontrolledContextInvariant(
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
        : "Uncontrolled context not found. This hook only works in children components from the uncontrolled parent component or view manager"
    );

  if (!internal) {
    logger.debug(
      name,
      " This context must be used only for internal library purposes, dont recomend to use directly in the app."
    );
  }
}
