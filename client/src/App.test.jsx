import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the Agri-Tech home page', () => {
    render(<App />);
    expect(screen.getAllByText(/Agri-Tech/i).length).toBeGreaterThan(0);
  });
});
