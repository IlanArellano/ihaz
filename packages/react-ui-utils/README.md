# `React UI Utils`

A general UI common methods for general React Projects.

## Quick Start

This library is made for every `React` project (React DOM and React Native) means the library has no more dependencies than React Core or any Third Party Dependencies made for single `React` Project.

## Advantages

- Library 100% React Core made only, so it can be used for all React Projects, such a React Dom and React Native.
- Free of any dependencies.
- Provides common `Utilities` that resolve common `React` Project uses.
- Easy user interface implementations.

## Documentation

This library provides the following utilities:

- HOCs
  - [createViewManager](#createviewmanager)
  - [createUncontrolledFC](#createuncontrolledfc)
  - [createUncontrolledClassComponent](#createuncontrolledclasscomponent)
  - [withStatus](#withstatus)
  - [createFormManager](#createformmanager)
- Hooks
  - [useEffectAsync](#useeffectasync)
  - [useLayoutEffectAsync](#uselayouteffectasync)
  - [useIntervalEffect](#useintervaleffect)
  - [useValueHandler](#usevaluehandler)
  - [useEventHandler](#useeventhandler)

### createViewManager

**Import**

```ts
import { createViewManager } from "@ihaz/react-ui-utils";
```

Create a view manager that can handle the mount-unmount behavior from the own parent `Tree` component through the `show` and `onClose` methods. Every component is added to internal Parent component state, components inherit a prop called `onClose` when the method is called it will remove from the internal state, the method can also return a result when the component is closed.

:large_blue_diamond: This HOC is useful if it wants to render views thats has or not any relation to the component which its invoked or it can be render outside the component, such a Modals or Dialogs.

**Usage**

```tsx
import { createViewManager } from "@ihaz/react-ui-utils";

const manager = createViewManager();

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
```

**Methods**

**_show_**

Mount the passing instance Component adding it to parent `Tree` collection. Every Child Component inherits a `onClose` method that unmount and remove of the parent `Tree` collection and return a result in his argument, when it´s called a promise is resolved and return the result setted.

**Example**

```tsx
import { ViewManager, type ViewProps } from "@ihaz/react-ui-utils";

const manager = ViewManager.createViewManager();

function BasicDemo({ onClose }: ViewProps<boolean>) {
  return (
    <Dialog
      header="Header"
      visible
      style={{ width: "50vw" }}
      onHide={() => onClose(false)}
    >
      <Button
        label="True Response"
        icon="pi pi-external-link"
        onClick={() => onClose(true)}
      />
      <Button
        label="False Response"
        icon="pi pi-external-link"
        onClick={() => onClose(false)}
      />
      <p className="m-0">Lorem ipsum ...</p>
    </Dialog>
  );
}

function App() {
  const onShow = async () => {
    const response = await manager.show(BasicDemo); //Promise will be resolved when `onClose` method is called and return a result if is declared
    console.log(response);
  };

  return (
    <main>
      {/*Component must be included in any part of your React Project for declare its own instance*/}
      <manager.Component /> <button onClick={onShow}>Show Dialog</button>
    </main>
  );
}

export default App;
```

**_showSync_**
Method with same effect as `show` method, the child component is mount in parent `Tree` collection and inherits a `onClose` method. this function return the following methods.

- show: Mount the child component

- close: Unmount the child component, if `onClose` method from child component is called previously, this one has no effect.

If any result is declared in `onClose` argument, it will be show in `onCloseListenner` callback.

**Example**

```tsx
import { ViewManager, type ViewProps } from "@ihaz/react-ui-utils";

const manager = ViewManager.createViewManager();

function BasicDemo({ onClose }: ViewProps<boolean>) {
  return (
    <Dialog
      header="Header"
      visible
      style={{ width: "50vw" }}
      onHide={() => onClose(false)}
    >
      <Button
        label="True Response"
        icon="pi pi-external-link"
        onClick={() => onClose(true)}
      />
      <Button
        label="False Response"
        icon="pi pi-external-link"
        onClick={() => onClose(false)}
      />
      <p className="m-0">Lorem ipsum ...</p>
    </Dialog>
  );
}

function App() {
  const onCloseListenner = (value: boolean) => {
    console.log({ value }); // Return the value
  };

  const onShow = () => {
    const dialog = manager.showSync(BasicDemo, undefined, onCloseListenner); // onCloseListenner callback is called when onClose method is called inside component
    dialog.start(); // Mount Component
  };

  return (
    <main>
      {/*Component must be included in any part of your React Project for declare its own instance*/}
      <manager.Component />
      <button onClick={onShow}>Show Dialog</button>
    </main>
  );
}

export default App;
```

**Merge Props**
You can merge props of the child component its depends the own component lifecycle.

**Example**

```tsx
import { ViewManager, type ViewProps } from "@ihaz/react-ui-utils";

const manager = ViewManager.createViewManager();

interface BasicDemoProps extends ViewProps<boolean> {
  name: string;
}

function BasicDemo({ onClose, name }: BasicDemoProps) {
  return (
    <Dialog
      header="Header"
      visible
      style={{ width: "50vw" }}
      onHide={() => onClose(false)}
    >
      <Button
        label="True Response"
        icon="pi pi-external-link"
        onClick={() => onClose(true)}
      />
      <Button
        label="False Response"
        icon="pi pi-external-link"
        onClick={() => onClose(false)}
      />
      <p className="m-0">{name}</p>
    </Dialog>
  );
}

function App() {
  const onShow = async () => {
    const res = await manager.show(BasicDemo, { name: "Hello" });
    console.log({ res });
  };

  return (
    <main>
      <manager.Component />
      <button onClick={onShow}>Show Dialog</button>
    </main>
  );
}

export default App;
```

**Context**
View Child components works as stand alone component that it can render without depending if the parent component is mount or not in main `React Tree`, so the solution to unmount the view child component if the parent view is unmount if set a context to create a View Environment.

**Example**

```tsx
import { ViewManager, type ViewProps } from "@ihaz/react-ui-utils";

const manager = ViewManager.createViewManager();

const CONTEXT = "render_view"; // Context to this View Environment, it works like a unique  key

interface BasicDemoProps extends ViewProps<boolean> {
  name: string;
  setShowRender: Dispatch<SetStateAction<boolean>>;
}

function BasicDemo({ onClose, name, setShowRender }: BasicDemoProps) {
  return (
    <Dialog
      header="Header"
      visible
      style={{ width: "50vw" }}
      onHide={() => onClose(false)}
    >
      <Button
        label="True Response"
        icon="pi pi-external-link"
        onClick={() => onClose(true)}
      />
      <Button
        label="False Response"
        icon="pi pi-external-link"
        onClick={() => onClose(false)}
      />
      <Button
        label="UnMount Parent Component"
        icon="pi pi-external-link"
        onClick={() => setShowRender(false)}
      />
      <p className="m-0">{name}</p>
    </Dialog>
  );
}

interface RenderViewComponentProps {
  setShowRender: Dispatch<SetStateAction<boolean>>; //set a state dispatcher to unmount the parent component
}

function RenderViewComponent({ setShowRender }: RenderViewComponentProps) {
  const onShow = async () => {
    const res = await manager.show(
      BasicDemo,
      { name: "Hello", setShowRender },
      CONTEXT // set the same context than parent component to bind the same view environment
    );
    console.log({ res });
  };

  return <button onClick={onShow}>Show Dialog</button>;
}

const RenderView = manager.createViewContextComponent(
  RenderViewComponent,
  CONTEXT
); // HOC that register the parent component to internal Tree with a context key

function App() {
  const [showRender, setShowRender] = useState<boolean>(true);

  return (
    <main>
      <manager.Component />
      {showRender && <RenderView setShowRender={setShowRender} />} {/* When its unmount, view manager will remove all the child components with same context key, returning `undefined` value*/}
    </main>
  );
}

export default App;
```

### createUncontrolledFC

### createUncontrolledClassComponent

**Import**

```ts
import { createUncontrolledClassComponent } from "@ihaz/react-ui-utils";
```

Provides a React Class Component where the internal methods can be malipulated by other React component throught their own instance.

**Example**

```tsx
import { Component } from "react";
import { createUncontrolledClassComponent } from "@ihaz/react-ui-utils";

class ExampleClassComponent extends Component<any, {selector: number}> {
  constructor(props: any) {
      super(props);
      this.state = {
          selector: 1
      }
  }

  getSelector = () => this.state.selector;
  changeSelector = (new_selector: number) => this.setState({ selector: new_selector });

  render() {
      return ... //JSX
  }
}


const UncontrolledExample = createUncontrolledClassComponent(ExampleClassComponent, {
  getSelector: (instance) => instance().getSelector(),
changeSelector: (instance, new_selector: number) => instance().changeSelector(new_selector),
});


export const Main = () => {

  const show = () => {
     console.log(UncontrolledExample.getSelector()) // 1
  }
    const changeSelector = () => {
  UncontrolledExample.changeSelector(2); //Changes internal selector state to 2
};

  return <>
<UncontrolledExample.Component />
  <button onClick={show}>Show Selector</button>
  <button onClick={changeSelector}>Change Selector</button>
  </>
}
```

### withStatus

Is a HOC

### createFormManager

**Import**

```ts
import { createFormManager } from "@ihaz/react-ui-utils";
```

Returns a Form enviroment that provides a `Form` component that can be used and handled by internal state using a `Field` component that can change every prop from the state

**Example**

```tsx
import { createFormManager } from "@ihaz/react-ui-utils";

const initial = {
  name: "",
  lastName: "",
  age: 0,
  birthAge: new Date(),
};

const { Form, Field, Submit, useFormValue } = createFormManager(initial, {
  name: (value) => value.length > 10, // Validation for the name
});
const Component = () => {
  const { value, isValidated } = useFormValue();

  const onSubmit = (result: typeof initial) => {
    console.log(result); // Current state of form value
    //...
  };

  return (
    <Form onSubmit={onSubmit}>
      <Field field="name" />
      <Field field="lastName" />
      <Field field="birthAge" />
      <Field field="age" />
      <Submit>
        <button type="submit">submit</button>
      </Submit>
    </Form>
  );
};
```

## Hooks

### useEffectAsync

**Import**

```ts
import { useEffectAsync } from "@ihaz/react-ui-utils";
```

Effect with same function as `React.useEffect` that can be declared a promise in the callback.

**Example**

```tsx
import { useEffectAsync } from "@ihaz/react-ui-utils";
import { useState } from "react";

const Example = () => {
  const [value, setValue] = useState();

  useEffectAsync(async () => {
    const api = await fetch("myapi");
    setValue(api);
  }, []);

  return <div>{value}</div>;
};
```

### useLayoutEffectAsync

**Import**

```ts
import { useLayoutEffectAsync } from "@ihaz/react-ui-utils";
```

Effect with same function as `React.useLayoutEffect` that can be declared a promise in the callback.

**Example**

```tsx
import { useLayoutEffectAsync } from "@ihaz/react-ui-utils";
import { useState } from "react";

const Example = () => {
  const [value, setValue] = useState();

  useLayoutEffectAsync(async () => {
    const api = await fetch("myapi");
    setValue(api);
  }, []);

  return <div>{value}</div>;
};
```

### useIntervalEffect

**Import**

```ts
import { useIntervalEffect } from "@ihaz/react-ui-utils";
```

Hook that execute a callback into a Interval.

**Example**

```tsx
import { useIntervalEffect } from "@ihaz/react-ui-utils";
import { useState } from "react";

const Example = () => {
  const [count, setCount] = useState(0);
  const { restart, stop } = useIntervalEffect(
    ({ count }) => {
      console.log(count); // Shows the current count value in every interval
      setCount((prev) => prev + 1);
    },
    1000,
    { count }
  ); //Executes effect every second

  return (
    <div>
      <button onClick={() => restart()}>Restart</button>
      <button onClick={() => stop()}>Stop</button>
      <span>{count}</span>
    </div>
  );
};
```

**Arguments**

- _effect_: Callback that executes in every interval.
- _ms_: **Optional**. Time interval in milliseconds to executes every callback.
- _intervalValues_: **Optional**. An object of Values that use the current value in every interval.
- _inmediate_: **Optional**. Execute the effect inmediatly, before the interval has initializated. If `ms` parameter is not declared this arg execute the effect twice at first.

**Caveats**

- The `stop` method if `executeCallbackCleanup` is declared, executes the last interval cleanup.
- The internal effect has not dependencies besides a state that refresh the interval, in case you want to use a React state value or any async value, you can put it on `intervalValues` argument:

```tsx
const [count, setCount] = useState(0);

// Wrong ❌
useIntervalEffect(() => {
  console.log(count);
}, 1000);

// Good ✅
useIntervalEffect(
  ({ countDependency }) => {
    console.log(countDependency);
  },
  1000,
  { countDependency: count }
);
```

**Note**
The interval effect dependency effect return the async previus value in every interval, so to a interval
setted its get the current value that returns the dependency

### useValueHandler

**Import**

```ts
import { useValueHandler } from "@ihaz/react-ui-utils";
```

Hook that provides an uncontrolled internal state storing the value with ref, meaning the value handler never affects the component lifecycle and always get the stored value synchronously.

**Example**

```tsx
import { useValueHandler } from "@ihaz/react-ui-utils";

const Example = () => {
  const [counter, setCounter] = useValueHandler(0); // initial 0

  const handleChange = () => {
    setCounter((prev) => prev + 1); //increment
    console.log(counter()); //value incremented synchronously
  };

  return <button onChange={handleChange}>count: {counter()}</button>; //Never changes till you change a state that modify the lifecycle component
};
```

**Caveats**

- _useValueHandler_ is a hook that store a value by ref, so this hook never update the component.
- For callbacks and effects that use the value stored always return the current value, in case if the callback value is called in jsx, it must have a trigger or state that update the component for show the current value.
- The value (similar to `React State` conditions) returns a read-only and non-mutable value that can be only change by the dispatch method, so don´t change or mutate the value directly.

### useEventHandler

**Import**

```ts
import { useEventHandler } from "@ihaz/react-ui-utils";
```

Hook that executes a callback suscribing to one or several events into a component.

**Example**

```tsx
import { useEventHandler } from "@ihaz/react-ui-utils";

const Example = () => {
  const { addEventListenner, removeEventListenner, listen } = useEventHandler<
    "change",
    string
  >();

  useEffect(() => {
    const listenner = (result: string) => {
      console.log("result: ", result);
    };
    addEventListenner("change", listenner); // Suscribing callback to Change event

    return () => {
      removeEventListenner("change", listenner); // Unsuscribing callback to Change event
    };
  }, []);

  const handleFetch = async () => {
    const res = await fetch("myapi");
    listen("change", await res.text()); // Listen Change event
  };

  return <button onClick={handleFetch}>Fetch</button>;
};
```
