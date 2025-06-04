import React, { useEffect, useState } from "react";
import "../CSS/Anket.css";

const AkademisyenDegerlendirme = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  // Fetching questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://localhost:7230/api/Question/all");
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          console.error("Sorular API'den alınamadı.");
        }
      } catch (error) {
        console.error("API çağrısı sırasında hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handling radio button changes
  const handleRadioChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // Handling form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentId = getCookie("id");
    const teacherId = getCookie("teacherId");

    if (!studentId || !teacherId) {
      alert("Öğrenci veya akademisyen bilgisi eksik.");
      return;
    }

    const answersArray = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      answerId: value,
    }));

    if (answersArray.length !== questions.length) {
      alert("Tüm soruları cevaplamanız gerekmektedir.");
      return;
    }

    const payload = { studentId, teacherId, answers: answersArray };

    try {
      const response = await fetch("https://localhost:7230/api/Survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSurveyCompleted(true); // Anket tamamlandı mesajını göstermek için state güncelleniyor
      } else {
        alert("Değerlendirme kaydedilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Değerlendirme gönderimi sırasında hata:", error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  return (
    <div className="container">
      <h1>Akademisyen Değerlendirme Anketi</h1>
      {loading ? (
        <p>Loading questions...</p>
      ) : surveyCompleted ? (
        <div className="success-message">
          <h2>Tebrikler Anket Tamamlandı!</h2>
          <p>Değerlendirme için teşekkür ederiz.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} id="surveyForm">
          <div id="questionsContainer">
            {questions.map((question, index) => (
              <div key={index} className="question">
                <p>
                  {index + 1}. {question.question}
                </p>
                <div>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={value}
                        checked={answers[question.id] === value}
                        onChange={() => handleRadioChange(question.id, value)}
                      />
                      {
                        [
                          "Kesinlikle Katılmıyorum",
                          "Katılmıyorum",
                          "Kararsızım",
                          "Katılıyorum",
                          "Kesinlikle Katılıyorum",
                        ][value - 1]
                      }
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="submit">Kaydet</button>
        </form>
      )}
    </div>
  );
};

export default AkademisyenDegerlendirme;
