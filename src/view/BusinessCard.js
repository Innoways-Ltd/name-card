import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet"
import './BusinessCard.css'; // Import the CSS file
import walletIcon from "../view/wallet.png";
import WhatsappIcon from "../view/whatsapp.png";
import userAddIcon from "../view/user-add.png";
import avatarIcon from "../view/user.webp";
import { getUserData, getThemeData } from '../apiHandlers/user.apiHandler';

const BusinessCard = () => {
  // Extract username from URL parameters
  const { companycode, username } = useParams();
  const [userData, setUserData] = useState({})
  const [themeData, setThemeData] = useState({})

  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();

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
      // window.location.href = //'intent://add_to_wallet#Intent;scheme=your_android_scheme;package=com.google.android.apps.walletnfcrel;end';

      const pkpassUrl = `${process.env.REACT_APP_GIMA_API_URL}/wallet/getwalletpass?username=${atob(username)}&companycode=${companycode}&environment=${process.env.REACT_APP_ENV}&device=android`;
      const link = document.createElement('a');
      link.href = pkpassUrl;
      link.download = `${atob(username)}.pkpass`;
      link.click();

    } else if (deviceType === 'iOS') {
      // Add to iOS wallet
      const pkpassUrl = `${process.env.REACT_APP_GIMA_API_URL}/wallet/getwalletpass?username=${atob(username)}&companycode=${companycode}&environment=${process.env.REACT_APP_ENV}&device=ios`;
      const link = document.createElement('a');
      link.href = pkpassUrl;
      link.download = `${atob(username)}.pkpass`;
      link.click();
    } else {
      alert('Wallet feature is only available on Android and iOS devices.');
    }
  };

  const handleWhatsAppClick = () => {
    // Replace with the actual phone number
    window.open(`https://wa.me/${userData.mobile?.replace(/\s+/g, '')?.replace("+", "")}`, '_blank');
  };

  const handleAddToPhoneBook = () => {
    const vcard = `BEGIN:VCARD
    VERSION:3.0
    FN:${userData.display_name}
    TITLE:${userData.job}
    TEL;TYPE=CELL:${userData.mobile}
    EMAIL:${userData.email}
    URL;TYPE=YouTube:${userData.youtube}
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
      link.setAttribute('download', `${atob(username)}.vcf`)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Other devices: download vCard file
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${atob(username)}.vcf`)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const getUserDataCall = async () => {
      const res = await getUserData(companycode, username);
      if (res.Code === 0) {
        setUserData(res.Data)
      }
    }
    const themeDataCall = async () => {
      const res = await getThemeData(companycode);
      if (res.Code === 0) {
        setThemeData(res.Data)
      }
    }
    getUserDataCall();
    themeDataCall();
  }, [companycode, username])

  const { smartWidget } = userData

  const showingContent = () => {
    return ["phone", "email", "youtube", "facebook", "instagram"].filter((x) => {
      return smartWidget?.[x] === true
    })
  }

  const renderDynamicContents = (type, i) => {
    switch (type) {
      case "phone":
        return (
          <>
            <div className="info-item">
              <span role="img" aria-label="phone">📞</span>
              <div className="info-text">
                <p className="info-label">Mobile</p>
                <p className="info-value">
                  <a href={`tel:${userData?.tel?.replace(/\s+/g, '')}`}>{userData?.tel}</a>
                </p>
                <p className="info-value">
                  <a href={`tel:${userData?.mobile?.replace(/\s+/g, '')}`}>{userData?.mobile}</a>
                </p>
              </div>
            </div>
            {showingContent().length - 1 > i ? (<div className="divider"></div>) : null}
          </>
        )
      case "email":
        return (
          <>
            <div className="info-item">
              <span role="img" aria-label="email">✉️</span>
              <div className="info-text">
                <p className="info-label">Email</p>
                <p className="info-value">
                  <a
                    href={`mailto:${userData?.email}`}
                    onClick={(e) => {
                      e.preventDefault()
                      window.location.href = `mailto:${userData?.email}`
                    }}
                  >
                    {userData?.email}
                  </a>
                </p>
              </div>
            </div>
            {showingContent().length - 1 > i ? (<div className="divider"></div>) : null}
          </>
        )
      case "youtube":
        return (
          <>
            <div className="info-item">
              <span role="img" aria-label="youtube">▶️</span>
              <div className="info-text">
                <p className="info-label">YouTube</p>
                <p className="info-value1">
                  <a
                    href={userData?.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(userData?.youtube, "_blank")
                    }}
                  >
                    {userData?.youtube}
                  </a>
                </p>
              </div>
            </div>
            {showingContent().length - 1 > i ? (<div className="divider"></div>) : null}
          </>
        )
      case "facebook":
        return (
          <>
            <div className="info-item">
              <span role="img" aria-label="facebook">🔗</span>
              <div className="info-text">
                <p className="info-label">Facebook</p>
                <p className="info-value1">
                  <a
                    href={userData?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(userData?.facebook, "_blank")
                    }}
                  >
                    {userData?.facebook}
                  </a>
                </p>
              </div>
            </div>
            {showingContent().length - 1 > i ? (<div className="divider"></div>) : null}
          </>
        )
      case "instagram":
        return (
          <>
            <div className="info-item">
              <span role="img" aria-label="instagram">📷</span>
              <div className="info-text">
                <p className="info-label">Instagram</p>
                <p className="info-value1">
                  <a
                    href={userData?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(userData?.instagram, "_blank")
                    }}
                  >
                    {userData?.instagram}
                  </a>
                </p>
              </div>
            </div>
            {showingContent().length - 1 > i ? (<div className="divider"></div>) : null}
          </>
        )

      default:
        break
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <link rel="shortcut icon" href={themeData && themeData[0]?.company_icon} />
        <link rel="icon" href={themeData && themeData[0]?.company_icon} />
        <title>{userData?.display_name ? `${userData?.display_name} | Business Card` : "User not found"}</title>
      </Helmet>
      <div className="business-card">
        <div className="header">
          <img
            src={(userData && userData?.profile_picture_thumb && userData?.profile_picture_thumb !== "null" && userData?.profile_picture_thumb) ? userData.profile_picture_thumb : userData?.profile_picture && userData.profile_picture !== "null" ? userData?.profile_picture : avatarIcon}
            alt="Profile"
            className="profile-image"
          />
          <h2>{userData?.display_name || "User not found"}</h2>
          <p>{userData?.job}</p>
          <p className="description">
            {/* Founder of the SiiA Group, which consists of SynTech, Innoways, i-RMS and A4apple, all companies which are focused on innovation and technology. */}
          </p>

          {userData?.smartWidget && (
            <div className="buttons">
              <button className="icon-button" onClick={handleWalletClick}>
                <img src={walletIcon} alt="Wallet" className="button-icon" />
                <span className="button-text">Wallet</span>
              </button>
              {smartWidget?.whatsapp && (
                <button className="icon-button" onClick={handleWhatsAppClick}>
                  <img src={WhatsappIcon} alt="Whatsapp" className="button-icon" />
                  <span className="button-text">Whatsapp</span>
                </button>
              )}
              {smartWidget?.phonebook && (
                <button className="icon-button" onClick={handleAddToPhoneBook}>
                  <img src={userAddIcon} alt="Phone Book" className="button-icon" />
                  <span className="button-text">Phone Book</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="contact-info">
          {showingContent()?.map((x, i) => {
            return renderDynamicContents(x, i)
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default BusinessCard;