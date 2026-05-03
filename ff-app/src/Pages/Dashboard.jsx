import Sidebar from '../Components/Sidebar';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export function Dashboard() {
  const [ShowPopUp, setShowPopUp] = useState(false);

  return (
    <Container>
      <Row>

        <Col style={{marginLeft: "240px"}}>
              <h1 className="heading" style={{ fontSize: 46, fontWeight: 900 }}>
                <span style={{ color: "#fff" }}>DASHBOARD</span>
              </h1>
        </Col>
        <Col>
          <button
            style={{
              display: "grid",
              color: "#DFFF00",
              background: "black",
              justifySelf: "end"
            }}
            onClick={() => setShowPopUp(true)}
          >
            + Add Goal
          </button>
          
          {ShowPopUp && <AddGoalPopup onClose={() => setShowPopUp(false)} />}
            </Col>
      </Row>
    </Container>
  );
}

function AddGoalPopup({ onClose }) {
  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2>Popup Content</h2>
        <p>This is a simple popup.</p>

        <button
          style={{ color: "#ADAAAA", background: "#1A1A1A" }}
          onClick={onClose}
        >
          Discard
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // FIXED
  display: "grid",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const popupStyle = {
  backgroundColor: "#20201F",
  color: "#DFFF00",
  fontFamily: "'lexend', sans-serif",
  padding: "20px",
  borderRadius: "5px",
  minWidth: "500px",
  minHeight: "300px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)"
};

export default Dashboard;
