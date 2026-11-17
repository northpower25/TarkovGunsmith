const api = process.env.REACT_APP_WISHGRANTER_API_URL || "http://localhost:5000";

export const API_URL = api;
export const AEC_LS_KEY =
    api === "http://localhost:5000" ? "TarkovGunsmith_AEC_DEV" : "TarkovGunsmith_AEC";
