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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import DogList from "../components/DogList/DogList";
import { Dog } from "../types/types";
import { getBreeds, searchDogs, getDogs, matchDogs } from "../api/dogs";
import CustomPagination from "../components/Pagination/CustomPagination";

type AgeSelectorProps = {
    age: number | undefined;
    setAge: React.Dispatch<React.SetStateAction<number | undefined>>;
    label: string;
};

const AgeSelector: React.FC<AgeSelectorProps> = ({ age, setAge, label }) => (
    <>
        <Typography variant="subtitle1">{label}:</Typography>
        <Select
            value={age ? age : ""}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ minWidth: "100px", marginRight: "10px" }}
        >
            <MenuItem value="">Any</MenuItem>
            {Array.from({ length: 21 }).map((_, index) => (
                <MenuItem key={index} value={index}>
                    {index} {index === 1 ? "Year" : "Years"}
                </MenuItem>
            ))}
        </Select>
    </>
);

const DogSearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [favorites, setFavorites] = useState<Dog[]>([]);
    const [cursors, setCursors] = useState<string[]>([]);
    const [requestedCursor, setRequestedCursor] = useState<
        string | undefined
    >();
    const [nextCursor, setNextCursor] = useState<string | undefined>();
    const [prevCursor, setPrevCursor] = useState<string | undefined>();
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [isMatchDialogOpen, setIsMatchDialogOpen] = useState<boolean>(false);
    const [favoritesDialogOpen, setFavoritesDialogOpen] =
        useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
    const [ageMin, setAgeMin] = useState<number | undefined>();
    const [ageMax, setAgeMax] = useState<number | undefined>();

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
        const storedFavorites = sessionStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites) as Dog[]);
        }
    }, []);

    useEffect(() => {
        async function fetchDogs() {
            const sortQuery = `breed:${sortOrder}`;
            const response = await searchDogs(
                selectedBreeds,
                selectedZipCodes,
                ageMin,
                ageMax,
                25,
                requestedCursor,
                sortQuery
            );
            console.log(response.data);

            setNextCursor(getCursorFromQueryString(response.data.next));
            setPrevCursor(getCursorFromQueryString(response.data.prev));

            const dogDetails = await getDogs(response.data.resultIds);
            setDogs(dogDetails.data);
        }
        fetchDogs();
    }, [
        selectedBreeds,
        selectedZipCodes,
        ageMin,
        ageMax,
        requestedCursor,
        sortOrder,
    ]);

    useEffect(() => {
        if (ageMin && ageMax && ageMin > ageMax) {
            setAgeMax(ageMin);
        }
    }, [ageMin]);

    useEffect(() => {
        if (ageMax && ageMin && ageMax < ageMin) {
            setAgeMin(ageMax);
        }
    }, [ageMax]);

    const handleBreedsChange = (event: SelectChangeEvent<string[]>) => {
        if (event.target.value.includes("Remove Selection")) {
            setSelectedBreeds([]);
        } else {
            setSelectedBreeds(event.target.value as string[]);
        }
    };

    const handleZipCodesChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.value.trim() === "") {
            setSelectedZipCodes([]);
        } else {
            setSelectedZipCodes([event.target.value.trim()]);
        }
    };

    const handleNext = () => {
        if (nextCursor) {
            setCursors((prev) => [...prev, nextCursor]);
            setRequestedCursor(nextCursor);
        }
    };

    const handlePrev = () => {
        if (prevCursor || cursors.length > 0) {
            if (cursors.length > 1) {
                const newCursors = [...cursors];
                newCursors.pop();
                setCursors(newCursors);
                setRequestedCursor(newCursors[newCursors.length - 1]);
            } else {
                setRequestedCursor(undefined);
                setCursors([]);
            }
        }
    };

    const toggleFavorite = (dog: Dog) => {
        const isFavorite = favorites.some((favDog) => favDog.id === dog.id);
        const newFavorites = isFavorite
            ? favorites.filter((f) => f.id !== dog.id)
            : [...favorites, dog];

        setFavorites(newFavorites);
        if (newFavorites.length === 0) {
            setFavoritesDialogOpen(false);
        }

        sessionStorage.setItem("favorites", JSON.stringify(newFavorites));
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

    const resetFilters = () => {
        setSelectedBreeds([]);
        setSelectedZipCodes([]);
        setAgeMin(undefined);
        setAgeMax(undefined);
        setSortOrder("asc");
    };

    return (
        <Container>
            <Box className="flex items-center space-x-2">
                <Typography variant="subtitle1">Breeds:</Typography>
                <Select
                    multiple
                    value={selectedBreeds}
                    onChange={handleBreedsChange}
                    renderValue={(selected) =>
                        (selected as string[]).join(", ")
                    }
                    style={{ minWidth: "150px" }}
                >
                    <MenuItem value="Remove Selection">
                        <Checkbox
                            checked={
                                selectedBreeds.length === breeds.length ||
                                selectedBreeds.includes("Remove Selection")
                            }
                        />
                        <ListItemText primary="Remove Selection" />
                    </MenuItem>
                    {breeds.map((breed) => (
                        <MenuItem key={breed} value={breed}>
                            <Checkbox
                                checked={selectedBreeds.includes(breed)}
                            />
                            <ListItemText primary={breed} />
                        </MenuItem>
                    ))}
                </Select>

                <Typography variant="subtitle1">Zip Code:</Typography>
                <input
                    type="text"
                    value={selectedZipCodes}
                    onChange={handleZipCodesChange}
                    placeholder="Enter Zip Code"
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <AgeSelector age={ageMin} setAge={setAgeMin} label="Age Min" />
                <AgeSelector age={ageMax} setAge={setAgeMax} label="Age Max" />
                <Button onClick={resetFilters}>Reset Filters</Button>
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

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                my={2}
            >
                {matchedDog && (
                    <Box>
                        <Typography variant="subtitle1">
                            Matched Dog:
                        </Typography>
                        <Typography>
                            {matchedDog.name} - {matchedDog.breed}
                        </Typography>
                    </Box>
                )}
                <Button
                    onClick={() => setFavoritesDialogOpen(true)}
                    disabled={favorites.length === 0}
                >
                    View Favorites
                </Button>
            </Box>

            <Dialog
                fullScreen
                open={favoritesDialogOpen}
                onClose={() => setFavoritesDialogOpen(false)}
            >
                <DialogTitle>
                    Your Favorited Dogs
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setFavoritesDialogOpen(false)}
                        aria-label="close"
                        style={{
                            position: "absolute",
                            right: "8px",
                            top: "8px",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DogList
                        dogs={favorites}
                        favorites={favorites}
                        onFavorite={toggleFavorite}
                    />
                </DialogContent>
            </Dialog>

            {dogs.length === 0 ? (
                <Typography variant="h6">No dogs are available</Typography>
            ) : (
                <DogList
                    dogs={dogs}
                    favorites={favorites}
                    onFavorite={toggleFavorite}
                />
            )}

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
