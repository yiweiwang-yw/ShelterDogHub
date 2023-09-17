import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import DogSearchPage from './DogSearchPage';


describe('DogSearchPage', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders DogSearchPage component', () => {
    render(<DogSearchPage />);
  });

  
});
