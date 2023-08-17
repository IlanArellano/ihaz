import React, { ComponentType } from "react";
import {
  ShowFunc,
  ShowFuncSync,
  ViewManagerComponent,
  ConditionView,
  ViewManagerComponentProps,
} from "./manager";
import { ViewProps } from "./comp";
import { TreeComponent, registerTreeComponent } from "./registerTreeComponent";
import { ViewTree } from "./tree";
import createUncontrolledClassComponent, {
  UncontrolledComponent,
} from "@utils/utils/uncontrolled";

export interface ViewUncontrolledComp
  extends UncontrolledComponent<ViewManagerComponentProps> {
  show: ShowFunc;
  showSync: ShowFuncSync;
  removeEntries: (condition?: ConditionView) => void;
}

export interface ViewMethods {
  Component: ComponentType;
  getTree: () => ViewTree;
  createViewContextComponent: TreeComponent;
}

export type IViewManager = Omit<ViewUncontrolledComp, "Component"> &
  ViewMethods;

/**An enviroment that handle uncontrolled component views in `React` */
export namespace ViewManager {
  /**Create a view manager that can handle the mount-unmount behavior from the own parent `Tree` component
   * through the `show` and `onClose` methods. Every component is added
   * to internal Parent component state, components inherit a prop called `onClose` when
   * the method is called it will remove from the internal state, the method can also
   * return a result when the component is closed
   *
   * ```tsx
   * const manager = ViewManager.createViewManager();

const ViewComponent = ({ onClose }: ViewProps<string>) => {
  return (
    <div>
      <h1>View example</h1>
      <button onClick={() => onClose("hello")}>Close</button>
    </div>
  );
};

const Example = () => {
  const onShow = async () => {
    const response = await manager.show(ViewComponent);
    console.log(response); // Hello
  };

  return (
    <div>
      <button onClick={onShow}>Show</button>
      <manager.Component />
    </div>
  );
};

   * 
   * ```
   */
  export const createViewManager = (): IViewManager => {
    const Tree = new ViewTree();

    const manager: ViewUncontrolledComp = createUncontrolledClassComponent(
      ViewManagerComponent,
      {
        show: (
          instance,
          render: React.ComponentType<ViewProps>,
          props?: any,
          context?: string
        ) => {
          return new Promise((resolve) => {
            instance()
              .show(render, props, context)
              .then((x) => resolve(x));
          });
        },
        showSync: (
          instance,
          render: React.ComponentType<ViewProps>,
          props?: any,
          onCloseListenner?: any,
          context?: string
        ) => {
          return instance().showSync(render, props, onCloseListenner, context);
        },
        removeEntries: (instance, condition?: ConditionView) => {
          instance().removeSomeEntries(condition);
        },
      }
    );

    const getTree = () => Tree;

    const createViewContextComponent = registerTreeComponent(Tree);

    return {
      ...manager,
      Component: () => <manager.Component Tree={Tree} />,
      createViewContextComponent,
      getTree,
    };
  };
}
