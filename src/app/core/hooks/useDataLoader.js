import { useMemo, useEffect, useState, useCallback, useContext, useRef } from 'react'
import moize from 'moize'
import { emptyArr, emptyObj } from 'utils/fp'
import { isEmpty } from 'ramda'
import { ToastContext } from 'core/providers/ToastProvider'
import { AppContext } from 'core/AppProvider'
import { memoizedDep } from 'utils/misc'

const onErrorHandler = moize((loaderFn, showToast) => (errorMessage, catchedErr, params) => {
  const key = loaderFn.getKey()
  console.error(`Error when fetching items for entity "${key}"`, catchedErr)
  showToast(errorMessage, 'error')
})

/**
 * Hook to load data using the specified loader function
 * @param {contextLoaderFn} loaderFn
 * @param {object} [params] Any set of params passed to the loader function
 * @param {boolean} [invalidateCache=false] Reset cache before performing the loading when component mounts
 * @returns {[array, boolean, function]} Returns an array with the loaded data, a loading boolean and a function to reload the data
 */
const useDataLoader = (loaderFn, params = emptyObj, invalidateCache = false) => {
  // Use this ref to invalidate the cache on component mount so we will force data refetch
  // Invalidating the cache clears all the cache for this entity, unlike using the "refetch"
  // param, which only refreshes data for the current set of params
  const invalidatingCache = useRef(invalidateCache)

  // We use this ref to flag when the component has been unmounted so we prevent further state updates
  const unmounted = useRef(false)

  // FIFO buffer of sequentialized data loading promises
  // The aim of this is to prevent issues in the case two or more subsequent data loading requests
  // are performed with different params, and the previous one didn't have time to finish
  const loaderPromisesBuffer = useRef([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(emptyArr)
  const { getContext, setContext, currentTenant, currentRegion } = useContext(AppContext)
  const showToast = useContext(ToastContext)

  // Set a custom error handler for all loading functions using this hook
  // We do this here because we have access to the ToastContext, unlike in the dataLoader functions
  const additionalOptions = useMemo(() => ({
    // Even if using useMemo, every instance of useDataLoader will create a new function, thus
    // forcing the recalling of the loading function as the memoization of the promise will not work,
    //  so we are forced to create a memoized error handler outside of the hook
    onError: onErrorHandler(loaderFn, showToast),
  }), [])

  // The following function will handle the calls to the data loading and
  // set the loading state variable to true in the meantime, while also taking care
  // of the sequantialization of multiple concurrent calls
  // It will set the result of the last data loading call to the "data" state variable
  const loadData = async (refetch) => {
    // No need to update loading state if a request is already in progress
    if (isEmpty(loaderPromisesBuffer.current)) {
      setLoading(true)
    }
    if (invalidatingCache.current) {
      loaderFn.invalidateCache && loaderFn.invalidateCache()
      invalidatingCache.current = false
    }
    // Create a new promise that will wait for the previous promises in the buffer before running the new request
    const currentPromise = (async () => {
      await Promise.all(loaderPromisesBuffer.current) // Wait for previous promises to resolve
      const result = await loaderFn({ getContext, setContext, additionalOptions, params, refetch })
      loaderPromisesBuffer.current.shift() // Delete the oldest promise in the sequence (FIFO)
      return result
    })()
    loaderPromisesBuffer.current.push(currentPromise)
    const result = await currentPromise

    // With this condition, we ensure that all promises except the last one will be ignored
    if (isEmpty(loaderPromisesBuffer.current) &&
      !unmounted.current) {
      setLoading(false)
      setData(result)
    }
  }

  // Memoize the params dependency as we want to make sure it really changed and not just got a new reference
  const memoizedParams = memoizedDep(params)

  // Load the data on component mount and every time the params change
  useEffect(() => {
    loadData()
  }, [memoizedParams, currentTenant, currentRegion])

  // When unmounted, set the unmounted ref to true to prevent further state updates
  useEffect(() => {
    return () => {
      unmounted.current = true
    }
  }, [])

  // Export a reload method, useful to use along with `useDataUpdater(key, operation, onComplete)`
  // passed as `onComplete` param, to refresh a list after an update operation has been performed
  const reload = useCallback(loadData, [loaderFn, memoizedParams])

  return [data, loading, reload]
}

export default useDataLoader
