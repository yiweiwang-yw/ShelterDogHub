import React from 'react';
import DogCard from '../DogCard/DogCard';

interface Dog {
  id: string;
  name: string;
  breed: string;
  image: string;
  favorite?: boolean;
}

interface DogListProps {
  dogs: Dog[];
  favorites: Dog[];
  onFavorite?: (dog: Dog) => void;
}

const DogList: React.FC<DogListProps> = ({ dogs, favorites, onFavorite }) => {
    return (
      <div>
        {dogs.map(dog => (
          <DogCard
            key={dog.id}
            name={dog.name}
            breed={dog.breed}
            image={dog.image}
            favorite={favorites.some(favDog => favDog.id === dog.id)}
            onFavorite={() => onFavorite && onFavorite(dog)}
          />
        ))}
      </div>
    );
  }
  

export default DogList;
