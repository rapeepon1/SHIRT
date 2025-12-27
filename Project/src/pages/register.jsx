import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { first_name, last_name, email, password } = formData;

    if (!first_name || !last_name || !email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      setError("");
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        navigate("/");
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (err) {
      console.error("Server error:", err);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card login-form">
        <h1>SHIRT STORE</h1>
        <h2>สมัครสมาชิก</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid-row">
            <input
              name="first_name"
              type="text"
              placeholder="ชื่อ"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              name="last_name"
              type="text"
              placeholder="นามสกุล"
              value={formData.last_name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="อีเมล"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="รหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-primary">
              ลงทะเบียน
            </button>
          </div>
        </form>

        <p className="register-link">
          มีบัญชีอยู่แล้ว?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
