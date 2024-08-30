import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import getStartedStyle from "./getstarted.module.css";
import Calculator from "../Calculator";
import History from "./history";

const GetStarted = () => {
  const [isScientific, setIsScientific] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const toggleScientific = () => {
    setIsScientific(!isScientific);
  };

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  const showHistory = () => {
    setOpenHistory(true);
  };
  const closeHistory = () => {
    setOpenHistory(false);
  };

  const navigate = useNavigate();
  const gotoHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div
      className={`${getStartedStyle.container} ${
        isLightMode ? getStartedStyle.light : getStartedStyle.dark
      }`}
    >
      <div className={`${getStartedStyle.functionalities}`}>
        <div className={getStartedStyle.back}>
          <button onClick={gotoHome}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Go Back to Home</span>
          </button>
        </div>

        <div>
          <button onClick={toggleTheme}>
            <i className={`fa-solid ${isLightMode ? "fa-moon" : "fa-sun"}`}></i>
            <span>Toggle Theme</span>
          </button>
        </div>
        <div>
          <button onClick={toggleScientific}>
            <i className="fa-solid fa-braille"></i>
            <span>Scientific Mode</span>
          </button>
        </div>
        <div>
          <button onClick={showHistory}>
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span>Show History</span>
          </button>
        </div>
      </div>
      <div>
        <Calculator
          isScientific={isScientific}
          isLightMode={isLightMode}
          history={history}
          setHistory={setHistory}
        />
      </div>
      <History
        isLightMode={isLightMode}
        isOpen={openHistory}
        onClose={closeHistory}
        history={history}
      />
    </div>
  );
};

export default GetStarted;
