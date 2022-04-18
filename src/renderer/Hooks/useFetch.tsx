import { useState, useEffect, useCallback } from 'react';

export interface fetchResponse {
  body?: any,
  error?: any,
};

/* Api calls abstracted to this hook to make it easier
   to add things like error logging and changing the API backend */
function useFetch(props: string): [fetchResponse, (a:any)=>void] {
  const [ shouldFetch, setShouldFetch ] = useState<boolean>(false);
  const [ fetchInfo, setFetchInfo ]     = useState<fetchResponse>({} as fetchResponse);
  const [ fetchArgs, setFetchArgs ]     = useState<{[key:string]: any}>({});

  const fetchSignal = useCallback((args:any) => { setFetchArgs(args); setShouldFetch(!shouldFetch) }, []);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (isMounted) {
      
    } else {
      setIsMounted(true);
    }

  }, [fetchArgs]);

  return [fetchInfo, fetchSignal]
};

export default useFetch
