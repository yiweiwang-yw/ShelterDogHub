export interface Dog {
    id: string;
    name: string;
    breed: string;
    img: string;
    favorite?: boolean;
}

export interface DogCardProps extends Partial<Dog> {
    onFavorite?: () => void;
}
