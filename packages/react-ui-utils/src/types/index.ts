import type { EffectCallback } from "react";
import type { ParametersWithoutFistParam, DeepRecord } from "./validation";

type _Object = { [key: string]: any };

type EffectResult = void | EffectCallback;

export type { ParametersWithoutFistParam, DeepRecord, _Object, EffectResult };
