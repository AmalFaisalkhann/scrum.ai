import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Style.css';  

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Login values:', values);
      setLoading(false);
    }, 1000);
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
          <p className="welcome-subtitle">Organize your team's tasks and progress easily with scrum.ai.</p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Collaborate in real-time</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Track progress effortlessly</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Get productive insights</span>
            </div>
          </div>
        </div>
      </Col>

      {/* Right Panel - 40% */}
      <Col span={10} className="right-panel">
        <div className="auth-form-container">
          <div className="auth-header">
            <p className="auth-title">Welcome back</p>
            <p className="auth-subtitle">Sign in to your scrum.ai account</p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="auth-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
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
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="auth-input"
              />
            </Form.Item>

            <div className="forgot-password">
              <Link to="/forgot-password" className="forgot-link">Forgot your password?</Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="auth-button"
                block
              >
                Sign in
              </Button>
            </Form.Item>

            <div className="auth-footer">
              <p className="signup-text">
                Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
              </p>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
