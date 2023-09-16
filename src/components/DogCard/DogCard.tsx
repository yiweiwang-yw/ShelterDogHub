import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface DogCardProps {
  name: string;
  breed: string;
  image: string;
  favorite?: boolean;
  onFavorite?: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ name, breed, image, favorite, onFavorite }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography>{breed}</Typography>
        {image && <img src={image} alt={name} style={{ width: '100%', height: 'auto', marginTop: '10px' }}/>}
        {onFavorite && 
          <Button 
            variant={favorite ? "contained" : "outlined"}
            color={favorite ? "primary" : "secondary"}
            onClick={onFavorite}
            style={{ marginTop: '10px' }}
          >
            {favorite ? "Favorited" : "Favorite"}
          </Button>
        }
      </CardContent>
    </Card>
  );
}

export default DogCard;
