import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Question from "./Question";
import { useParams } from 'react-router-dom';
import Score from "./Score";
import { getQuizById } from "../../../API/quizeApi";
import "./quize.css";
import { submitQuizResult } from "../../../API/quizSubmissionApi";
import { useAuth } from "../../../context/AuthContext";

function Quiz() {
    // const [questionBank] = useState(qBank);
    const [questionBank, setQuestionBank] = useState([]);
    const [loading, setLoading] = useState(true);
    const { quizId } = useParams();
    const [questionStatus, setQuestionStatus] = useState([]);
    const { user } = useAuth();


    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizEnd, setQuizEnd] = useState(false);
    
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // 5-minute timer
    const [tabSwitchCount, setTabSwitchCount] = useState(0);


    // Fetch quiz questions on mount
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await getQuizById(quizId);
                setQuestionBank(res.qBank);
                setQuestionStatus(new Array(res.qBank.length).fill("unvisited"));
                // Calculate total marks
                const totalMarks = res.qBank.reduce((sum, q) => sum + (q.marks || 1), 0);

                // Calculate time based on total marks (e.g., 30 seconds per mark)
                const calculatedTime = totalMarks * 30; // 30 sec per mark
                setTimeLeft(calculatedTime);

            } catch (err) {
                console.error("Failed to fetch quiz:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ""; // Required for most modern browsers
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setTabSwitchCount(prev => prev + 1);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    
    

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        const h = Math.floor(seconds/3600);
        return `${h}h ${m}m ${s}s`;
    };

    const handleOptionChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        if (!selectedOption) {
            console.log("not selected");
            updateQuestionStatus("unanswered");
            return;
        }
    
        console.log("selected");
    
        const isCorrect = selectedOption === questionBank[currentQuestion].answer;
    
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestion]: selectedOption,
        }));
    
        setScore((prevScore) =>
            isCorrect ? prevScore + questionBank[currentQuestion].marks : prevScore
        );
    
        updateQuestionStatus("answered");
    
        handleNextQuestion();
    };
    
   
    
    const handleNextQuestion = () => {
        if (!selectedOption && questionStatus[currentQuestion] !== "answered") {
            updateQuestionStatus("unanswered");
        }
    
        if (currentQuestion + 1 < questionBank.length) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedOption(selectedAnswers[currentQuestion + 1] || "");
        }
    };
    
    

    const handlePreviousQuestion = () => {
        if (!selectedOption && questionStatus[currentQuestion] !== "answered") {
            updateQuestionStatus("unanswered");
        }
    
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
            setSelectedOption(selectedAnswers[currentQuestion - 1] || "");
        }
    };
    

    const updateQuestionStatus = (status) => {
        setQuestionStatus((prevStatus) => {
            const updated = [...prevStatus];
            updated[currentQuestion] = status;
            return updated;
        });
    };
    
    const handleSubmitQuiz = useCallback(async () => {
        if (quizEnd) return;
    
        let correct = 0, incorrect = 0, totalScore = 0;
        questionBank.forEach((question, index) => {
            if (selectedAnswers[index] === question.answer) {
                correct++;
                totalScore += question.marks;
            } else if (selectedAnswers[index]) {
                incorrect++;
            }
        });
        const totalMarks = questionBank.reduce((total, question) => total + question.marks, 0);
        
        setCorrectCount(correct);
        setWrongCount(incorrect);
        setScore(totalScore);
        setQuizEnd(true);
    
        // Send to MongoDB
        try {
            
            await submitQuizResult({
                quizId,
                userId: `${user.email}`, // Replace with actual user ID from auth
                score: totalScore,
                correctCount: correct,
                total:totalMarks,
                tabSwitchCount,
                submittedAnswers: selectedAnswers
            });
            console.log("Quiz result submitted.");
        } catch (error) {
            console.error("Failed to submit quiz result:", error);
        }
    }, [quizEnd, questionBank, selectedAnswers, tabSwitchCount, quizId, user.email]);
    



    const goToQuestion = (index) => {
        if (!selectedAnswers[currentQuestion] && questionStatus[currentQuestion] !== "answered") {
            updateQuestionStatus("unanswered");
        }
        setCurrentQuestion(index);
    };

    


    const countStatus = (status) => questionStatus.filter(s => s === status).length;

    const renderQuestionPreview = () => (
        <div className="question-preview">
            {questionStatus.map((status, index) => (
                <button
                    key={index}
                    className={`question-preview-btn ${status} ${currentQuestion === index ? "active" : ""}`}
                    onClick={() => goToQuestion(index)}
                >
                    {index + 1}
                </button>
            ))}
        </div>

    );

    // Auto-set selected option when navigating questions
    useEffect(() => {
        setSelectedOption(selectedAnswers[currentQuestion] || "");
    }, [currentQuestion, selectedAnswers]);

    // Watch for visibility change (tab switch detection)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => prev + 1);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    // Trigger quiz submission after tab switches
    useEffect(() => {
        if (tabSwitchCount >= 3) {
            alert("You switched tabs/resized multiple times. The quiz will be submitted automatically.");
            handleSubmitQuiz();
        } else if (tabSwitchCount === 1) {
            alert("Warning! Switching tabs or resizing the window is not allowed.");
        }
    }, [tabSwitchCount, handleSubmitQuiz]);


    // Auto-submit when timer runs out
    useEffect(() => {
        if (quizEnd) return;

        if (timeLeft <= 0) {
            handleSubmitQuiz();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, quizEnd, handleSubmitQuiz]);



    return (
        <div className="quize-main-container">
            
            <h1 className="app-title">SSM LEC MindSprint</h1>
            {!quizEnd ? (
                <>
                    <div className="timer">
                        <p>Time Left: {formatTime(timeLeft)}</p>
                    </div>
                    <Question
                    question={questionBank[currentQuestion]}
                    selectedOption={selectedOption}
                    onOptionChange={handleOptionChange}
                    onSubmit={handleFormSubmit}
                   
                />

                    <div className="navigation-buttons">
                        <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="prev-btn">
                            Previous
                        </button>
                        <button onClick={handleNextQuestion} disabled={currentQuestion === questionBank.length - 1} className="next-btn">
                            Next
                        </button>
                        <button onClick={handleSubmitQuiz} className="submit-btn">
                            Submit Quiz
                        </button>
                    </div>
                    <div className="question-status">
                        {renderQuestionPreview()}
                    </div>
                    <div className="status-summary">
                        <button className="score-btn">Unvisited: {countStatus("unvisited")}</button>
                        <button className="score-btn">Answered: {countStatus("answered")}</button>
                        <button className="score-btn">Unanswered: {countStatus("unanswered")}</button>
                    </div>
                </>
            ) : (
                <div className="result">
                    <h2>🎉 Quiz Completed!</h2>
                    <p>Thank you for taking the quiz. Great effort!</p>
                    <button className="close-btn" onClick={() => window.location.href = "/"}>Close</button>
                </div>
            )}
        </div>
    );
}

export default Quiz;
