import axios from "axios";

// This runs before all axios requests
axios.interceptors.request.use((config) => {
  const isMobile = window.innerWidth < 768; // optional, or use User-Agent
  const isLocalhost = config.url?.includes("localhost");

  if (isLocalhost && isMobile) {
    config.url = config.url.replace("localhost", "192.168.1.13"); // your local IP here
  }

  return config;
});
