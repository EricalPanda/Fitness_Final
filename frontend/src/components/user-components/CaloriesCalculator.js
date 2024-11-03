import React, { useState } from "react";
import "../css/bootstrap.min.css";
import "../css/font-awesome.min.css";
import "../css/flaticon.css";
import "../css/owl.carousel.min.css";
import "../css/barfiller.css";
import "../css/magnific-popup.css";
import "../css/slicknav.min.css";
import "../css/style.css";
import "./CaloriesCalculator.css"; // Import CSS mới

function CaloriesCalculator() {
  const [height, setHeight] = useState(170); // Default height in cm
  const [weight, setWeight] = useState(65); // Default weight in kg
  const [age, setAge] = useState(25); // Default age
  const [gender, setGender] = useState("male"); // Default gender
  const [activityLevel, setActivityLevel] = useState("sedentary"); // Default activity level
  const [calories, setCalories] = useState(null); // State to store calculated daily calories
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  // Function to calculate daily calories based on gender, age, weight, height, and activity level
  const handleCalculate = (e) => {
    e.preventDefault();

    if (height <= 0 || weight <= 0) {
      setCalories(NaN); // Set calories to NaN if height or weight is 0
      return;
    }

    let bmr;
    if (gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }

    let activityMultiplier;
    switch (activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2;
        break;
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "veryActive":
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }

    const dailyCalories = (bmr * activityMultiplier).toFixed(2); // Tính lượng calo hàng ngày

    // Thêm thời gian chờ 2 giây trước khi hiển thị popup
    setTimeout(() => {
      setCalories(dailyCalories);
      setLoading(false); // Ẩn loader
      setShowPopup(true); // Hiển thị popup sau 2 giây
    }, 1000); // Thời gian chờ 2 giây
  };

  return (
    <div>
      {/* Calorie Calculator Section Begin */}
      <section className="bmi-calculator-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div style={{ color: "#fff", marginBottom: "20px" }}>
                <h3 style={{ color: "#fff", marginBottom: "20px" }}>
                  Calories Daily Calculator
                </h3>
                <p>
                  Simply put, Calories are the energy that your body needs to
                  function and everything you eat is converted into calories.
                </p>
                <p>
                  Calories Daily Calculator is a tool that helps you calculate
                  your body's daily calorie needs based on factors such as
                  height, weight, age, gender and activity level.
                </p>
                <p>
                  Calculating your calorie needs helps you better understand
                  your diet and supports you in maintaining or adjusting your
                  weight.
                </p>
                <p>
                  Calculating daily calories is important so that you can adjust
                  your food intake, thereby helping you achieve your health
                  goals, whether it is weight loss, weight maintenance or weight
                  gain.
                </p>
              </div>
            </div>
          </div>
          <div className="chart-calculate-form">
            <form onSubmit={handleCalculate}>
              <div className="row">
                {/* Gender Selection */}
                <div className="col-lg-12">
                  <label style={{ color: "#fff" }}>Gender:</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#fff",
                        marginRight: "20px",
                        position: "relative",
                        padding: "0 5px",
                      }}
                    >
                      <input
                        type="radio"
                        value="male"
                        id="gender-male"
                        checked={gender === "male"}
                        onChange={(e) => setGender(e.target.value)}
                        style={{
                          position: "absolute",
                          opacity: 0,
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          height: "12px",
                          width: "12px",
                          borderRadius: "50%",
                          backgroundColor:
                            gender === "male" ? "#f36100" : "transparent",
                          border: "3px solid #f36100",
                          display: "inline-block",
                          marginRight: "5px",
                        }}
                      ></span>
                      Male
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#fff",
                        position: "relative",
                        padding: "0 5px",
                      }}
                    >
                      <input
                        type="radio"
                        value="female"
                        id="gender-female"
                        checked={gender === "female"}
                        onChange={(e) => setGender(e.target.value)}
                        style={{
                          position: "absolute",
                          opacity: 0,
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          height: "12px",
                          width: "12px",
                          borderRadius: "50%",
                          backgroundColor:
                            gender === "female" ? "#f36100" : "transparent",
                          border: "3px solid #f36100",
                          display: "inline-block",
                          marginRight: "5px",
                        }}
                      ></span>
                      Female
                    </label>
                  </div>
                </div>

                {/* Height Input */}
                <div className="col-lg-12">
                  <label style={{ color: "#fff" }} htmlFor="height-input">
                    Height (cm):
                  </label>
                  <input
                    id="height-input"
                    type="number"
                    min="0"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    style={{
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                {/* Weight Input */}
                <div className="col-lg-12">
                  <label style={{ color: "#fff" }} htmlFor="weight-input">
                    Weight (kg):
                  </label>
                  <input
                    id="weight-input"
                    type="number"
                    min="0"
                    max="200"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={{
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                {/* Age Input */}
                <div className="col-lg-12">
                  <label style={{ color: "#fff" }} htmlFor="age-input">
                    Age (Years Old):
                  </label>
                  <input
                    id="age-input"
                    type="number"
                    min="1"
                    max="117"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={{
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                                        {/* Activity Level Input */}
                                        <div className="col-lg-12">
                                            <label style={{ color: '#fff' }}>Activity Level:</label>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: '10px',
                                                marginBottom: '15px',
                                            }}>
                                                {/* Checkbox inputs for activity levels */}
                                                <label style={{ color: '#fff', fontSize: '14px', position: 'relative', padding: '0 5px' }}>
                                                    <input
                                                        type="checkbox"
                                                        value="sedentary"
                                                        checked={activityLevel === 'sedentary'}
                                                        onChange={(e) => setActivityLevel(e.target.checked ? 'sedentary' : '')}
                                                        style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                                                    />
                                                    <span style={{
                                                        height: '12px',
                                                        width: '12px',
                                                        borderRadius: '3px',
                                                        backgroundColor: activityLevel === 'sedentary' ? '#f36100' : 'transparent',
                                                        border: '3px solid #f36100',
                                                        display: 'inline-block',
                                                        marginRight: '5px',
                                                    }}></span>
                                                    Sedentary: little or no exercise
                                                </label>
                                                {/* Additional activity level checkboxes */}
                                                <label style={{ color: '#fff', fontSize: '14px', position: 'relative', padding: '0 5px' }}>
                                                    <input
                                                        type="checkbox"
                                                        value="light"
                                                        checked={activityLevel === 'light'}
                                                        onChange={(e) => setActivityLevel(e.target.checked ? 'light' : '')}
                                                        style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                                                    />
                                                    <span style={{
                                                        height: '12px',
                                                        width: '12px',
                                                        borderRadius: '3px',
                                                        backgroundColor: activityLevel === 'light' ? '#f36100' : 'transparent',
                                                        border: '3px solid #f36100',
                                                        display: 'inline-block',
                                                        marginRight: '5px',
                                                    }}></span>
                                                    Light exercise: exercise 1-3 times/week
                                                </label>
                                                <label style={{ color: '#fff', fontSize: '14px', position: 'relative', padding: '0 5px' }}>
                                                    <input
                                                        type="checkbox"
                                                        value="moderate"
                                                        checked={activityLevel === 'moderate'}
                                                        onChange={(e) => setActivityLevel(e.target.checked ? 'moderate' : '')}
                                                        style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                                                    />
                                                    <span style={{
                                                        height: '12px',
                                                        width: '12px',
                                                        borderRadius: '3px',
                                                        backgroundColor: activityLevel === 'moderate' ? '#f36100' : 'transparent',
                                                        border: '3px solid #f36100',
                                                        display: 'inline-block',
                                                        marginRight: '5px',
                                                    }}></span>
                                                    Moderate exercise: exercise 4-5 times/week
                                                </label>
                                                <label style={{ color: '#fff', fontSize: '14px', position: 'relative', padding: '0 5px' }}>
                                                    <input
                                                        type="checkbox"
                                                        value="active"
                                                        checked={activityLevel === 'active'}
                                                        onChange={(e) => setActivityLevel(e.target.checked ? 'active' : '')}
                                                        style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                                                    />
                                                    <span style={{
                                                        height: '12px',
                                                        width: '12px',
                                                        borderRadius: '3px',
                                                        backgroundColor: activityLevel === 'active' ? '#f36100' : 'transparent',
                                                        border: '3px solid #f36100',
                                                        display: 'inline-block',
                                                        marginRight: '5px',
                                                    }}></span>
                                                    Active: exercise daily or high intensity exercise 4-5 times/week
                                                </label>
                                                <label style={{ color: '#fff', fontSize: '14px', position: 'relative', padding: '0 5px' }}>
                                                    <input
                                                        type="checkbox"
                                                        value="veryActive"
                                                        checked={activityLevel === 'veryActive'}
                                                        onChange={(e) => setActivityLevel(e.target.checked ? 'veryActive' : '')}
                                                        style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                                                    />
                                                    <span style={{
                                                        height: '12px',
                                                        width: '12px',
                                                        borderRadius: '3px',
                                                        backgroundColor: activityLevel === 'veryActive' ? '#f36100' : 'transparent',
                                                        border: '3px solid #f36100',
                                                        display: 'inline-block',
                                                        marginRight: '5px',
                                                    }}></span>
                                                    Very active: high intensity exercise 6-7 times/week
                                                </label>
                                            </div>
                                        </div>

                {/* Calculate Button */}
                <div className="col-lg-12">
                  <button type="submit" data-testid="calculate-button">
                    Calculate
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* Calorie Calculator Section End */}

      {/* Loader */}
      {loading && (
        <div id="preloder">
          <div className="loader"></div>
        </div>
      )}

      {/* Popup Section Begin */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              X
            </button>
            <h3>
              Your Daily Calories:{" "}
              <span className="calories-result">{calories}</span>
            </h3>
            <div style={{ marginTop: "20px" }}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Calories/Day</th>
                    <th>Weight Status</th>
                    <th>Calories Needed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Maintain weight</td>
                    <td>
                      {calories === NaN ? "NaN" : `${calories} Calories/day`}
                    </td>
                    <td>100%</td>
                  </tr>
                  <tr>
                    <td>Mild weight loss (0.25kg/week)</td>
                    <td>
                      {calories === NaN
                        ? "NaN"
                        : `${(calories * 0.9).toFixed(2)} Calories/day`}
                    </td>
                    <td>90%</td>
                  </tr>
                  <tr>
                    <td>Weight loss (0.5kg/week)</td>
                    <td>
                      {calories === NaN
                        ? "NaN"
                        : `${(calories * 0.81).toFixed(2)} Calories/day`}
                    </td>
                    <td>81%</td>
                  </tr>
                  <tr>
                    <td>Significant weight loss (1kg/week)</td>
                    <td>
                      {calories === NaN
                        ? "NaN"
                        : `${(calories * 0.61).toFixed(2)} Calories/day`}
                    </td>
                    <td>61%</td>
                  </tr>
                  <tr>
                    <td>Mild weight gain (0.25kg/week)</td>
                    <td>
                      {calories === NaN
                        ? "NaN"
                        : `${(calories * 1.1).toFixed(2)} Calories/day`}
                    </td>
                    <td>110%</td>
                  </tr>
                  <tr>
                    <td>Weight gain (0.5kg/week)</td>
                    <td>
                      {calories === NaN
                        ? "NaN"
                        : `${(calories * 1.19).toFixed(2)} Calories/day`}
                    </td>
                    <td>119%</td>
                  </tr>
                  <tr>
                    <td>Significant weight gain (1kg/week)</td>
                    <td>
                      {calories === NaN
                        ? "NaN"
                        : `${(calories * 1.39).toFixed(2)} Calories/day`}
                    </td>
                    <td>139%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Popup Section End */}
    </div>
  );
}

export default CaloriesCalculator;
