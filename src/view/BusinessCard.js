import React from 'react';
import './BusinessCard.css'; // Import the CSS file
import walletIcon from "../view/wallet.png";
import weChatIcon from "../view/wechat.png";
import userAddIcon from "../view/user-add.png";


const BusinessCard = () => {
  return (
    <div className="business-card">
      <div className="header">
        <img
          src="https://1857756846.rsc.cdn77.org/static/features/linkedin/01-01%20Dark%20-%20Business%402x.png"
          alt="Profile"
          className="profile-image"
        />
        <h1>Vincent Lam</h1>
        <h3>GROUP CEO</h3>
        <p className="description">
        Founder of the SiiA Group, which consists of SynTech, Innoways, i-RMS and A4apple, all companies which are focused on innovation and technology.
      </p>

      <div className="buttons">
        <button className="icon-button">
          <img src={walletIcon} alt="Wallet" className="button-icon" />
          <span className="button-text">Wallet</span>
        </button>
        <button className="icon-button">
          <img src={ weChatIcon } alt="WeChat" className="button-icon" />
          <span className="button-text">WeChat</span>
        </button>
        <button className="icon-button">
          <img src={ userAddIcon } alt="Phone Book" className="button-icon" />
          <span className="button-text">Phone Book</span>
        </button>
      </div>
      </div>
     
     
      <div className="contact-info">
        <div className="info-item">
          <span role="img" aria-label="phone">📞</span>
          <div className="info-text">
            <p className="info-label">Mobile</p>
            <p className="info-value">+852 9096 8612</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <span role="img" aria-label="email">✉️</span>
          <div className="info-text">
            <p className="info-label">Email</p>
            <p className="info-value">vincent.lam@siia.group</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <span role="img" aria-label="youtube">▶️</span>
          <div className="info-text">
            <p className="info-label">Youtube</p>
            <p className="info-value1">https://www.youtube.com/@InnowaysLtd</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <span role="img" aria-label="linkedin">🔗</span>
          <div className="info-text">
            <p className="info-label">Linkedin</p>
            <p className="info-value1">https://www.linkedin.com/in/vincent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;