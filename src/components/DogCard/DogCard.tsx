import React from 'react';
import { DogCardProps } from '../../types/types';
import { Card, CardContent, Typography, Button } from '@mui/material';

const DogCard: React.FC<DogCardProps> = ({ name, breed, img, favorite, onFavorite }) => {
  return (
      <Card>
          <CardContent>
              <Typography variant="h6">{name}</Typography>
              <Typography>{breed}</Typography>
              <div className="relative w-full h-40 overflow-hidden">
                  <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover"
                  />
              </div>
              {onFavorite && (
                  <Button
                      variant={favorite ? "contained" : "outlined"}
                      color={favorite ? "primary" : "secondary"}
                      onClick={onFavorite}
                      className="mt-2"
                  >
                      {favorite ? "Favorited" : "Favorite"}
                  </Button>
              )}
          </CardContent>
      </Card>
  );
}

export default DogCard;
