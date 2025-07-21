import React, { Component } from "react";
import Options from "./Option";
import "./quize.css";

class Question extends Component {
    render() {
        const { question, selectedOption, onOptionChange, onSubmit } = this.props;

        // 🛡️ Guard clause to avoid breaking if question is undefined
        if (!question) {
            return <div className="quize-container">Loading question...</div>;
        }

        return (
            <div className="quize-container">
                <h3>Question {question.id}</h3>
                <p><strong>Marks:</strong> {question.marks}</p>
                <h5 className="mt-2">{question.question}</h5>
                <form onSubmit={onSubmit} className="mt-2-mb-2">
                    <Options
                        options={question.options}
                        selectedOption={selectedOption}
                        onOptionChange={onOptionChange}
                    />
                    <button
                    type="submit"
                    className="submit-btn"
                    disabled={!selectedOption} // ✅ Disable if no option is selected
                    >
                    Submit
                    </button>
                </form>
            </div>
        );
    }
}

export default Question;
