import 'dotenv/config';

export default {
  expo: {
    name: "AsthmaApp",
    slug: "asthma-app",
    version: "1.0.0",
    orientation: "portrait",
    // icon: "./assets/icon.png",  // TODO: add real PNG to assets/
    userInterfaceStyle: "light",
    // splash: {
    //   image: "./assets/splash.png",
    //   resizeMode: "contain",
    //   backgroundColor: "#ffffff"
    // },
    extra: {
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
      BACKEND_HOST: process.env.BACKEND_HOST || 'localhost',
      BACKEND_PORT: process.env.BACKEND_PORT || 5000,
    },
  },
};
