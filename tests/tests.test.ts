import { describe, it, expect } from '@jest/globals';


describe('Sample Test Suite', () => {
    it('should add two numbers correctly', () => {
        const sum = 2 + 3;
        expect(sum).toBe(5);
    });

    it('should return true for a truthy value', () => {
        const value = 'hello';
        expect(Boolean(value)).toBe(true);
    });

    it('should throw an error when required', () => {
        const throwError = () => {
            throw new Error('Test error');
        };
        expect(throwError).toThrow('Test error');
    });
});