import api from './index';

export const getBreeds = async () => {
  return api.get('/dogs/breeds');
}

export const searchDogs = async (
    breeds: string[] = [],
    zipCodes: string[] = [],
    ageMin?: number,
    ageMax?: number,
    size: number = 25,
    from?: string,
    sort?: string
) => {
    return api.get("/dogs/search", {
        params: {
            breeds,
            zipCodes,
            ageMin,
            ageMax,
            size,
            from,
            sort,
        },
    });
};

export const getDogs = async (dogIds: string[]) => {
  return api.post('/dogs', dogIds);
}

export const matchDogs = async (dogIds: string[]) => {
  return api.post('/dogs/match', dogIds);
}
