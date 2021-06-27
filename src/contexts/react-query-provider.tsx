import {
  QueryClientProvider,
  QueryClient,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

interface IQueryProvider {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error: any) {
        if (error?.status === 404) return false;
        if (error?.status === 401) return false;
        else if (failureCount < 2) return true;
        else return false;
      }
    }
  }
})

function ReactQueryProvider({ children }: IQueryProvider) {
  return (
    <QueryClientProvider client={ queryClient }>
      { children }
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export {
  ReactQueryProvider
}