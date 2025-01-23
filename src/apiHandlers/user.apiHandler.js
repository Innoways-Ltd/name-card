import axios from 'axios';

const base_url = process.env.REACT_APP_GIMA_API_URL;
export const getUserData = async (companycode = '', username = '') => {
  const response = await fetch(`${base_url}/api/v3/staff/bussinesscard/${atob(username)}?companycode=${companycode}`);
  const data = await response.json();
  return data;
}

export const getThemeData = async (companycode = '') => {
  const response = await fetch(`${base_url}/theme/getlist?companycode=${companycode}`);
  const data = await response.json();
  return data;
}

export const getSystemSettings = async (companycode) => {
  const url = `${base_url}/setting/GetBaseSettings/${companycode}`
  return axios.get(url)
    .then((res) => {
      if (res.data.MsgCode === 200) {
        if (Array.isArray(res.data.Data) && res.data.Data.length) {
          return res.data.Data
        }
      }
      return [];
    }).catch((error) => {
      return [];
    });
}