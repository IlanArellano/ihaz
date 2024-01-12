import {
  useEffectAsync,
  useIntervalEffect,
  useEventHandler,
  useValueHandler,
  useLayoutEffectAsync,
} from "./hooks";
import {
  ViewManager,
  type OnCloseResult,
  type ViewComponentProps,
  type ViewManagerComponentProps,
  type ViewMethods,
  type ViewProps,
  type ViewSyncResult,
  type ViewSyncStartOptions,
  type ViewUncontrolledComp,
} from "./manager";
import { createFormManager } from "./components";
import {
  createUncontrolledClassComponent,
  type CustomComponentClass,
  type Methods,
  type MethodsWithInstance,
  type Options,
  type UncontolledContextAction,
  type UncontrolledComponent,
  type UncontrolledContext,
  type UncontrolledContextValue,
} from "./utils";
import { CacheResource } from "./Cache";

export {
  //Namespaces
  ViewManager,
  CacheResource,
  //HOCs
  createFormManager,
  createUncontrolledClassComponent,
  //Hooks
  useEffectAsync,
  useIntervalEffect,
  useEventHandler,
  useValueHandler,
  useLayoutEffectAsync,

  //Types
  OnCloseResult,
  ViewComponentProps,
  ViewManagerComponentProps,
  ViewMethods,
  ViewProps,
  ViewSyncResult,
  ViewSyncStartOptions,
  ViewUncontrolledComp,
  CustomComponentClass,
  Methods,
  MethodsWithInstance,
  Options,
  UncontolledContextAction,
  UncontrolledComponent,
  UncontrolledContext,
  UncontrolledContextValue,
};
