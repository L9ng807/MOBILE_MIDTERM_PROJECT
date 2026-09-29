import AsyncStorage from '@react-native-async-storage/async-storage';

import { create } from 'zustand';

import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

import {
  DEFAULT_API_BASE_URL,
} from '../config/api';

interface ConnectionState {
  backendUrl: string;

  hasHydrated: boolean;

  setBackendUrl: (
    url: string,
  ) => void;

  resetBackendUrl:
    () => void;

  setHasHydrated: (
    value: boolean,
  ) => void;
}

export const useConnectionStore =
  create<ConnectionState>()(
    persist(
      (set) => ({
        backendUrl:
          DEFAULT_API_BASE_URL,

        hasHydrated: false,

        setBackendUrl:
          (url) =>
            set({
              backendUrl:
                url,
            }),

        resetBackendUrl:
          () =>
            set({
              backendUrl:
                DEFAULT_API_BASE_URL,
            }),

        setHasHydrated:
          (value) =>
            set({
              hasHydrated:
                value,
            }),
      }),

      {
        name:
          'ecg-nas-connection',

        storage:
          createJSONStorage(
            () =>
              AsyncStorage,
          ),

        partialize:
          (state) => ({
            backendUrl:
              state.backendUrl,
          }),

        onRehydrateStorage:
          () =>
            (state) => {
              state?.setHasHydrated(
                true,
              );
            },
      },
    ),
  );