import React from "react";

export default function Modal({ closeModal }) {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <span onClick={() => closeModal(false)} className="close">
          &times;
        </span>
      </div>
      <div className="modal-body">
        <p className="modal-text">Enter your email. </p>
        <div className="input-field modal-input">
          <i className="fas fa-at"></i>
          <input placeholder="Email" />
        </div>
        <button className="btn-modal">Submit</button>
      </div>
    </div>
  );
}
