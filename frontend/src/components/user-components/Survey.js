import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Survey.css";

const Survey = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(17);
  const widgetRef = useRef(null);
  const surveyContainerRef = useRef(null);
  const isDragging = useRef(false);

  const surveyData = {
    1: {
      question: "Do you have a website?",
      answer: {
        1: { type: "radio", dynamic: true, route: 4, item: "yes" },
        2: { type: "radio", dynamic: true, route: 2, item: "no" },
      },
      image: "https://example.com/question1.jpg",
    },
    2: {
      question: "Do you have a domain?",
      answer: {
        1: { type: "radio", dynamic: true, route: 3, item: "yes" },
        2: { type: "radio", dynamic: true, route: 6, item: "no" },
      },
      image: "https://example.com/question2.jpg",
    },
    // Thêm các câu hỏi khác với hình ảnh tương ứng...
  };

  useEffect(() => {
    const onDrag = (e) => {
      if (!isDragging.current) return;
    };

    const stopDrag = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };

    const startDrag = () => {
      isDragging.current = true;
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", stopDrag);
    };

    openWidget();

    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("mousemove", onDrag);
    };
  }, []);

  const openWidget = () => {
    const widget = widgetRef.current;
    setTimeout(() => {
      widget.classList.add("active");
    }, 800);
    widget.classList.add("loaded");
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    widgetRef.current.classList.remove("active");
    openWidget();
  };

  const renderQuestion = () => {
    const currentData = surveyData[currentPage];
    if (!currentData) return null;

    const { question, answer } = currentData;

    return (
      <div
        className={`mm-survey-page mm-survey-page-${currentPage} ${
          currentPage === 1 ? "active" : ""
        }`}
        data-page={currentPage}
      >
        <div className="mm-survey-content">
          <p className="survey-question">{question}</p>
          {Object.keys(answer).map((key) => {
            const { type, item, placeholder, identity } = answer[key];
            switch (type) {
              case "radio":
                return (
                  <div key={key} className="mm-survey-item mb-3">
                    <input
                      type="radio"
                      id={`radio${currentPage}-${key}`}
                      name={`radio${currentPage}`}
                      value={item}
                    />
                    <label htmlFor={`radio${currentPage}-${key}`}>
                      <span className="radio-circle"></span>
                      <p className="radio-text">{item}</p>
                    </label>
                  </div>
                );
              case "text":
                return (
                  <div key={key} className="mm-survey-item mb-3">
                    <input
                      type="text"
                      className={`form-control ${identity}`}
                      placeholder={placeholder}
                    />
                  </div>
                );
              case "form":
                return (
                  <div key={key} className="mm-dynamic-form-item mb-3">
                    <p className="form-label">{placeholder}</p>
                    <input
                      type="text"
                      className={`form-control ${identity}`}
                      placeholder={placeholder}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="survey-container d-flex align-items-center justify-content-center">
      <div className="back-button">
        <button
          onClick={() => (window.location.href = "/")}
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
      <div className="survey-box">
        <form
          action="#"
          method="post"
          ref={widgetRef}
          onSubmit={handleSubmit}
          className="survey-form"
        >
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            ></div>
          </div>
          <div ref={surveyContainerRef} className="survey-content">
            {renderQuestion()}
            {/* <img
              src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/hinh-nen-anime-1.jpg"
              alt="My Image"
              className="survey-image"
            /> */}
          </div>
          <div className="survey-controller d-flex justify-content-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="btn btn-primary"
            >
              Prev
            </button>
            {currentPage === totalPages ? (
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Survey;
