export interface Dog {
    id: string;
    name: string;
    breed: string;
    img: string;
    age: number;
    zip_code: string;
    favorite?: boolean;
}

export interface DogCardProps extends Partial<Dog> {
    onFavorite?: () => void;
}

export type Coordinates = {
    lat: number;
    lon: number;
};

export type GeoBoundingBox = {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
    bottom_right?: Coordinates;
    top_right?: Coordinates;
};

export type LocationSearchRequestBody = {
    city?: string;
    states?: string[];
    geoBoundingBox?: GeoBoundingBox;
    size?: number;
    from?: number;
};
