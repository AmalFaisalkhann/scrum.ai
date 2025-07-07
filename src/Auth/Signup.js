import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Style.css';  // ✅ Adjust path if needed


const { Title, Text } = Typography;

const Signup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Signup values:', values);
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
          <h1 className="welcome-title">Join Us Today</h1>
          <p className="welcome-subtitle">Create your free scrum.ai account and boost your team's productivity.</p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Collaborate in real-time</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Track tasks effortlessly</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Boost team efficiency</span>
            </div>
          </div>
        </div>
      </Col>

      {/* Right Panel */}
      <Col xs={24} md={10} className="right-panel">
        <div className="auth-form-container">
          <div className="auth-header">
            <p className="auth-title">Create an account</p>
            <p className="auth-subtitle">Sign up for a new scrum.ai account</p>
          </div>

          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="auth-form"
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please enter your full name!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                className="auth-input"
              />
            </Form.Item>

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

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
                Sign up
              </Button>
            </Form.Item>

            <div className="auth-footer">
              <p className="signup-text">
                Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
              </p>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Signup;
