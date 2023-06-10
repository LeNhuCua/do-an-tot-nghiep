import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Configure the proxy server
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v',
    changeOrigin: true,
  })
);

// Run the proxy server on port 3000
app.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
});
