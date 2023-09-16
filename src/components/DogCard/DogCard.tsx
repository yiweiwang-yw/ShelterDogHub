import React from 'react';
import { DogCardProps } from '../../types/types';
import { Card, CardContent, Typography, Button } from '@mui/material';

const DogCard: React.FC<DogCardProps> = ({ name, breed, age, zip_code, img, favorite, onFavorite }) => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{name}</Typography>
          <Typography>{breed}</Typography>
          <Typography>{`Age: ${age} years`}</Typography>
          <Typography>{`Zip Code: ${zip_code}`}</Typography>
          <div className="relative w-full h-40 overflow-hidden">
            <img src={img} alt={name} className="w-full h-full object-cover max-w-sm mx-auto" />
          </div>
          {onFavorite && (
            <Button
              variant={favorite ? "contained" : "outlined"}
              color={favorite ? "success" : "primary"}
              onClick={onFavorite}
              style={{ marginTop: '10px' }}
            >
              {favorite ? "Unfavorite" : "Favorite"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

export default DogCard;
