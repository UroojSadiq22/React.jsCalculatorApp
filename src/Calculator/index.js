import React, { useState } from "react";
import calculatorstyle from "./calculator.module.css";
import { evaluate , asin , acos , atan } from 'mathjs'

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
    "asin",
    "acos",
    "atan",
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
    // sin: (value) =>
    //   isDegreeMode ? Math.sin(degToRad(value)) : Math.sin(value),
    // cos: (value) =>
    //   isDegreeMode ? Math.cos(degToRad(value)) : Math.cos(value),
    // tan: (value) =>
    //   isDegreeMode ? Math.tan(degToRad(value)) : Math.tan(value),
    // asin: (value) => isDegreeMode ? radToDeg(asin(value)) : asin(value),
    // acos: (value) => isDegreeMode ? radToDeg(acos(value)) : acos(value),
    // atan: (value) => isDegreeMode ? radToDeg(atan(value)) : atan(value),
    // sin: (value) => Math.sin(value),
    // cos: (value) => Math.cos(value),
    // tan: (value) => Math.tan(value),
    // asin: (value) => Math.asin(value),
    // acos: (value) => Math.acos(value),
    // atan: (value) => Math.atan(value),
    
    sin: (value) => Math.sin(isDegreeMode ? degToRad(value) : value),
    cos: (value) => Math.cos(isDegreeMode ? degToRad(value) : value),
    tan: (value) => Math.tan(isDegreeMode ? degToRad(value) : value),
    asin: (value) => (isDegreeMode ? radToDeg(asin(value)) : asin(value)),
    acos: (value) => (isDegreeMode ? radToDeg(acos(value)) : acos(value)),
    atan: (value) => (isDegreeMode ? radToDeg(atan(value)) : atan(value)),
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
        

        // Replace inverse trigonometric functions with mathjs equivalents
      modifiedExp = modifiedExp
        .replace(/asin\(([^)]+)\)/g, (_, val) => scientificFunctions["asin"](val))
        .replace(/acos\(([^)]+)\)/g, (_, val) => scientificFunctions["acos"](val))
        .replace(/atan\(([^)]+)\)/g, (_, val) => scientificFunctions["atan"](val));

      // Replace other scientific functions with mathjs equivalents
      modifiedExp = modifiedExp
      .replace(/sin\(([^)]+)\)/g, (_, val) => scientificFunctions["sin"](val))
      .replace(/cos\(([^)]+)\)/g, (_, val) => scientificFunctions["cos"](val))
      .replace(/tan\(([^)]+)\)/g, (_, val) => scientificFunctions["tan"](val))
      .replace(/ln\(([^)]+)\)/g, (_, val) => scientificFunctions["ln"](val))
      .replace(/log\(([^)]+)\)/g, (_, val) => scientificFunctions["log"](val))
      .replace(/√\(([^)]+)\)/g, (_, val) => scientificFunctions["√"](val))
      .replace(/∛\(([^)]+)\)/g, (_, val) => scientificFunctions["∛"](val))
      .replace(/π/g, scientificFunctions["π"]())
      .replace(/e/g, scientificFunctions["e"]());
console.log(modifiedExp);

      // Use mathjs for evaluation
      let compute = evaluate(modifiedExp);
      console.log("Result after evaluation:", compute);

      // if(isDegreeMode){
      //   compute = radToDeg(compute)
      // }
      console.log(compute);
      
        // Determine the number of decimal places based on calculator type
        const decimalPlaces = isScientific ? 9 : 7;
        const formattedresult = parseFloat(compute.toFixed(decimalPlaces));

        setResult(formattedresult.toString());

        // Update history with the current expression and result
        setHistory([...history, { expression, result: formattedresult.toString() }]);
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
