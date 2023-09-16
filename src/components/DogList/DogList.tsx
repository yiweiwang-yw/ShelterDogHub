import React from "react";
import DogCard from "../DogCard/DogCard";
import { Dog } from "../../types/types";

interface DogListProps {
    dogs: Dog[];
    favorites: Dog[];
    onFavorite?: (dog: Dog) => void;
}

const DogList: React.FC<DogListProps> = ({ dogs, favorites, onFavorite }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {dogs.map((dog) => (
                <div key={dog.id}>
                    <DogCard
                        name={dog.name}
                        breed={dog.breed}
                        img={dog.img}
                        favorite={favorites.some(
                            (favDog) => favDog.id === dog.id
                        )}
                        onFavorite={() => onFavorite && onFavorite(dog)}
                    />
                </div>
            ))}
        </div>
    );
};

export default DogList;
