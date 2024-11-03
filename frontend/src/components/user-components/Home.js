import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Slider from "react-slick"; // Nhập Slider từ react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      {/* Hero Section Begin */}
      <section className="hero-section">
        <Slider {...settings}>
          {" "}
          {/* Mở comment và sử dụng Slider */}
          <div className="hs-item set-bg">
            <img
              className="hs-item"
              src={require("../img/hero/hero-1.jpg")}
              alt="Description"
            />
            <div className="container">
              <div className="row">
                <div className="col-lg-6 offset-lg-6">
                  <div className="hi-text">
                    <span>Shape your body</span>
                    <h1>
                      Be <strong>strong</strong>
                      <br />
                      training hard
                    </h1>
                    <a href="#" className="primary-btn">
                      Get info
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hs-item set-bg">
            <img
              className="hs-item"
              src={require("../img/hero/hero-2.jpg")}
              alt="Description"
            />
            <div className="container">
              <div className="row">
                <div className="col-lg-6 offset-lg-6">
                  <div className="hi-text">
                    <span>Shape your body</span>
                    <h1>
                      Be <strong>strong</strong>
                      <br />
                      training hard
                    </h1>
                    <a href="#" className="primary-btn">
                      Get info
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slider>{" "}
        {/* Đóng Slider */}
      </section>
      {/* Hero Section End */}

      {/* Choose Us Section Begin */}
      <section className="choseus-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>Why choose us?</span>
                <h2>PUSH YOUR LIMITS FORWARD</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="cs-item">
                <span className="flaticon-034-stationary-bike"> </span>
                <h4>Modern equipment</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="cs-item">
                <span className="flaticon-031-strong"></span>
                <h4>Trained instructors</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="cs-item">
                <span className="flaticon-040-weightlifting"></span>
                <h4>Fitness programs</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="cs-item">
                <span className="flaticon-008-sport"></span>
                <h4>Support community</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Choose Us Section End */}

      {/* Team Section Begin */}
      <section className="team-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="team-title">
                <div className="section-title">
                  <span>Our Team</span>
                  <h2>TRAIN WITH EXPERTS</h2>
                </div>
                <a href="#" className="primary-btn btn-normal appoinment-btn">
                  appointment
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="ts-slider owl-carousel">
              <div className="col-lg-4">
                <div
                  className="ts-item set-bg"
                  style={{
                    backgroundImage: `url(${require("../img/team/team-1.jpg")})`,
                  }}
                >
                  <img
                    className="hs-item"
                    src={require("../img/team/team-1.jpg")}
                    alt="Description"
                  />
                  <div className="ts_text">
                    <h4>Athart Rachel</h4>
                    <span>Gym Trainer</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div
                  className="ts-item set-bg"
                  style={{
                    backgroundImage: `url(${require("../img/team/team-2.jpg")})`,
                  }}
                >
                  <div className="ts_text">
                    <h4>Athart Rachel</h4>
                    <span>Gym Trainer</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div
                  className="ts-item set-bg"
                  style={{
                    backgroundImage: `url(${require("../img/team/team-3.jpg")})`,
                  }}
                >
                  <div className="ts_text">
                    <h4>Athart Rachel</h4>
                    <span>Gym Trainer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Team Section End */}
    </div>
  );
}

export default Home;
