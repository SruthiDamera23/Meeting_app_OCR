import React from "react";
import { useNavigate } from "react-router-dom";

const Pricing_plan = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/signup");
  };
  return (
    <>
      <div className="main-div">
        <h6 className="choose">Choose Your Plan</h6>
        <div className="pricing-container">
          <div className="pricing-card">
            <h2 className="h2">Starter</h2>
            <h5>
              <b className="b">$10.00</b> / month
            </h5>
            <p>Basic features included</p>
            <button onClick={handleNavigate}>Choose</button>
            <p>
              Starter <b>3</b> Users
            </p>
          </div>

          <div className="pricing-card">
            <h2 className="h2">Gold</h2>
            <h5>
              <b className="b">$20.00</b> / month
            </h5>

            <p>Advanced features included</p>
            <button onClick={handleNavigate}>Choose</button>
            <p>
              Gold <b>7</b> Users
            </p>
          </div>

          <div className="pricing-card adv">
            <span class="best-choice">BEST CHOICE</span>
            <h2 className="h2">Premium</h2>
            <h5>
              <b className="b">$30.00</b> / month
            </h5>
            <p className="para">Premium features included</p>
            <button onClick={handleNavigate}>Choose</button>
            <p>
              Premium <b> 12 </b> Users
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing_plan;
