import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Style.css';  

const { Title, Text } = Typography;


const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Reset password for:', values.email);
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <Row className="auth-container">
      {/* Left Panel */}
      <Col xs={24} md={14} className="left-panel">
        <div className="left-content">
          <div className="brand-logo">
            <div className="logo-circle" />
            <div className="brand-name">scrum.ai</div>
          </div>
          <h1 className="welcome-title">Forgot Your Password?</h1>
          <p className="welcome-subtitle">
            Don't worry, we'll send you instructions to reset it. Stay productive!
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <span>Secure password reset</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📨</span>
              <span>Email-based verification</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <span>Quick recovery process</span>
            </div>
          </div>
        </div>
      </Col>

      {/* Right Panel */}
      <Col xs={24} md={10} className="right-panel">
        <div className="auth-form-container">
          <div className="auth-header">
            <p className="auth-title">Reset Password</p>
            <p className="auth-subtitle">Enter your email to receive reset instructions</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <Text type="success">Password reset instructions have been sent to your email.</Text>
            </div>
          ) : (
            <Form
              form={form}
              name="forgotPassword"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="auth-form"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email address!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="auth-button"
                  block
                >
                  Send Reset Link
                </Button>
              </Form.Item>

              <div className="auth-footer">
                <p className="signup-text">
                  Remember your password? <Link to="/login" className="signup-link">Sign in</Link>
                </p>
              </div>
            </Form>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
