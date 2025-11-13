import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search button in navbar', () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /search/i });
  expect(btn).toBeInTheDocument();
});
