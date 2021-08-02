import { useState, useRef, useEffect, useCallback } from 'react';

// originally from https://ysfaran.github.io/blog/post/0002-use-state-with-promise/
// modified for typescript

function useStateWithPromise<Type>(initialState:Type): [ Type, any ] {
  const [state, setState] = useState<Type>(initialState);
  const resolverRef = useRef<any>(null);

  useEffect(() => {
    if (resolverRef.current) {
      resolverRef.current(state);
      resolverRef.current = null;
    }
    /**
     * Since a state update could be triggered with the exact same state again,
     * it's not enough to specify state as the only dependency of this useEffect.
     * That's why resolverRef.current is also a dependency, because it will guarantee,
     * that handleSetState was called in previous render
     */
  }, [resolverRef.current, state]);

  const handleSetState = useCallback((stateAction: Type | (() => Type)) => {
    setState(stateAction);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, [setState])

  return [state, handleSetState];
};

export default useStateWithPromise;
