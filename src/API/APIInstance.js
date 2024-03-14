import axios from 'axios';

const BASE_URL = 'https://rolling-api.vercel.app';
const BASE_TEAM_ID = '4-11';
const IMGGUT_URL = 'https://api.imgur.com/3/image';
const CLIENT_ID = '4c8db1c88e920c2';

const rollingBaseAxiosAPI = () => {
  const instance = axios.create({ baseURL: BASE_URL });
  return instance;
};

const rollingTeamBaseAxiosAPI = (options) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}/${BASE_TEAM_ID}`,
    ...options,
  });
  return instance;
};

const imgurAPI = (options) => {
  const instance = axios.create({
    baseURL: IMGGUT_URL,
    headers: { Authorization: `Client-ID ${CLIENT_ID}` },
    ...options,
  });
  return instance;
};

export const rollingTeamInstance = rollingTeamBaseAxiosAPI();

export const rollingInstance = rollingBaseAxiosAPI();

export const imgurInstance = imgurAPI();
