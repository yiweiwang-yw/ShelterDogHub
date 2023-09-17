import "@testing-library/jest-dom";
import * as apiModule from "../index";
import { login, logout } from "../auth";

jest.mock("../index");

const mockApi = apiModule.default;

describe('Auth API', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    it('should login successfully', async () => {
        const mockResponse = { data: 'Success' };
        (mockApi.post as jest.Mock).mockResolvedValue(mockResponse);
        const name = 'John Doe';
        const email = 'john.doe@example.com';

        const result = await login(name, email);

        expect(result).toEqual('Success');
        expect(mockApi.post).toHaveBeenCalledWith('/auth/login', { name, email });
        expect(sessionStorage.getItem("user")).toEqual(JSON.stringify({ name, email }));
    });

    it('should handle login error', async () => {
        (mockApi.post as jest.Mock).mockRejectedValue(new Error('API Error'));

        await expect(login('John Doe', 'john.doe@example.com')).rejects.toThrow('API Error');
        expect(sessionStorage.getItem("user")).toBeNull();
    });

    it('should logout successfully', async () => {
        const mockResponse = { data: 'Logged out' };
        (mockApi.post as jest.Mock).mockResolvedValue(mockResponse);
        const name = 'John Doe';
        const email = 'john.doe@example.com';
        sessionStorage.setItem("user", JSON.stringify({ name, email }));
        sessionStorage.setItem(`matchedDog-${name}-${email}`, 'Dog1');

        const result = await logout();

        expect(result).toEqual('Logged out');
        expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
        expect(sessionStorage.getItem("user")).toBeNull();
        expect(sessionStorage.getItem(`matchedDog-${name}-${email}`)).toBeNull();
    });

    it('should handle logout error', async () => {
        (mockApi.post as jest.Mock).mockRejectedValue(new Error('API Error'));

        await expect(logout()).rejects.toThrow('API Error');
    });

    it('should handle logout when no user data is present in sessionStorage', async () => {
        const mockResponse = { data: 'Logged out' };
        (mockApi.post as jest.Mock).mockResolvedValue(mockResponse);
        sessionStorage.clear(); 
        const result = await logout();
    
        expect(result).toBeUndefined();
        expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
        expect(sessionStorage.getItem("user")).toBeNull();
    });
});