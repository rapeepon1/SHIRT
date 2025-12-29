import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import "../css/login.css";

const Login = () => {
  const { setToken } = useAuth(); // ดึงฟังก์ชันเก็บ Token มาใช้
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token); // เก็บ Token ไว้ใน data
        if (data.role === "admin") {
          navigate("/admin_product/${id}");
        } else {
          navigate("/product");
        }
      } else {
        setError(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อ SERVER");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-title">
          <h1>SHIRT STORE</h1>
          <p>เข้าสู่ระบบ</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            เข้าสู่ระบบ
          </button>

          <p className="login-link">
            ยังไม่มีบัญชี?{" "}
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              สมัครสมาชิก
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
