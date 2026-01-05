import api from "../services/api";

export const wakeUpBackend = async () => {
  try {
    const now = new Date().toLocaleTimeString();

    const res = await api.get('/');
    console.log(`[${now}] Backend is awake`, res);
  } catch (error) {
    const now = new Date().toLocaleTimeString();
    console.error(`[${now}] Failed to wake up backend:`, error instanceof Error ? error.message : String(error));
  }
};
