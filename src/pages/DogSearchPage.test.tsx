import {describe, expect, test} from '@jest/globals';
import { render } from '@testing-library/react';
import DogSearchPage from './DogSearchPage';

describe('DogSearchPage', () => {
  test('renders DogSearchPage component', () => {
    render(<DogSearchPage />);
  });
});
