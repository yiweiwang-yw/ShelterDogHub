import React from 'react';
import { DogCardProps } from '../../types/types';
import { Card, CardContent, Typography, Button } from '@mui/material';


const DogCard: React.FC<DogCardProps> = ({ name, breed, img, favorite, onFavorite }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography>{breed}</Typography>
        {img && <img src={img} alt={name} style={{ width: '100%', height: 'auto', marginTop: '10px' }}/>}
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
