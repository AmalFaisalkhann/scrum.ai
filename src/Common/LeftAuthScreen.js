import React from 'react'

const LeftAuthScreen = () => {
  return (
    <div
        style={{
          flex: 1,
          background:
            "linear-gradient(-45deg, #8B5CF6, #3B82F6, #06B6D4, #8B5CF6)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            right: "15%",
            width: "60px",
            height: "60px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "20%",
            width: "80px",
            height: "80px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            animation: "float 7s ease-in-out infinite",
          }}
        />

        <div
          style={{
            maxWidth: "400px",
            textAlign: "left",
            color: "white",
            zIndex: 10,
          }}
        >
          <div style={{ marginBottom: "3rem" }}>
            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: "800",
                marginBottom: "1rem",
                background: "linear-gradient(135deg, #ffffff, #e0e7ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              scrum.ai
            </h1>
            <div
              style={{
                width: "60px",
                height: "4px",
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "2px",
                marginBottom: "2rem",
              }}
            />
          </div>

          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              lineHeight: "1.2",
              color: "rgba(255, 255, 255, 0.95)",
            }}
          >
            AI-Powered Scrum Management
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255, 255, 255, 0.85)",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            Transform your agile workflow with intelligent sprint planning,
            automated retrospectives, and data-driven insights.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {[
              "Smart sprint recommendations",
              "Automated standup summaries",
              "Predictive velocity tracking",
              "Real-time collaboration",
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "white",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "0.95rem",
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default LeftAuthScreen
