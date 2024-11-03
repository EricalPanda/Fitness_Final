// CaloriesCalculator.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CaloriesCalculator from '../src/components/user-components/CaloriesCalculator'; // Thay đổi đường dẫn nếu cần

describe('CaloriesCalculator Component', () => {
    beforeEach(() => {
        render(<CaloriesCalculator />);
    });

    it('displays default values for height, weight, age', () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const ageInput = screen.getByLabelText(/age/i);

        expect(heightInput.value).toBe('170'); // Giá trị mặc định chiều cao
        expect(weightInput.value).toBe('65'); // Giá trị mặc định cân nặng
        expect(ageInput.value).toBe('25'); // Giá trị mặc định tuổi
    });

    // it('updates input values and calculates calories on form submission', () => {
    //     const { getByLabelText, getByText } = render(<CaloriesCalculator />);

    //     // Thay đổi giá trị input cho chiều cao, cân nặng và tuổi
    //     fireEvent.change(getByLabelText(/Height \(cm\):/i), { target: { value: '180' } });
    //     fireEvent.change(getByLabelText(/Weight \(kg\):/i), { target: { value: '70' } });
    //     fireEvent.change(getByLabelText(/Age:/i), { target: { value: '30' } });

    //     // Gửi form
    //     fireEvent.click(getByText('Calculate'));

    //     // Kiểm tra xem có hiển thị kết quả tính toán hay không
    //     expect(getByText(/Your daily calories need is:/i)).toBeInTheDocument();
    // });

    it('calculates daily calories and displays the result correctly', async () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const ageInput = screen.getByLabelText(/age/i);
        const submitButton = screen.getByRole('button', { name: /calculate/i });

        // Nhập giá trị chiều cao, cân nặng và tuổi
        fireEvent.change(heightInput, { target: { value: 180 } });
        fireEvent.change(weightInput, { target: { value: 75 } });
        fireEvent.change(ageInput, { target: { value: 30 } });

        // Chọn giới tính
        fireEvent.click(screen.getByLabelText(/female/i));

        // Chọn mức độ hoạt động
        fireEvent.click(screen.getByLabelText(/moderate exercise/i));

        // Gửi form
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/your daily calories/i)).toBeInTheDocument();
            expect(screen.getByText(/calories needed/i)).toBeInTheDocument();
        });
    });

    it('calculates daily calories and displays the result correctly when height is less than weight', async () => {
        const heightInput = screen.getByLabelText(/height \(cm\):/i);
        const weightInput = screen.getByLabelText(/weight \(kg\):/i);
        const ageInput = screen.getByLabelText(/age/i);
        const submitButton = screen.getByRole('button', { name: /calculate/i });
    
        // Nhập giá trị chiều cao thấp hơn cân nặng
        fireEvent.change(heightInput, { target: { value: 50 } });  // Chiều cao 50 cm
        fireEvent.change(weightInput, { target: { value: 75 } });  // Cân nặng 75 kg
        fireEvent.change(ageInput, { target: { value: 30 } });     // Tuổi 30
    
        // Chọn giới tính
        fireEvent.click(screen.getByLabelText(/female/i));
    
        // Chọn mức độ hoạt động
        fireEvent.click(screen.getByLabelText(/moderate exercise/i));
    
        // Gửi form
        fireEvent.click(submitButton);
    
        await waitFor(() => {
            expect(screen.getByText(/your daily calories/i)).toBeInTheDocument();
            expect(screen.getByText(/calories needed/i)).toBeInTheDocument();
        });
    });

    // it('displays NaN when height is zero', async () => {
    //     const heightInput = screen.getByLabelText(/height \(cm\):/i);
    //     const weightInput = screen.getByLabelText(/weight \(kg\):/i);
    //     const ageInput = screen.getByLabelText(/age/i);
    //     const submitButton = screen.getByRole('button', { name: /calculate/i });
    
    //     // Nhập giá trị chiều cao bằng 0
    //     fireEvent.change(heightInput, { target: { value: 0 } });  // Chiều cao 0 cm
    //     fireEvent.change(weightInput, { target: { value: 75 } }); // Cân nặng 75 kg
    //     fireEvent.change(ageInput, { target: { value: 30 } });    // Tuổi 30
    
    //     // Chọn giới tính
    //     fireEvent.click(screen.getByLabelText(/female/i));
    
    //     // Chọn mức độ hoạt động
    //     fireEvent.click(screen.getByLabelText(/moderate exercise/i));
    
    //     // Gửi form
    //     fireEvent.click(submitButton);
    
    //     await waitFor(() => {
    //         // Kiểm tra chỉ một phần tử chứa NaN trong tiêu đề
    //         expect(screen.getByText(/Your Daily Calories:/i)).toBeInTheDocument();
    //         expect(screen.getByText(/NaN/i)).toBeInTheDocument(); // Kiểm tra hiển thị NaN
    //     });
    // });

    // Test kiểm tra thay đổi giá trị height
    it('allows changing the height input', () => {
        const { getByLabelText } = render(<CaloriesCalculator />);
        const heightInput = getByLabelText(/Height \(cm\):/i); // Tìm đầu vào height

        expect(heightInput.value).toBe("170"); // Kiểm tra giá trị mặc định

        fireEvent.change(heightInput, { target: { value: 180 } });
        expect(heightInput.value).toBe("180"); // Kiểm tra giá trị đã thay đổi
    });

});
