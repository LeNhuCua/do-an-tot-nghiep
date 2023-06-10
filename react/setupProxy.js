import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = app => {
    app.use (
        createProxyMiddleware('/endpoint', 
            {
                target : "http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v",
                changeOrigin:true
            }
        )
    )
}