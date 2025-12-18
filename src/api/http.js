import axios from 'axios';

const http = axios.create({
  baseURL: 'https://port-0-sportly-mfesk0ff6a0c1a3c.sel3.cloudtype.app',
  headers: { 'Content-Type': 'application/json' },
});

export default http;