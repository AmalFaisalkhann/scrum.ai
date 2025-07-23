// login.js
import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/firebaseActions";
import "./Style.css";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      alert(`Welcome back, ${user.email}`);
      navigate("/workspace");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Row className="auth-container">
      {/* Left Panel - 60% */}
      <Col span={14} className="left-panel">
        <div className="left-content">
          <div className="brand-logo">
            <div className="logo-circle" />
            <div className="brand-name">scrum.ai</div>
          </div>
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="welcome-subtitle">
            Organize your team's tasks and progress easily with scrum.ai.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Collaborate in real-time</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Track progress effortlessly</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Get productive insights</span>
            </div>
          </div>
        </div>
      </Col>
      {/* Right Panel - 40% */}
      <Col span={10} className="right-panel">
        <div className="auth-form-container">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your scrum.ai account</p>
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            size="large"
            className="auth-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                className="auth-input"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="auth-input"
              />
            </Form.Item>
            <div className="forgot-password">
              <a href="/forgot-password" className="forgot-link">
                Forgot your password?
              </a>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="auth-button"
                block
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
            <div className="auth-footer">
              <p className="signup-text">
                Don’t have an account?{" "}
                <a href="/signup" className="signup-link">
                  Sign up
                </a>
              </p>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};
export default Login;
