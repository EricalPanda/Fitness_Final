// BmiCalculator.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BmiCalculator from '../src/components/user-components/BmiCalculator';

describe('BmiCalculator Component', () => {
    beforeEach(() => {
        render(<BmiCalculator />);
    });
    
    it('displays default values for height and weight', () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);

        expect(heightInput.value).toBe('170'); // Default height
        expect(weightInput.value).toBe('65'); // Default weight
    });

    it('calculates BMI and displays the result correctly', async () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const submitButton = screen.getByRole('button', { name: /calculate/i });

        // Thay đổi giá trị chiều cao và cân nặng
        fireEvent.change(heightInput, { target: { value: 180 } });
        fireEvent.change(weightInput, { target: { value: 75 } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/your bmi:/i)).toBeInTheDocument();
            expect(screen.getByText(/body status:/i)).toBeInTheDocument();
            expect(screen.getByText('Your BMI: 23.15')).toBeInTheDocument(); // 75 / (1.8 * 1.8)
            expect(screen.getByText('Body Status: Healthy')).toBeInTheDocument();
        });
    });

    it('calculates BMI and displays result for healthy weight', async () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const submitButton = screen.getByRole('button', { name: /calculate/i });

        // Set height to 180 cm and weight to 75 kg
        fireEvent.change(heightInput, { target: { value: 180 } });
        fireEvent.change(weightInput, { target: { value: 75 } });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Your BMI: 23.15/i)).toBeInTheDocument();
        expect(await screen.findByText(/Body Status: Healthy/i)).toBeInTheDocument();
    });

    it('handles BMI calculation for underweight status', async () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const submitButton = screen.getByRole('button', { name: /calculate/i });

        // Thay đổi giá trị chiều cao và cân nặng để tính BMI dưới 18.5
        fireEvent.change(heightInput, { target: { value: 160 } });
        fireEvent.change(weightInput, { target: { value: 40 } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/your bmi:/i)).toBeInTheDocument();
            expect(screen.getByText('Your BMI: 15.62')).toBeInTheDocument(); // 40 / (1.6 * 1.6)
            expect(screen.getByText('Body Status: Underweight')).toBeInTheDocument();
        });
    });

    it('handles BMI calculation for overweight status', async () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const submitButton = screen.getByRole('button', { name: /calculate/i });

        // Thay đổi giá trị chiều cao và cân nặng để tính BMI từ 25 đến 29.9
        fireEvent.change(heightInput, { target: { value: 175 } });
        fireEvent.change(weightInput, { target: { value: 85 } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/your bmi:/i)).toBeInTheDocument();
            expect(screen.getByText('Your BMI: 27.76')).toBeInTheDocument(); // 85 / (1.75 * 1.75)
            expect(screen.getByText('Body Status: Overweight')).toBeInTheDocument();
        });
    });

    it('handles BMI calculation for obese status', async () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const submitButton = screen.getByRole('button', { name: /calculate/i });

        // Thay đổi giá trị chiều cao và cân nặng để tính BMI từ 30 trở lên
        fireEvent.change(heightInput, { target: { value: 170 } });
        fireEvent.change(weightInput, { target: { value: 100 } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/your bmi:/i)).toBeInTheDocument();
            expect(screen.getByText('Your BMI: 34.60')).toBeInTheDocument(); // 100 / (1.70 * 1.70)
            expect(screen.getByText('Body Status: Obese')).toBeInTheDocument();
        });
    });
});
