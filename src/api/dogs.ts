import api from './index';

export const getBreeds = () => {
  return api.get('/dogs/breeds');
}

export const searchDogs = (breeds: string[] = [], zipCodes: string[] = [], ageMin?: number, ageMax?: number, size: number = 25, from?: string, sort?: string) => {
  return api.get('/dogs/search', {
    params: {
      breeds,
      zipCodes,
      ageMin,
      ageMax,
      size,
      from,
      sort
    }
  });
}

export const getDogs = (dogIds: string[]) => {
  return api.post('/dogs', dogIds);
}

export const matchDogs = (dogIds: string[]) => {
  return api.post('/dogs/match', dogIds);
}
