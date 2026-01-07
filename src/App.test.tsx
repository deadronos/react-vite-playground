import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the sidebar with React Patterns', () => {
    render(<App />);
    expect(screen.getByText('React Patterns')).toBeInTheDocument();
  });

  it('renders the default "Custom Hooks" view', () => {
    render(<App />);
    expect(screen.getAllByText('Custom Hooks')[0]).toBeInTheDocument();
    expect(screen.getByText('useWindowSize')).toBeInTheDocument();
  });
});
