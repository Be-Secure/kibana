/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */

import { useCallback, useEffect, useRef } from 'react';
import { encode, decode } from '@kbn/rison';
import type { ExpandableFlyoutApi } from '@kbn/expandable-flyout';

const URL_KEY = 'alert-flyout' as const;

/**
 * Sync any object with browser query string using @knb/rison
 */
export const useSyncToUrl = <TValueToSerialize,>(
  key: string,
  restore: (data: TValueToSerialize) => void
) => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get(key);

    if (!param) {
      return;
    }

    const decodedQuery = decode(param);

    if (!decodedQuery) {
      return;
    }

    // Only restore the value if it is not falsy
    restore(decodedQuery as unknown as TValueToSerialize);
  }, [key, restore]);

  /**
   * Synces value with the url state, under specified key. If payload is undefined, the value will be removed from the query string althogether.
   */
  const syncValueToQueryString = useCallback(
    (valueToSerialize?: TValueToSerialize) => {
      const searchParams = new URLSearchParams(window.location.search);

      if (valueToSerialize) {
        const serializedPayload = encode(valueToSerialize);
        searchParams.set(key, serializedPayload);
      } else {
        searchParams.delete(key);
      }

      const newSearch = searchParams.toString();

      // Update query string without unnecessary re-render
      const newUrl = `${window.location.pathname}?${newSearch}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    },
    [key]
  );

  return syncValueToQueryString;
};

type FlyoutState = Parameters<ExpandableFlyoutApi['openFlyout']>[0];

/**
 * Get flyout api reference and open it if we can find serialized state in the url
 */
export const useSyncFlyoutStateWithUrl = () => {
  const flyoutApi = useRef<ExpandableFlyoutApi>(null);

  const syncStateToUrl = useSyncToUrl<FlyoutState>(URL_KEY, (data) => {
    flyoutApi.current?.openFlyout(data);
  });

  useEffect(() => {
    const h = () => {
      console.log('clear url on unmount / navigate away');
      syncStateToUrl(undefined);
    };

    window.addEventListener('popstate', h);

    return () => {
      h();
      window.removeEventListener('popstate', h);
    };
  }, [syncStateToUrl]);

  const handleFlyoutChanges = useCallback(
    (state?: FlyoutState) => {
      if (!state) {
        console.info('closing flyout');
        return syncStateToUrl(undefined);
      }

      console.info('update flyout state', state);
      return syncStateToUrl(state);
    },
    [syncStateToUrl]
  );

  return [flyoutApi, handleFlyoutChanges] as const;
};
