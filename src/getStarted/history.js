import React from 'react'
import historyStyle from './history.module.css'

const History = ({ isOpen, onClose, history , isLightMode}) => {
    if (!isOpen) return null;
  
    return (
        <div className={isLightMode ? historyStyle.light : historyStyle.dark}>
<div className={historyStyle.dialogbox}>
        <div className={historyStyle.content}>
          <button className={historyStyle.closebutton} onClick={onClose}>
            &times;
          </button>
          <h2>History</h2>
          <div className={historyStyle.historylist}>
            {history.length > 0 ? (
              history.map((entry, index) => (
                <div key={index} className={historyStyle.historyitems}>
                  <p>{entry.expression} = {entry.result}</p>
                </div>
              ))
            ) : (
              <p>No history available.</p>
            )}
          </div>
        </div>
      </div>
        </div>
      
    );
  };

export default History
