import React, { useState } from "react";
import { resetPassword } from "../services/firebaseActions";
import { Row, Col, Form, Input, Button, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Style.css"; // Reuse same styling
const { Title, Text } = Typography;
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleReset = async () => {
    setLoading(true);
    try {
      await resetPassword(email);
      alert("Password reset link sent to your email!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Row className="auth-container">
      {/* Left Panel */}
      <Col span={14} className="left-panel">
        <div className="left-content">
          <div className="brand-logo">
            <div className="logo-circle" />
            <div className="brand-name">scrum.ai</div>
          </div>
          <h1 className="welcome-title">Forgot your password?</h1>
          <p className="welcome-subtitle">
            Don’t worry! We'll send a reset link to your email.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Quick password recovery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Secure and reliable</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Fast email delivery</span>
            </div>
          </div>
        </div>
      </Col>
      {/* Right Panel */}
      <Col span={10} className="right-panel">
        <div className="form-wrapper">
          <Title level={2} className="auth-title">Forgot Password</Title>
          <Text className="auth-subtitle">Enter your email to receive reset instructions</Text>
          <Form layout="vertical" onFinish={handleReset} className="auth-form">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                prefix={<MailOutlined />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="auth-button"
                loading={loading}
                block
              >
                Reset Password
              </Button>
            </Form.Item>
            <Text className="signup-text">
              Remember your password?{" "}
              <Link to="/login" className="signup-link">
                Sign In
              </Link>
            </Text>
          </Form>
        </div>
      </Col>
    </Row>
  );
};
export default ForgotPassword;