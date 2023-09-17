import React from 'react';
import { Button } from '@mui/material';

interface CustomPaginationProps {
    onNext: () => void;
    onPrev: () => void;
    hasPrev: boolean;
    hasNext: boolean;
  }

  const CustomPagination: React.FC<CustomPaginationProps> = ({ onNext, onPrev, hasPrev, hasNext }) => {
    return (
      <div>
        <Button onClick={onPrev} disabled={!hasPrev}>
          Prev
        </Button>
        <Button onClick={onNext} disabled={!hasNext}>
          Next
        </Button>
      </div>
    );
  };

export default CustomPagination;
