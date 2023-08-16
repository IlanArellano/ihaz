# `React UI Utils`

A general UI common methods for general React Projects including React Dom and React Native.

## Documentation

This library provides the following utilities:

- Cache
  - [CacheResource](#cacheresource)
    - [createCacheResources](#createcacheresources)
    - [clearCacheByResource](#clearcachebyresource)
    - [clearAllCache](#clearallcache)
- Managers
  - [ViewManager](#viewmanager)
    - [createViewManager](#createviewmanager)
- Components
  - [createFormManager](#createformmanager)
- Hooks
  - [useEffectAsync](#useeffectasync)
  - [useLayoutEffectAsync](#uselayouteffectasync)
  - [useEffectInterval](#useeffectinterval)
  - [useValueHandler](#usevaluehandler)
  - [useEventHandler](#useeventhandler)
- Other Utilities
  - [createUncontrolledClassComponent](#createuncontrolledclasscomponent)

## Cache

## CacheResource

Cache Resource is a general cache manager can store a function result from a resource collection

## createCacheResources

Method that create a resource collection of methods that the result will be stored in cache, the cache will be cleared when the argument values changes

```tsx
import { CacheResource } from "@ihaz/react-ui-utils";
import { useState } from "react";

const cache = CacheResource.createCacheResources();

const methods_1 = cache.createCache("methods_1", {
  getUserInfo: (id: string) => fetch("myapi/info"),
  updateUserInfo: (user: User) => fetch("myapi/update", {
    method: "PUT",
    body: user
  });
}, {
  cache: ["getUserInfo"], //Methods from the resource that will be store in cache
  clear: ["updateUserInfo"] // Methods when will clear the cache when its executed
})

function UserComponent({id}) {
  const [user, setUser] = useState({} as User);

  useEffect(() => {
    const getUser = await methods_1.getUserInfo(id); //The method will search at first in the store in case the id value is the same than the previus call, otherwise executes the original method again
    setUser(getUser);
  },[id]);

  const onUpdate = () => {
    await methods_1.updateUserInfo(user); //When the update is done, it will clear all the cache from the resource
  }

  return (
    <>
      <h1>User {id} details</h1>
      ...
      <button onClick={onUpdate}>Update</button>
    </>
  );
}
```

## clearCacheByResource

## clearAllCache

## Managers

## ViewManager

## createViewManager

## Components

## createFormManager

## Hooks

## useEffectAsync

## useLayoutEffectAsync

## useEffectInterval

## useValueHandler

## useEventHandler

## Other Utilities

## createUncontrolledClassComponent
