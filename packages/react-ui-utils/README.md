# `React UI Utils`

A general UI common methods for general React Projects including React Dom and React Native.

## Documentation

This library provides the following utilities:

- Cache
  - [Cache Resource](https://www.npmjs.com/package/@ihaz/react-ui-utils)
- Managers
  - [View Manager](https://www.npmjs.com/package/@ihaz/react-ui-utils)
- Components
  - [createFormManager](https://www.npmjs.com/package/@ihaz/react-ui-utils)
- Other Utilities
  - [createUncontrolledClassComponent](https://www.npmjs.com/package/@ihaz/react-ui-utils)

## Usage

```tsx
import { useState } from "react";
import { createRoot } from "react-dom/client";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Counter />);
```
