import React, { useState } from "react";
import "../css/bootstrap.min.css";
import "../css/font-awesome.min.css";
import "../css/flaticon.css";
import "../css/owl.carousel.min.css";
import "../css/barfiller.css";
import "../css/magnific-popup.css";
import "../css/slicknav.min.css";
import "../css/style.css";
import "./BmiCalculator.css";
import "font-awesome/css/font-awesome.min.css";

function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [bmiResult, setBmiResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (height && weight) {
      setLoading(true); // Hiển thị loader khi bắt đầu tính toán
      setTimeout(() => {
        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(
          2
        );
        let bmiCategory = "";

        if (bmiValue < 18.5) {
          bmiCategory = "Underweight";
        } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
          bmiCategory = "Healthy";
        } else if (bmiValue >= 25 && bmiValue <= 29.9) {
          bmiCategory = "Overweight";
        } else {
          bmiCategory = "Obese";
        }

        setBmiResult(
          `Your body fat ratio is <strong style="color: #ff5722;">${bmiValue}</strong>.<br>You are: <strong style="color: #ff5722; text-transform: uppercase;">${bmiCategory}</strong>`
        );
        setLoading(false); // Ẩn loader khi tính toán xong
        setShowPopup(true); // Hiển thị popup sau khi tính toán
      }, 2000); // Giả lập thời gian tính toán 2 giây
    } else {
      alert("Please enter valid height and weight");
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Đóng popup
  };

  return (
    <div>
      {/* BMI Calculator Section Begin */}
      <section className="bmi-calculator-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title chart-title">
                <span>check your body</span>
                <h2>BMI CALCULATOR CHART</h2>
              </div>
              <div className="chart-table">
                <table>
                  <thead>
                    <tr>
                      <th>BMI</th>
                      <th>WEIGHT STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="point">Below 18.5</td>
                      <td>Underweight</td>
                    </tr>
                    <tr>
                      <td className="point">18.5 - 24.9</td>
                      <td>Healthy</td>
                    </tr>
                    <tr>
                      <td className="point">25.0 - 29.9</td>
                      <td>Overweight</td>
                    </tr>
                    <tr>
                      <td className="point">30.0 - and Above</td>
                      <td>Obese</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title chart-calculate-title">
                <span>check your body</span>
                <h2>CALCULATE YOUR BMI</h2>
              </div>
              <div className="chart-calculate-form">
                <form onSubmit={calculateBMI}>
                  <div className="row">
                    <div className="col-sm-6">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Height / cm"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Weight / kg"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        className="form-control"
                      />
                    </div>
                    <div className="col-sm-6">
                      <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="form-control"
                        required
                      >
                        <option value="" disabled>
                          Select Sex
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-warning">
                        Calculate
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BMI Calculator Section End */}

      {/* Loader */}
      {loading && (
        <div id="preloder">
          <div className="loader"></div>
        </div>
      )}

      {/* Popup hiện bảng và kết quả BMI */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>BMI Result</h3>
            <table>
              <thead>
                <tr>
                  <th>BMI</th>
                  <th>WEIGHT STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below 18.5</td>
                  <td>Underweight</td>
                </tr>
                <tr>
                  <td>18.5 - 24.9</td>
                  <td>Healthy</td>
                </tr>
                <tr>
                  <td>25.0 - 29.9</td>
                  <td>Overweight</td>
                </tr>
                <tr>
                  <td>30.0 - and Above</td>
                  <td>Obese</td>
                </tr>
              </tbody>
            </table>
            <p
              style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}
              dangerouslySetInnerHTML={{ __html: bmiResult }}
            />
            <button className="btn btn-primary" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BmiCalculator;
