import React, { Component } from "react";
import './quize.css';

class Score extends Component {
    render() {
        return (
            <div className="result">
                <h2>🎉 Quiz Completed!</h2>
                <p>Thank you for taking the quiz. Great effort!</p>
                <button className="close-btn" onClick={() => window.location.href = "/"}>Close</button>
            </div>
        );
    }
}

export default Score;
