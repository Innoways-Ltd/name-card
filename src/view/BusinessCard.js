import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet"
import './BusinessCard.css'; // Import the CSS file
import walletIcon from "../images/wallet.png";
import WhatsappIcon from "../images/whatsapp.png";
import userAddIcon from "../images/user-add.png";
import avatarIcon from "../images/user.webp";
import mobileIcon from "../images/Mobile-icon.png";
import emailIcon from "../images/email-icon02.png"
import facebookIcon from "../images/facebook.png"
import instagramIcon from "../images/instagram.png"
import youtubeIcon from "../images/youtube.png"
import { getUserData, getThemeData, getSystemSettings } from "../apiHandlers/user.apiHandler";
import defaultGimaIcon from '../images/gimalogo-removebg-preview.png'

const BusinessCard = () => {
  // Extract username from URL parameters
  const { companycode, username } = useParams();
  const [userData, setUserData] = useState({})
  const [themeData, setThemeData] = useState({})

  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    // Android detection
    if (/android/i.test(userAgent)) {
      return 'Android';
    }
    // iOS detection
    if (/ipad|iphone|ipod|safari/.test(userAgent)) {
      return 'iOS';
    }
    return 'unknown';
  };

  const handleWalletClick = () => {
    const deviceType = detectDevice();
    if (deviceType === 'Android') {
      // Add to Android wallet
      window.location.href = `${process.env.REACT_APP_GIMA_API_URL}/wallet/getwalletpass?username=${atob(username)}&companycode=${companycode}&environment=${process.env.REACT_APP_ENV}&device=android`;
    } else if (deviceType === 'iOS') {
      // Add to iOS wallet
      window.location.href = `${process.env.REACT_APP_GIMA_API_URL}/wallet/getwalletpass?username=${atob(username)}&companycode=${companycode}&environment=${process.env.REACT_APP_ENV}&device=ios&downloadable=no`;
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
URL:${userData.youtube}
END:VCARD`;
    // download vCard file
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${atob(username)}.vcf`)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    const getSystemSettingsCall = async () => {
      const res = await getSystemSettings(companycode);
      // if gima card is enabled then fetch user data
      if (res.length && res.find((x) => x.sys_key === "gima_card_fg" && x.sys_value === "1")) {
        getUserDataCall()
      }
    }
    // 1. fetch system settings
    // 2. if gima card is enabled then fetch user data
    // 3. fetch theme data
    getSystemSettingsCall();
    themeDataCall();
  }, [companycode, username])

  const { smartWidget, facebook, instagram, youtube } = userData

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
              <span role="img" aria-label="phone">
                <img
                  src={mobileIcon} alt="mobile"
                  height={"33px"}
                  width={"20px"}
                />
              </span>
              <div className="info-text">
                <p className="info-label">Mobile</p>
                <p className="info-value">
                  <a href={`tel:${userData?.home_tel?.replace(/\s+/g, '')}`}>{userData?.home_tel}</a>
                </p>
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
              <span role="img" aria-label="email">
                <img
                  src={emailIcon} alt="email"
                  height={"22px"}
                  width={"27px"}
                />
              </span>
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
        return (youtube ?
          <>
            <div className="info-item">
              <span role="img" aria-label="youtube">
                <img
                  src={youtubeIcon}
                  alt="youtube"
                  height={"30px"}
                  width={"32px"}
                />
              </span>
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
          : <></>)
      case "facebook":
        return (facebook ?
          <>
            <div className="info-item">
              <span role="img" aria-label="facebook">
                <img
                  src={facebookIcon}
                  alt="facebook"
                  height={"32px"}
                  width={"30px"}
                />
              </span>
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
          : <></>)
      case "instagram":
        return (instagram ?
          <>
            <div className="info-item">
              <span role="img" aria-label="instagram">
                <img
                  src={instagramIcon}
                  alt="instagram"
                  height={"32px"}
                  width={"32px"}
                />
              </span>
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
          : <></>)

      default:
        break
    }
  }
  function getName(userData) {
    if (userData) {
      const lengthOfItem = userData['display_name']?.split(" ")
      if (lengthOfItem?.length > 1) {
        return `${lengthOfItem[0]?.charAt(0)}${lengthOfItem[1]?.charAt(0)}`.toUpperCase()
      } else {
        return userData['display_name']?.charAt(0)
      }
    }
    return 'John Doe'
  }
  const renderProfileImage = () => {
    if (userData && userData?.profile_picture_thumb && userData?.profile_picture_thumb !== "null" && userData?.profile_picture_thumb) {
      return <img
        src={userData?.profile_picture_thumb}
        alt="Profile"
        className="profile-image"
      />
    } else if (userData?.profile_picture && userData.profile_picture !== "null") {
      return <img
        src={userData?.profile_picture}
        alt="Profile"
        className="profile-image"
      />
    } else if (userData?.display_name) {
      return <div className="profile_placeholder"><span className="make-it-dark">{getName(userData)}</span></div>
    }
    return <img
      src={avatarIcon}
      alt="Profile"
      className="profile-image"
    />
  }

  return (
    <React.Fragment>
      <Helmet>
        <link
          rel="shortcut icon"
          href={
            themeData?.[0]?.company_icon
            || themeData?.[0]?.company_logo
            || defaultGimaIcon
          }
        />
        <link
          rel="icon"
          href={
            themeData?.[0]?.company_icon
            || themeData?.[0]?.company_logo
            || defaultGimaIcon
          }
        />
        <title>{userData?.display_name ? `${userData?.display_name} | Business Card` : "User not found"}</title>
      </Helmet>
      <div className="business-card">
        <div className="header">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {renderProfileImage()}
          </div>
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