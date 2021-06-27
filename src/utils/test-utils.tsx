import * as React from 'react';
import { render, RenderOptions, waitFor } from '@testing-library/react';

import AppProvider from 'contexts';

const customRender = async (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => waitFor(() => render(ui, { wrapper: AppProvider, ...options }));

export * from '@testing-library/react';
export { customRender as render };
