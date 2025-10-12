import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders basic App content', () => {
  const { getByText } = render(<App />);

  // App heading
  expect(getByText('Vite + React')).toBeTruthy();

  // initial counter button
  expect(getByText(/count is 0/)).toBeTruthy();
});
