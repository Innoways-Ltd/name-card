import React from 'react';
import './BusinessCard.css'; // Import the CSS file
import walletIcon from "../view/wallet.png";
import WhatsappIcon from "../view/whatsapp.png";
import userAddIcon from "../view/user-add.png";
import avatarIcon from "../view/avatar.png";


const BusinessCard = () => {
  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase() ;
    
console.log(userAgent)

    // iOS detection
    if (/ipad|iphone|ipod|safari/.test(userAgent)) {
      return 'iOS';
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
      return 'Android';
    }
    
    return 'unknown';
  };

  const handleWalletClick = () => {
    const deviceType = detectDevice();

    if (deviceType === 'Android') {
      // Add to Android wallet
      window.location.href = 'intent://add_to_wallet#Intent;scheme=your_android_scheme;package=com.google.android.apps.walletnfcrel;end';
    } else if (deviceType === 'iOS') {
      // Add to iOS wallet
        const pkpassUrl = 'https://dms-api-dev.a4apple.cn:51127/files/DownloadPublicLinkFile?P=iGCGWUHKNuX0uB57hX6YtQlUkZJFXJIKQsh2OLPb%2BtjE1HEbI4/Y4ffsUT1%2BLCE%2B';
        const link = document.createElement('a');
        link.href = pkpassUrl;
        link.download = 'vincent_ios.pkpass';
        link.click();
    } else {
      alert('Wallet feature is only available on Android and iOS devices.');
    }
  };

  const handleWhatsAppClick = () => {
    // Replace with the actual phone number
    const phoneNumber = '85290968612';
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleAddToPhoneBook = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Vincent Lam
TITLE:GROUP CEO
TEL;TYPE=CELL:+85290968612
EMAIL:vincent.lam@siia.group
URL;TYPE=YouTube:https://www.youtube.com/vincent
URL;TYPE=LinkedIn:https://www.linkedin.com/in/vincent
END:VCARD`;

    const deviceType = detectDevice();

    if (deviceType === 'Android') {
      // Android device: use intent to open contacts app
      const encodedVCard = encodeURIComponent(vcard);
      window.location.href = `intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;S.vcard=${encodedVCard};end`;
    } else if (deviceType === 'iOS') {
      // iOS device: create and download vCard file
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vincent_lam.vcf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Other devices: download vCard file
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vincent_lam.vcf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="business-card">
      <div className="header">
        <img
          src={ avatarIcon }
          alt="Profile"
          className="profile-image"
        />
        <h2>Vincent Lam</h2>
        <p>GROUP CEO</p>
        <p className="description">
        {/* Founder of the SiiA Group, which consists of SynTech, Innoways, i-RMS and A4apple, all companies which are focused on innovation and technology. */}
      </p>

      <div className="buttons">
        <button className="icon-button" onClick={handleWalletClick}>
          <img src={walletIcon} alt="Wallet" className="button-icon" />
          <span className="button-text">Wallet</span>
        </button>
        <button className="icon-button" onClick={handleWhatsAppClick}>
          <img src={WhatsappIcon} alt="Whatsapp" className="button-icon" />
          <span className="button-text">Whatsapp</span>
        </button>
        <button className="icon-button" onClick={handleAddToPhoneBook}>
          <img src={userAddIcon} alt="Phone Book" className="button-icon" />
          <span className="button-text">Phone Book</span>
        </button>
      </div>
      </div>
     
     
      <div className="contact-info">
        <div className="info-item">
          <span role="img" aria-label="phone">📞</span>
          <div className="info-text">
            <p className="info-label">Mobile</p>
            <p className="info-value">
              <a href="tel:+85290968612">+852 9096 8612</a>
            </p>
            <p className="info-value">
              <a href="tel:+61421303106">+61 421 303 106</a>
            </p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <span role="img" aria-label="email">✉️</span>
          <div className="info-text">
            <p className="info-label">Email</p>
            <p className="info-value">
              <a
                href="mailto:vincent.lam@siia.group"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "mailto:vincent.lam@siia.group";
                }}
              >
                vincent.lam@siia.group
              </a>
            </p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <span role="img" aria-label="youtube">▶️</span>
          <div className="info-text">
            <p className="info-label">YouTube</p>
            <p className="info-value1">
              <a
                href="https://youtube.com/@i-rmsonline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open("https://youtube.com/@i-rmsonline", "_blank");
                }}
              >
                https://youtube.com/@i-rmsonline
              </a>
            </p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <span role="img" aria-label="linkedin">🔗</span>
          <div className="info-text">
            <p className="info-label">Linkedin</p>
            <p className="info-value1">
              <a
                href="https://hk.linkedin.com/in/vincent-lam-92935719"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open("https://hk.linkedin.com/in/vincent-lam-92935719", "_blank");
                }}
              >
                https://hk.linkedin.com/in/vincent-lam-92935719
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;