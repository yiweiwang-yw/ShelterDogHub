import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    Autocomplete,
    TextField,
    Box,
    Grid,
    Snackbar
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from '@mui/material/Alert'; 
import DogList from "../components/DogList";
import AgeSelector from "../components/AgeSelector";
import { Dog } from "../types/types";
import { getBreeds, searchDogs, getDogs, matchDogs } from "../api/dogs";
import CustomPagination from "../components/CustomPagination";

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
    const [loading, setLoading] = useState<boolean>(true);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const fetchDogs = async (
        breeds: string[],
        zipCodes: string[] | undefined,
        minAge: number | undefined,
        maxAge: number | undefined,
        order: "asc" | "desc"
    ) => {
        setLoading(true);
        try{const sortQuery = `breed:${order}`;
        const response = await searchDogs(
            breeds,
            zipCodes && zipCodes.length > 0 ? zipCodes : undefined,
            minAge,
            maxAge,
            25,
            requestedCursor,
            sortQuery
        );

        setNextCursor(getCursorFromQueryString(response.data.next));
        setPrevCursor(getCursorFromQueryString(response.data.prev));

        const dogDetails = await getDogs(response.data.resultIds);
        setDogs(dogDetails.data);}
        catch(e){
            console.log(e);
            setSnackbarMessage("An error occurred while fetching dogs.");
            setSnackbarOpen(true);
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchBreeds = async () => {
            const response = await getBreeds();
            setBreeds(response.data);
        };

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
        fetchDogs(selectedBreeds, selectedZipCodes, ageMin, ageMax, sortOrder);
    }, [requestedCursor, sortOrder]);

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

    const handleBreedsChange = (event: any, newValue: string[]) => {
        setSelectedBreeds(newValue);
    };

    const handleZipCodesChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const zipCode = event.target.value.trim();
        if (zipCode) {
            setSelectedZipCodes([zipCode]);
        } else {
            setSelectedZipCodes([]);
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
        if (favorites.length === 0) {
            alert("Please favorite a dog first before finding a match.");
            return;
        }

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

    const applyFilters = () => {
        fetchDogs(selectedBreeds, selectedZipCodes, ageMin, ageMax, sortOrder);
    };

    const validateZipCode = (zipCode: string): boolean => {
        return /^\d{5}$/.test(zipCode);
    };

    const handleSearchClick = () => {
        const zip = selectedZipCodes.toString();
        if (zip && !validateZipCode(zip)) {
            alert("Please enter a valid 5-digit Zip Code.");
            return;
        }
        applyFilters();
    };

    const resetFilters = () => {
        setSelectedBreeds([]);
        setSelectedZipCodes([]);
        setAgeMin(undefined);
        setAgeMax(undefined);
        setSortOrder("asc");
        fetchDogs([], [], undefined, undefined, "asc");
    };

    type MatchedDogDialogProps = {
        dog: Dog | null;
    };

    const MatchedDogDialog: React.FC<MatchedDogDialogProps> = ({ dog }) => {
        return (
            <Dialog
                open={isMatchDialogOpen}
                onClose={() => setIsMatchDialogOpen(false)}
            >
                <DialogTitle>Your Matched Dog for Adoption</DialogTitle>
                <DialogContent>
                    {dog && (
                        <div>
                            <Typography variant="h6">{dog.name}</Typography>
                            <Typography variant="body1">{dog.breed}</Typography>
                            <Typography>{`Age: ${dog.age} years`}</Typography>
                            <Typography>{`Zip Code: ${dog.zip_code}`}</Typography>
                            <img
                                src={dog.img}
                                alt={dog.name}
                                className="w-full h-full object-cover max-w-sm mx-auto"
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsMatchDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Box>
                        <Typography variant="subtitle1">Breeds:</Typography>
                        <Autocomplete
                            multiple
                            options={breeds}
                            value={selectedBreeds}
                            onChange={handleBreedsChange}
                            style={{ marginRight: "10px", width: "100%" }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Choose Breeds"
                                />
                            )}
                        />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1">Zip Code:</Typography>
                        <TextField
                            value={selectedZipCodes.toString()}
                            onChange={handleZipCodesChange}
                            placeholder="Enter Zip Code"
                            variant="outlined"
                            style={{ marginRight: "10px", width: "100%" }}
                            error={
                                !validateZipCode(selectedZipCodes.toString()) &&
                                selectedZipCodes.toString() !== ""
                            }
                            helperText={
                                !validateZipCode(selectedZipCodes.toString()) &&
                                selectedZipCodes.toString() !== ""
                                    ? "Enter a valid 5-digit Zip Code"
                                    : ""
                            }
                        />
                    </Box>
                    <Box>
                        <AgeSelector
                            age={ageMin}
                            setAge={setAgeMin}
                            label="Age Min"
                        />
                        <AgeSelector
                            age={ageMax}
                            setAge={setAgeMax}
                            label="Age Max"
                        />
                    </Box>
                    <Box className="flex items-center justify-between space-x-2 mt-4 w-full">
                        <Button variant="contained" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                        <Button variant="contained" onClick={handleSearchClick}>
                            Apply Filters
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={9}>
                    <Typography variant="subtitle1">Sort By:</Typography>
                    <Select
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(e.target.value as "asc" | "desc")
                        }
                        className="w-1/4 mb-4"
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                    <Box className="flex items-center justify-between space-x-2 mb-4">
                        <Button
                            variant="contained"
                            onClick={() => setFavoritesDialogOpen(true)}
                            disabled={favorites.length === 0}
                        >
                            View Favorites
                        </Button>

                        <Button variant="contained" onClick={findMatch}>
                            {matchedDog ? "Find a new match" : "Find a Match"}
                        </Button>

                        {matchedDog ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsMatchDialogOpen(true)}
                            >
                                View Matched Dog
                            </Button>
                        ) : (
                            <Button variant="contained" disabled>
                                View Matched Dog
                            </Button>
                        )}

                        <MatchedDogDialog dog={matchedDog} />
                    </Box>
                    <Dialog
                        fullScreen
                        open={favoritesDialogOpen}
                        onClose={() => setFavoritesDialogOpen(false)}
                    >
                        <DialogTitle>
                            Your Favorited Dogs
                            <Button
                                color="inherit"
                                onClick={() => setFavoritesDialogOpen(false)}
                                aria-label="close"
                                style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "8px",
                                }}
                            >
                                Close
                            </Button>
                        </DialogTitle>
                        <DialogContent>
                            <DogList
                                dogs={favorites}
                                favorites={favorites}
                                onFavorite={toggleFavorite}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setFavorites([]);
                                    sessionStorage.removeItem("favorites");
                                    setFavoritesDialogOpen(false);
                                }}
                            >
                                Clear Favorites
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {loading ? (
                        <Typography variant="h6">Loading...</Typography>
                    ) : dogs.length === 0 ? (
                        <Typography variant="h6">
                            No dogs are available
                        </Typography>
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
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DogSearchPage;
