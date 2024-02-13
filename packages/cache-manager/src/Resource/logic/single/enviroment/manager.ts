import { CommonObject } from "@ihaz/js-ui-utils";
import { SingleCacheManager } from "../types";
import { CacheEnvironment } from "@cache/Resource/types";

const createSingleHybridManager = (): SingleCacheManager => {
  return new WeakMap();
};

const createSingleServerManager = (): SingleCacheManager => {
  return new WeakMap();
};

const createSingleClientManager = (): SingleCacheManager => {
  return new WeakMap();
};

const getClientManager = CommonObject.createGetterResource(
  createSingleClientManager
);
const getServerManager = CommonObject.createGetterResource(
  createSingleServerManager
);
const getHybridManager = CommonObject.createGetterResource(
  createSingleHybridManager
);

type ManagerContext = {
  getManager: () => SingleCacheManager;
  success: boolean;
};

export const getManagerContext = (
  environment: CacheEnvironment
): ManagerContext => {
  switch (environment) {
    case "client":
      return {
        success: typeof window !== "undefined",
        getManager: getClientManager,
      };
    case "server":
      return {
        success: typeof window === "undefined",
        getManager: getServerManager,
      };
    case "hybrid":
      return {
        success: true,
        getManager: getHybridManager,
      };
    default:
      throw new Error("Unknown Error - No Enviroment has set");
  }
};
