import { useState, useEffect, useCallback } from 'react';
import g from 'guark';

export interface fetchProps {
  func: string,
  args?: {[key:string]: any},
};

export interface fetchResponse {
  body?: any,
  error?: any,
};

/* Api calls abstracted to this hook to make it easier
   to add things like error logging and chaning the API backend */
function useFetch(props: fetchProps): [fetchResponse, ()=>void] {
  const [ shouldFetch, setShouldFetch ] = useState<boolean>(false);
  const [ fetchInfo, setFetchInfo ]     = useState<fetchResponse>({} as fetchResponse);

  const fetchSignal = useCallback(() => { setShouldFetch(!shouldFetch) }, []);

  useEffect(() => {
    g.call(props.func, props.args)
      .then((res:any) => {
        setFetchInfo({body: JSON.parse(res)});
      }).catch((err:any) => {
        setFetchInfo({error: err})
      });

  }, [shouldFetch]);

  return [fetchInfo, fetchSignal]
};

export default useFetch
