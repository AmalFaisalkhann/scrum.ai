import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/firebaseActions";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Select,
  Spin,
} from "antd";
import "./Style.css";
const { Title, Text } = Typography;
const { Option } = Select;
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password, name, role } = values;
      await registerUser(email, password, name, role);
      alert("Signup successful!");
      navigate("/login");
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
          <h1 className="welcome-title">Join the Team!</h1>
          <p className="welcome-subtitle">
            Create your account and start managing your team efficiently.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Manage sprints easily</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Track progress in real-time</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <span>Summarize standups with AI</span>
            </div>
          </div>
        </div>
      </Col>
      {/* Right Panel - Signup Form */}
      <Col span={10} className="auth-form-container">
        <Title level={2} className="auth-title">Create an Account</Title>
        <Text className="auth-subtitle">Sign up for scrum.ai</Text>
        <Form layout="vertical" onFinish={onFinish} className="auth-form">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item label="Role" name="role" initialValue="Developer">
            <Select>
              <Option value="PM">Project Manager</Option>
              <Option value="Developer">Developer</Option>
              <Option value="ProductOwner">Product Owner</Option> {/* ✅ Added */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="auth-button" block disabled={loading}>
              {loading ? <Spin size="small" /> : "Sign Up"}
            </Button>
          </Form.Item>
          <Text className="signup-text">
            Already have an account?{" "}
            <a href="/login" className="signup-link">
              Sign in
            </a>
          </Text>
        </Form>
      </Col>
    </Row>
  );
};
export default Signup;