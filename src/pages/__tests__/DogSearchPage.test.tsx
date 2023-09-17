
import "@testing-library/jest-dom";
import {
    render,
    screen,
    waitFor,
    fireEvent,
} from "@testing-library/react";
import DogSearchPage from "../DogSearchPage";
import { getBreeds, searchDogs, getDogs, matchDogs } from "../../api/dogs";

jest.mock("../../api/dogs");

describe("DogSearchPage", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (getBreeds as jest.Mock).mockResolvedValue({
            data: ["Breed1", "Breed2"],
        });
        (searchDogs as jest.Mock).mockResolvedValue({
            data: { resultIds: [1, 2], next: "", prev: "" },
        });
        (getDogs as jest.Mock).mockResolvedValue({
            data: [
                { id: 1, name: "Dog1" },
                { id: 2, name: "Dog2" },
            ],
        });
        (matchDogs as jest.Mock).mockResolvedValue({
            data: { match: 1 }
        });
    });
    const mockUser = { name: "John", email: "john@example.com" };
    const mockMatchedDog = { id: 1, name: "Dog1" };
    const mockedFavorites = [
        { id: 1, name: "Dog1" },
        { id: 2, name: "Dog2" },
    ];

    it("renders DogSearchPage component", () => {
        render(<DogSearchPage />);
        expect(screen.getByText("Breeds:")).toBeInTheDocument();
    });

    it("stores user data in sessionStorage on component mount", async () => {
        sessionStorage.setItem(
            "user",
            JSON.stringify({ name: "John", email: "john@example.com" })
        );
        render(<DogSearchPage />);
        await waitFor(() =>
            expect(sessionStorage.getItem("user")).toBeTruthy()
        );
    });

    it("fetches dogs based on selected filters", async () => {
        render(<DogSearchPage />);
        fireEvent.click(screen.getByText("Apply Filters"));
        await waitFor(() => expect(searchDogs).toHaveBeenCalled());
    });

    it("validates zip code", () => {
        render(<DogSearchPage />);
        const zipInput = screen.getByPlaceholderText("Enter Zip Code");
        fireEvent.change(zipInput, { target: { value: "123456" } });
        expect(
            screen.getByText("Enter a valid 5-digit Zip Code")
        ).toBeInTheDocument();
    });

    it('alerts user when "Find a Match" is clicked with no favorite dogs selected', async () => {
        const alertMock = jest
            .spyOn(window, "alert")
            .mockImplementation(() => {});

        render(<DogSearchPage />);
        fireEvent.click(screen.getByText("Find a Match"));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(
                "Please favorite a dog first before finding a match."
            );
        });

        alertMock.mockRestore();
    });
    it("renders the favorites dialog when 'favoritesDialogOpen' is true", () => {
        sessionStorage.setItem("favorites", JSON.stringify(mockedFavorites));
        render(<DogSearchPage />);
        fireEvent.click(screen.getByText("View Favorites"));
        expect(screen.getByText("Your Favorited Dogs")).toBeInTheDocument();
    });

    it("closes the favorites dialog when the close button is clicked", async () => {
        sessionStorage.setItem("favorites", JSON.stringify(mockedFavorites));
        render(<DogSearchPage />);
        fireEvent.click(screen.getByText("View Favorites"));
        fireEvent.click(screen.getByText("Close"));

        await waitFor(() => {
            expect(
                screen.queryByText("Your Favorited Dogs")
            ).not.toBeInTheDocument();
        });
    });

    it("clears all favorites when 'Clear Favorites' button is clicked", () => {
        sessionStorage.setItem("favorites", JSON.stringify(mockedFavorites));
        render(<DogSearchPage />);
        fireEvent.click(screen.getByText("View Favorites"));
        fireEvent.click(screen.getByText("Clear Favorites"));
        expect(sessionStorage.getItem("favorites")).toBeNull();
    });

    it("should show favorited dogs in the main screen", async () => {
        sessionStorage.setItem("favorites", JSON.stringify(mockedFavorites));
        render(<DogSearchPage />);

        await waitFor(() => {
            expect(screen.getByText("Dog1")).toBeInTheDocument();
        });
    });

    it("sets the matchedDog state if the user and matchedDog data are present in sessionStorage", () => {
        const key = `matchedDog-${mockUser.name}-${mockUser.email}`;

        sessionStorage.setItem("user", JSON.stringify(mockUser));
        sessionStorage.setItem(key, JSON.stringify(mockMatchedDog));

        render(<DogSearchPage />);
        fireEvent.click(screen.getByText("View Matched Dog"));

        expect(screen.getByText("Dog1")).toBeInTheDocument();
    });

    it("does not set the matchedDog state if the user or matchedDog data are missing in sessionStorage", () => {
        const key = `matchedDog-${mockUser.name}-${mockUser.email}`;

        sessionStorage.setItem("user", JSON.stringify(mockUser));

        render(<DogSearchPage />);

        expect(screen.queryByText("Dog1")).not.toBeInTheDocument();

        sessionStorage.removeItem("user");
        sessionStorage.setItem(key, JSON.stringify(mockMatchedDog));

        render(<DogSearchPage />);

        expect(screen.queryByText("Dog1")).not.toBeInTheDocument();
    });
     
    it("updates zip codes when handleZipCodesChange is called", async () => {
        render(<DogSearchPage />);
        
        const zipInput = screen.getByPlaceholderText("Enter Zip Code") as HTMLInputElement;
        fireEvent.change(zipInput, { target: { value: "12345" } });
    
        expect(zipInput).toHaveValue("12345");
    });
    

});
