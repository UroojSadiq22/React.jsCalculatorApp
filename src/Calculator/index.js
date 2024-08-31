import React, { useState } from "react";
import calculatorstyle from "./calculator.module.css";
import { evaluate } from 'mathjs'

const Calculator = ({ isScientific, isLightMode, history, setHistory }) => {
  const [expression, setExpression] = useState("");
  const [displayexpression, setDisplayExpression] = useState("");
  const [result, setResult] = useState("0");
  const [isDegreeMode, setIsDegreeMode] = useState(true);

  const buttonValues = [
    !isDegreeMode ? "DEG" : "RAD",
    "AC",
    "DE",
    "+",
    "7",
    "8",
    "9",
    "-",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "/",
    "=",
    "0",
    ".",
    "%",
  ];

  const scientificButtons = [
    "sin",
    "cos",
    "tan",
    "log",
    "sin-1",
    "cos-1",
    "tan-1",
    "^",
    "√",
    "π",
    "e",
    "ln",
    "∛",
    "!",
    "(",
    ")",
  ];

  const scientificFunctions = {
    sin: (value) =>
      isDegreeMode ? Math.sin(degToRad(value)) : Math.sin(value),
    cos: (value) =>
      isDegreeMode ? Math.cos(degToRad(value)) : Math.cos(value),
    tan: (value) =>
      isDegreeMode ? Math.tan(degToRad(value)) : Math.tan(value),
    "sin-1": (value) =>
      isDegreeMode ? radToDeg(Math.asin(value)) : Math.asin(value),
    "cos-1": (value) =>
      isDegreeMode ? radToDeg(Math.acos(value)) : Math.acos(value),
    "tan-1": (value) =>
      isDegreeMode ? radToDeg(Math.atan(value)) : Math.atan(value),
    ln: (value) => Math.log(value),
    log: (value) => Math.log10(value),
    π: () => Math.PI,
    e: () => Math.E,
    "^": (base, exp) => Math.pow(base, exp),
    "√": (value) => Math.sqrt(value),
    "∛": (value) => Math.cbrt(value),
  };

  const degToRad = (degrees) => (degrees * Math.PI) / 180;
  const radToDeg = (radians) => (radians * 180) / Math.PI;

  const buttonHandler = (value) => {
    const buttonValue = value;

    if (buttonValue === "AC") {
      clearHandler();
    } else if (buttonValue === "DE") {
      deleteHandler();
    } else if (buttonValue === "DEG" || buttonValue === "RAD") {
      toggleDegreeMode();
    } else if (buttonValue === "=") {
      calculateHandler();
    } else if (buttonValue === "%") {
      setExpression(expression + "/100");
      setDisplayExpression(displayexpression + buttonValue);
    } else if (scientificFunctions.hasOwnProperty(buttonValue)) {
      if (buttonValue === "π" || buttonValue === "e") {
        // Handle constants π and e
        const constantValue = buttonValue === "π" ? Math.PI : Math.E;
        setExpression(expression + constantValue);
        setDisplayExpression(displayexpression + buttonValue);
      }
      else {
        setExpression(expression + buttonValue + "(");
        setDisplayExpression(displayexpression + buttonValue + "(");
      }
    } else if (buttonValue === "!") {
      const lastNumber = findLastNumber(expression);
      if (lastNumber !== null) {
        const number = parseFloat(lastNumber);
        setDisplayExpression(displayexpression + buttonValue);
        setExpression(expression.replace(lastNumber, factorial(number)));
      }
    } else {
      setExpression(expression + buttonValue);
      setDisplayExpression(displayexpression + buttonValue);
    }
  };

  const clearHandler = () => {
    setExpression("");
    setDisplayExpression("");
    setResult("0");
  };

  const deleteHandler = () => {
    setExpression(expression.slice(0, -1));
    setDisplayExpression(displayexpression.slice(0, -1));
  };

  const calculateHandler = () => {
    if (expression.length !== 0) {
      try {
        let modifiedExp = expression;

        // Add implicit multiplication handling

        modifiedExp = modifiedExp.replace(/(\d+|\))\s*(\()/g, "$1*$2");

        // Handle power (^) by replacing it with Math.pow
        // modifiedExp = modifiedExp.replace(
        //   /(\d+(?:\.\d+)?|\([^)]+\))\s*\^\s*(\d+(?:\.\d+)?|\([^)]+\))/g,
        //   (match, base, exp) => {
        //     return `Math.pow(${base},${exp})`;
        //   }
        // );

        Object.keys(scientificFunctions).forEach((key) => {
          const regExp = new RegExp(`${key}\\(([^)]+)\\)`, "g");
          modifiedExp = modifiedExp.replace(regExp, (_, inner) => {
            const value = parseFloat(inner);
            return scientificFunctions[key](value);
          });
        });
        let compute = evaluate(modifiedExp);

        // Determine the number of decimal places based on calculator type
        const decimalPlaces = isScientific ? 9 : 7;
        compute = parseFloat(compute.toFixed(decimalPlaces));

        setResult(compute.toString());

        // Update history with the current expression and result
        setHistory([...history, { expression, result: compute.toString() }]);
      } catch (error) {
        setResult("Error");
      }
    } else {
      setResult("error");
    }
  };

  const findLastNumber = (exp) => {
    const numbers = exp.match(/\d+/g);
    const answer = numbers ? numbers[numbers.length - 1] : null;
    return answer;
  };

  const factorial = (n) => {
    if (n < 0) return "error";
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const toggleDegreeMode = () => {
    setIsDegreeMode(!isDegreeMode);
  };

  return (
    <div
      className={`${
        isScientific
          ? calculatorstyle.calculatorscientific
          : calculatorstyle.calculatorbasic
      } ${isLightMode ? calculatorstyle.light : calculatorstyle.dark}`}
    >
      <div className={calculatorstyle.displaywindow}>
        <p className={calculatorstyle.degMode}>
          {isDegreeMode ? "DEG" : "RAD"}
        </p>
        <div>
          <p className={calculatorstyle.expression}>{displayexpression}</p>
          <h1 className={calculatorstyle.result}>{result}</h1>
        </div>
      </div>
      <div className={calculatorstyle.buttonscontainer}>
        <div className={calculatorstyle.buttons}>
          {buttonValues.map((item, index) => (
            <button
              key={index}
              onClick={() => buttonHandler(item)}
              className={
                item === "=" || item === "DEG" || item === "RAD"
                  ? calculatorstyle.equalbutton
                  : calculatorstyle.button
              }
            >
              {item}
            </button>
          ))}
        </div>

        {isScientific && (
          <>
            <div className={calculatorstyle.line}>&nbsp;</div>
            <div className={calculatorstyle.scientificbuttons}>
              {scientificButtons.map((item, index) => (
                <button
                  key={index}
                  onClick={() => buttonHandler(item)}
                  className={calculatorstyle.scientificButton}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Calculator;
