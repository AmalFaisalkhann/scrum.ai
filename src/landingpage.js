import React from 'react';
import { useNavigate } from 'react-router-dom';

import './landingpage.css';
import {
  ChevronRight, Users, Target, BarChart3, Clock,
  Zap, Shield, GitBranch, Calendar
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="landing-container">

      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <h1 className="logo">Scrum.AI</h1>
          <nav className="nav-links">
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
          <div className="auth-buttons">
            <button className="link-button">Profile</button>
            <button className="link-button">Log in</button>
            <button className="primary-button">Start Free Trial</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="container text-center">
          <div className="ai-badge">
            Now with AI-powered insights <ChevronRight className="icon" />
          </div>
          <h1 className="hero-title">Scrum.AI</h1>
          <h2 className="hero-subtitle">Project Management</h2>
          <p className="hero-description">
            Transform your team's productivity with AI-powered Scrum methodology. Streamline sprints,
            automate reporting, and make data-driven decisions that accelerate your project delivery.
          </p>
          <div className="hero-buttons">
            <button className="gradient-button" onClick={() => navigate('src\Dashboard\Workspace.js')}>
              Create New Workspace <ChevronRight className="icon" />
            </button>
            <button className="secondary-button" onClick={() => navigate('src\Dashboard\EnterWorkspace.js')}>Enter Workspace</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container grid features-grid">
          {[
            {
              icon: <BarChart3 className="feature-icon blue" />,
              title: 'AI-Powered Insights',
              desc: 'Get intelligent recommendations for sprint planning and task prioritization',
            },
            {
              icon: <Users className="feature-icon purple" />,
              title: 'Team Collaboration',
              desc: 'Seamless communication and real-time updates across your entire team',
            },
            {
              icon: <Target className="feature-icon green" />,
              title: 'Goal Tracking',
              desc: 'Monitor progress and achieve your project milestones with precision',
            },
            {
              icon: <Clock className="feature-icon green" />,
              title: 'Time Tracking',
              desc: 'Automatic time logging with smart categorization and detailed reporting',
            },
            {
              icon: <Zap className="feature-icon yellow" />,
              title: 'Workflow Automation',
              desc: 'Automate repetitive tasks and reports to focus on what matters most',
            },
            {
              icon: <Shield className="feature-icon red" />,
              title: 'Enterprise Security',
              desc: 'Bank-level security with SSO, audit logs, and compliance-ready infrastructure',
            },
            {
              icon: <GitBranch className="feature-icon cyan" />,
              title: 'Integration Hub',
              desc: 'Connect with GitHub, Jira, Slack, and 50+ tools your team already uses',
            },
            {
              icon: <Calendar className="feature-icon orange" />,
              title: 'Release Planning',
              desc: 'AI-assisted roadmap planning with dependency tracking and risk assessment',
            },
          ].map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon-container">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container text-center">
          <h2 className="section-title">Trusted by teams worldwide</h2>
          <p className="section-description">
            See what project managers and development teams are saying about Scrum.AI
          </p>
          <div className="testimonials-grid">
            {[
              {
                name: 'Sarah Chen',
                role: 'Engineering Manager at TechCorp',
                text: 'Scrum.AI transformed how our team works. The AI insights helped us improve our sprint planning by 40% and reduce planning meetings by half.',
                initial: 'S',
                color: 'bg-blue-500'
              },
              {
                name: 'Marcus Rodriguez',
                role: 'Product Owner at StartupXYZ',
                text: 'The predictive analytics are game-changing. We can now forecast project completion dates with incredible accuracy.',
                initial: 'M',
                color: 'bg-green-500'
              },
              {
                name: 'Emily Johnson',
                role: 'Scrum Master at InnovateLabs',
                text: 'Best project management tool we\'ve ever used. The automation features save us hours every week, and the team loves the intuitive interface.',
                initial: 'E',
                color: 'bg-purple-500'
              }
            ].map((testimonial, i) => (
              <div className="testimonial-card" key={i}>
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-footer">
                  <div className={`testimonial-avatar ${testimonial.color}`}>{testimonial.initial}</div>
                  <div>
                    <p className="testimonial-name">{testimonial.name}</p>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 className="cta-title">Ready to transform your project management?</h2>
          <p className="cta-description">
            Join thousands of teams accelerating their delivery with Scrum.AI. Start your free trial today.
          </p>
          <div className="cta-buttons">
            <button className="white-button">Start Free Trial <ChevronRight className="icon" /></button>
            <button className="outline-button">Schedule Demo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <h3 className="footer-logo">Scrum.AI</h3>
          <p className="footer-description">
            Transforming project management with AI-powered insights and intelligent automation.
          </p>
          <p className="footer-note">© 2024 Scrum.AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
