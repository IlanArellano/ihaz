import React from "react";
import { ViewManagerComponent } from "./manager";
import { registerTreeComponent } from "./registerTreeComponent";
import { ViewTree } from "./tree";
import { createUncontrolledClassComponent } from "@utils/utils";
import type {
  ConditionView,
  IViewManager,
  ShowFunc,
  ShowFuncSync,
  ViewUncontrolledComp,
} from "./types";

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

    const manager = createUncontrolledClassComponent(ViewManagerComponent, {
      show: (
        instance: () => ViewManagerComponent,
        render: Parameters<ShowFunc>[0],
        props: Parameters<ShowFunc>[1],
        context: Parameters<ShowFunc>[2]
      ) => {
        return new Promise((resolve) => {
          instance()
            .show(render, props, context)
            .then((x) => resolve(x));
        });
      },
      showSync: (
        instance: () => ViewManagerComponent,
        render: Parameters<ShowFuncSync>[0],
        props: Parameters<ShowFuncSync>[1],
        onCloseListenner: Parameters<ShowFuncSync>[2],
        context: Parameters<ShowFuncSync>[3]
      ) => {
        return instance().showSync(render, props, onCloseListenner, context);
      },
      removeEntries: (instance, condition?: ConditionView) => {
        instance().removeSomeEntries(condition);
      },
    }) as ViewUncontrolledComp;

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
