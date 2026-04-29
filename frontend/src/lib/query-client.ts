import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/http";

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof ApiError && [401, 403, 404, 419, 422].includes(error.status ?? 0)) {
            return false;
          }

          return failureCount < 2;
        },
        staleTime: 30_000,
        refetchOnWindowFocus: false
      }
    }
  });
}
