import React from "react";
import cover from "../assests/backcover.mp4";
import homestyle from "./home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const goto = () => {
    setTimeout(() => {
      navigate("/getStarted");
    }, 1000);
  };
  return (
    <>
      <div className={homestyle.videocontainer}>
        <h1>
          <span>Get Calculating</span> – It's Just a Click Away!
        </h1>
        <video autoPlay loop muted className={homestyle.video}>
          <source src={cover} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button onClick={goto} className={homestyle.btn}>
          Get Started
        </button>
        <p>
          Made with ❤️ by <span>Urooj Sadiq</span>
        </p>
      </div>
    </>
  );
};

export default Home;
