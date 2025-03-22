const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8090, 
    proxy: {
      // Proxy API requests from '/api' to a backend server
      '/api': {
        target: 'http://localhost:8080', // Replace with your backend server address
        changeOrigin: true,
      
      }// CHANGE YOUR PORT HERE!
  },
  }
})
