import React, { useState } from "react";
import "../CSS/Login.css"; // CSS dosyası
import logo from "../images/mtu.png";
import Cookies from "universal-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // Universal Cookie örneği oluştur
  const cookies = new Cookies();


  const handleLogin = async () => {
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    const url = `https://localhost:7230/api/Student/login/${encodeURIComponent(
      email
    )}/${encodeURIComponent(password)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Cookies'e veriyi kaydet
        cookies.set("id", data.id); // 1 saat
        cookies.set("email", data.email );
        cookies.set("department", data.department );

        // Yönlendirme işlemi
        if (data.department !== "") {
          window.location.href = "/Hocalar";
        } else {
          alert("Departman bilgisi hatalı!");
        }
      } else {
        alert("Kullanıcı bulunamadı veya bilgiler hatalı.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="MTÜ" className="login-logo" />
          <h2 className="login-title">Giriş Yapınız</h2>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="sr-only" style={{color:'white'}}>
              Email
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="sr-only" style={{color:'white'}}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="btn btn-primary btn-block"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
