import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "../CSS/Hocalar.css";
import { useNavigate } from "react-router-dom";

const TeacherCards = () => {
  const [teachers, setTeachers] = useState([]);
  const cookies = new Cookies();
  const navigate = useNavigate();

  // Öğretim görevlilerini API'den al
  const fetchTeachers = async (department) => {
    const apiUrl = `https://localhost:7230/api/Teacher/all/${department}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data); // Öğretim görevlilerini state'e kaydet
      } else {
        console.error("API'den veri alınamadı.", response.status);
      }
    } catch (error) {
      console.error("API çağrısı sırasında hata:", error);
    }
  };

  // Çıkış yap işlemi
  const handleLogout = () => {
    cookies.remove("id", { path: "/" });
    cookies.remove("teacherId", { path: "/" });
    cookies.remove("department", { path: "/" });
    navigate("/"); // Login sayfasına yönlendirme
  };

  // Değerlendirme kontrolü
  const checkTeacherEvaluation = async (studentId, teacherId) => {
    const apiUrl = `https://localhost:7230/api/Evaluation/check/${studentId}/${teacherId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (result === true) {
          alert("Bu hoca daha önce değerlendirilmiştir.");
        } else {
          window.location.href = "/Anket"; // Anket sayfasına yönlendirme
        }
      } else {
        console.error("API'den cevap alınamadı.", response.status);
      }
    } catch (error) {
      console.error("API çağrısı sırasında hata:", error);
    }
  };

  // Kart tıklama işlemi
  const handleCardClick = (teacherId) => {
    cookies.set("teacherId", teacherId, { path: "/" }); // Çerezlere öğretmen ID'yi kaydet

    const studentId = cookies.get("id");
    if (studentId && teacherId) {
      checkTeacherEvaluation(studentId, teacherId);
    } else {
      alert("Lütfen öğrenci ve öğretmen bilgilerini giriniz.");
    }
  };

  const handleButtonClick = (id) => {
    navigate(`/Grafik/${id}`);
  };

  const department = cookies.get("department");

  // Bileşen yüklendiğinde öğretim görevlilerini getir
  useEffect(() => {
    if (department === "Bilgisayar") {
      fetchTeachers("Bilgisayar");
    } else if (department === "Yazılım") {
      fetchTeachers("Yazılım");
    }
  }, [department]); // 'department' bağımlılığı eklendi

  return (
    <div className="container">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center py-3">
        <h1>MTÜ {department} Mühendisliği Öğretim Görevlileri</h1>
        <div><button className="btn btn-danger" onClick={handleLogout}>
          Çıkış Yap
        </button> </div>
        
      </header>

      {/* Öğretim Görevlileri Kartları */}
      <div className="row mt-4 cards">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="card"
            onClick={() => handleCardClick(teacher.id)}
          >
            <img src={teacher.image} alt={teacher.name} />
            <h2>{teacher.name.trim()}</h2>
            <p>
              <strong>E-posta:</strong> {teacher.email}
            </p>
            <p>
              <strong>Çalışma Alanları:</strong> {teacher.fields}
            </p>
            
            <button
              className="btn btn-primary mt-2"
              onClick={(e) => {
                e.stopPropagation(); // Tıklama olayının yukarıya yayılmasını engelle
                handleButtonClick(teacher.id);
              }}
            >
              Grafiği göster
            </button>
       
          </div>
             
        ))}
      </div>
    </div>
  );
};

export default TeacherCards;

// import React, { useEffect, useState } from "react";
// import Cookies from "universal-cookie";
// import { useNavigate } from "react-router-dom";
// import "../CSS/Hocalar.css";

// const TeacherCards = () => {
//   const [teachers, setTeachers] = useState([]);
//   const cookies = new Cookies();
//   const navigate = useNavigate();

//   const fetchTeachers = async (department) => {
//     const apiUrl = `https://localhost:7230/api/Teacher/all/${department}`;
//     try {
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setTeachers(data);
//       } else {
//         console.error("API'den veri alınamadı.", response.status);
//       }
//     } catch (error) {
//       console.error("API çağrısı sırasında hata:", error);
//     }
//   };

//   const handleLogout = () => {
//     cookies.remove("id", { path: "/" });
//     cookies.remove("teacherId", { path: "/" });
//     cookies.remove("department", { path: "/" });
//     navigate("/");
//   };

//   const checkTeacherEvaluation = async (studentId, teacherId) => {
//     const apiUrl = `https://localhost:7230/api/Evaluation/check/${studentId}/${teacherId}`;
//     try {
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response.ok) {
//         const result = await response.json();
//         if (result === true) {
//           alert("Bu hoca daha önce değerlendirilmiştir.");
//         } else {
//           navigate("/Anket");
//         }
//       } else {
//         console.error("API'den cevap alınamadı.", response.status);
//       }
//     } catch (error) {
//       console.error("API çağrısı sırasında hata:", error);
//     }
//   };

//   const handleCardClick = (teacherId) => {
//     cookies.set("teacherId", teacherId, { path: "/" });
//     const studentId = cookies.get("id");
//     if (studentId && teacherId) {
//       checkTeacherEvaluation(studentId, teacherId);
//     } else {
//       alert("Lütfen öğrenci ve öğretmen bilgilerini giriniz.");
//     }
//   };

//   const handleSurveyClick = (teacherId) => {
//     navigate("/Anket");
//   };

//   const handleButtonClick = (id) => {
//     navigate(`/Grafik/${id}`);
//   };

//   const department = cookies.get("department");

//   useEffect(() => {
//     if (department === "Bilgisayar") {
//       fetchTeachers("Bilgisayar");
//     } else if (department === "Yazılım") {
//       fetchTeachers("Yazılım");
//     }
//   }, [department]);

//   return (
//     <div className="container">
//       <header className="d-flex justify-content-between align-items-center py-4" style={{ height: "80px" }}>
//         <h1>MTÜ {department} Mühendisliği Öğretim Görevlileri</h1>
//         <div>
//           <button className="btn btn-danger" onClick={handleLogout}>
//             Çıkış Yap
//           </button>
//         </div>
//       </header>

//       <div className="row mt-4 cards">
//         {teachers.map((teacher) => (
//           <div key={teacher.id} className="card" onClick={() => handleCardClick(teacher.id)}>
//             <img src={teacher.image} alt={teacher.name} />
//             <h2>{teacher.name.trim()}</h2>
//             <p><strong>E-posta:</strong> {teacher.email}</p>
//             <p><strong>Çalışma Alanları:</strong> {teacher.fields}</p>
//             <div className="d-flex flex-column mt-2">
//               <button className="btn btn-success mb-2" onClick={(e) => { e.stopPropagation(); handleSurveyClick(teacher.id); }}>
//                 Ankete Git
//               </button>
//               <br></br>
//               <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleButtonClick(teacher.id); }}>
//                 Grafiği Göster
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeacherCards;





