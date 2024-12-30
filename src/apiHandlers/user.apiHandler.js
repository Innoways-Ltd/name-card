const base_url = 'http://localhost:8001';
export const getUserData = async (companycode = '', username = '') => {
  const response = await fetch(`${base_url}/api/v3/staff/bussinesscard/${username}?companycode=${companycode}`);
  const data = await response.json();
  return data;
}

export const getThemeData = async (companycode = '') => {
  const response = await fetch(`${base_url}/theme/getlist?companycode=${companycode}`);
  const data = await response.json();
  return data;
}