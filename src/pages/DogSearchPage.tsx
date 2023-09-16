import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    SelectChangeEvent,
    Box,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DogList from "../components/DogList/DogList";
import { Dog } from "../types/types";
import { getBreeds, searchDogs, getDogs, matchDogs } from "../api/dogs";
import CustomPagination from "../components/Pagination/CustomPagination";

const DogSearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [selectedBreed, setSelectedBreed] = useState<string | undefined>();
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [favorites, setFavorites] = useState<Dog[]>([]);
    const [cursors, setCursors] = useState<string[]>([]);
    const [currentCursor, setCurrentCursor] = useState<string | undefined>();
    const [nextCursor, setNextCursor] = useState<string | undefined>();
    const [prevCursor, setPrevCursor] = useState<string | undefined>();
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [isMatchDialogOpen, setIsMatchDialogOpen] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        async function fetchBreeds() {
            const response = await getBreeds();
            setBreeds(response.data);
        }
        fetchBreeds();
    }, []);
    const getCursorFromQueryString = (queryString: string) => {
        const params = new URLSearchParams(queryString);
        return params.get("from") || undefined;
    };

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            const { name, email } = JSON.parse(userData);
            const key = `matchedDog-${name}-${email}`;
            const storedMatchedDog = sessionStorage.getItem(key);
            if (storedMatchedDog) {
                setMatchedDog(JSON.parse(storedMatchedDog) as Dog);
            }
        }
    }, []);

    useEffect(() => {
        async function fetchDogs() {
            const response = await searchDogs(
                selectedBreed ? [selectedBreed] : [],
                [],
                undefined,
                undefined,
                25,
                nextCursor
            );

            setNextCursor(getCursorFromQueryString(response.data.next));
            setPrevCursor(getCursorFromQueryString(response.data.prev));

            if (response.data.resultIds.length > 0) {
                const dogDetails = await getDogs(response.data.resultIds);
                setDogs(dogDetails.data);
                console.log(dogDetails.data);
            }
        }
        fetchDogs();
    }, [selectedBreed, currentCursor]);

    const handleBreedChange = (event: SelectChangeEvent<string>) => {
        setSelectedBreed(event.target.value);
    };

    const sortedDogs = [...dogs].sort((a, b) => {
        const comparison = a.breed.localeCompare(b.breed);
        return sortOrder === "asc" ? comparison : -comparison;
    });

    const handleNext = () => {
        if (nextCursor) {
            setCursors((prev) => [...prev, nextCursor]);
            setCurrentCursor(nextCursor);
        }
    };

    const handlePrev = () => {
        if (prevCursor || cursors.length > 0) {
            if (cursors.length > 1) {
                const newCursors = [...cursors];
                newCursors.pop();
                setCursors(newCursors);
                setCurrentCursor(newCursors[newCursors.length - 1]);
            } else {
                setCurrentCursor(undefined);
                setCursors([]);
            }
        }
    };

    const toggleFavorite = (dog: Dog) => {
        const isFavorite = favorites.some((favDog) => favDog.id === dog.id);
        setFavorites((prev) =>
            isFavorite ? prev.filter((f) => f.id !== dog.id) : [...prev, dog]
        );
    };

    const findMatch = async () => {
        if (dogs.length === 0) {
            return;
        }
        const dogIds = dogs.map((dog) => dog.id);
        const match = await matchDogs(dogIds);
        const matchedDogDetails = dogs.find(
            (dog) => dog.id === match.data.match
        );
        if (matchedDogDetails) {
            const userData = sessionStorage.getItem("user");
            if (userData) {
                const { name, email } = JSON.parse(userData);
                const key = `matchedDog-${name}-${email}`;
                setMatchedDog(matchedDogDetails);
                sessionStorage.setItem(key, JSON.stringify(matchedDogDetails));
                setIsMatchDialogOpen(true);
            }
        }
    };

    return (
        <Container>
            <Box className="flex items-center space-x-2">
                <Typography variant="subtitle1">Breed:</Typography>
                <Select
                    value={selectedBreed || ""}
                    onChange={handleBreedChange}
                    style={{ minWidth: "150px" }}
                >
                    {breeds.map((breed) => (
                        <MenuItem key={breed} value={breed}>
                            {breed}
                        </MenuItem>
                    ))}
                </Select>

                <Typography variant="subtitle1">Sort By:</Typography>
                <Select
                    value={sortOrder}
                    onChange={(e) =>
                        setSortOrder(e.target.value as "asc" | "desc")
                    }
                    style={{ minWidth: "150px" }}
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
            </Box>
            {matchedDog && (
                <Box className="ml-4">
                    <Typography variant="subtitle1">Matched Dog:</Typography>
                    <Typography>
                        {matchedDog.name} - {matchedDog.breed}
                    </Typography>
                </Box>
            )}

            <DogList
                dogs={sortedDogs}
                favorites={favorites}
                onFavorite={toggleFavorite}
            />

            <CustomPagination
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={!!nextCursor}
                hasPrev={cursors.length > 0 || !!prevCursor}
            />

            <Button onClick={findMatch}>Find a Match</Button>
            <Dialog
                open={isMatchDialogOpen}
                onClose={() => setIsMatchDialogOpen(false)}
            >
                <DialogTitle>Your Matched Dog for Adoption</DialogTitle>
                <DialogContent>
                    {matchedDog && (
                        <div>
                            <Typography variant="h6">
                                {matchedDog.name}
                            </Typography>
                            <Typography variant="body1">
                                {matchedDog.breed}
                            </Typography>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsMatchDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DogSearchPage;
