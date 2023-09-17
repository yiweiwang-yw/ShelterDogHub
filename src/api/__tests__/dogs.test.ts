import "@testing-library/jest-dom";
import * as apiModule from "../index";
import { getBreeds, searchDogs, getDogs, matchDogs } from "../dogs";

jest.mock("../index");

const mockApi = apiModule.default;

describe("Dogs API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch breeds", async () => {
        const mockResponse = {
            data: ["Bulldog", "Golden Retriever", "Labrador"],
        };
        (mockApi.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getBreeds();
        expect(result).toEqual(mockResponse);
        expect(mockApi.get).toHaveBeenCalledWith("/dogs/breeds");
    });

    it("should search dogs with given parameters", async () => {
        const mockResponse = { data: ["Dog1", "Dog2", "Dog3"] };
        (mockApi.get as jest.Mock).mockResolvedValue(mockResponse);
        const params = {
            breeds: ["Bulldog"],
            zipCodes: ["12345"],
            ageMin: 1,
            ageMax: 10,
            size: 25,
            from: "25",
            sort: "asc",
        };

        const result = await searchDogs(
            params.breeds,
            params.zipCodes,
            params.ageMin,
            params.ageMax,
            params.size,
            params.from,
            params.sort
        );

        expect(result).toEqual(mockResponse);
        expect(mockApi.get).toHaveBeenCalledWith("/dogs/search", { params });
    });

    it("should fetch dogs by ids", async () => {
        const mockResponse = { data: [{ id: "1", name: "Rex" }] };
        (mockApi.post as jest.Mock).mockResolvedValue(mockResponse);
        const dogIds = ["1", "2", "3"];

        const result = await getDogs(dogIds);
        expect(result).toEqual(mockResponse);
        expect(mockApi.post).toHaveBeenCalledWith("/dogs", dogIds);
    });

    it("should match dogs by ids", async () => {
        const mockResponse = { match: "1" };
        (mockApi.post as jest.Mock).mockResolvedValue(mockResponse);
        const dogIds = ["1", "2", "3"];

        const result = await matchDogs(dogIds);
        expect(result).toEqual(mockResponse);
        expect(mockApi.post).toHaveBeenCalledWith("/dogs/match", dogIds);
    });

    it("should handle getBreeds API error", async () => {
        (mockApi.get as jest.Mock).mockRejectedValue(new Error("API Error"));

        await expect(getBreeds()).rejects.toThrow("API Error");
    });

    it("should search dogs with just one parameter", async () => {
        const mockResponse = {
            resultIds: ["1", "2"],
            total: 2,
            next: "next-query",
            prev: "prev-query",
        };
        (mockApi.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await searchDogs(["Bulldog"]);
        expect(result).toEqual(mockResponse);
        expect(mockApi.get).toHaveBeenCalledWith("/dogs/search", {
            params: { breeds: ["Bulldog"], size: 25 },
        });
    });

    it("should search dogs with no parameters", async () => {
        const mockResponse = {
            resultIds: ["1", "2", "3"],
            total: 3,
            next: "next-query",
            prev: "prev-query",
        };
        (mockApi.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await searchDogs();
        expect(result).toEqual(mockResponse);
        expect(mockApi.get).toHaveBeenCalledWith("/dogs/search", {
            params: { size: 25 },
        });
    });

    it("should handle searchDogs API error", async () => {
        (mockApi.get as jest.Mock).mockRejectedValue(new Error("API Error"));

        await expect(searchDogs(["Bulldog"])).rejects.toThrow("API Error");
    });

    it("should handle getDogs API error", async () => {
        (mockApi.post as jest.Mock).mockRejectedValue(new Error("API Error"));

        await expect(getDogs(["1", "2", "3"])).rejects.toThrow("API Error");
    });

    it("should handle matchDogs API error", async () => {
        (mockApi.post as jest.Mock).mockRejectedValue(new Error("API Error"));

        await expect(matchDogs(["1", "2", "3"])).rejects.toThrow("API Error");
    });
});
