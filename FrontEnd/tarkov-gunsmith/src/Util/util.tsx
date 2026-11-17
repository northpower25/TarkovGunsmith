
// For a deploy, setup the BE first and then get the API URL

// DEV-Local
//  export const API_URL = "http://localhost:5000"

//! PROD
//export const API_URL = "https://blue.api.tarkovgunsmith.com"

//? DEV-TEST
// export const API_URL = "https://api.dev.tarkovgunsmith.com"

// for (const envVar in process.env) {
//     // console.log(`${envVar}: ${process.env[envVar]}`);
//   }

// // console.log(process.env.REACT_APP_WISHGRANTER_API_URL);

const developmentApiUrl = "http://localhost:5000";

export const API_URL =
    process.env.REACT_APP_WISHGRANTER_API_URL ??
    (process.env.NODE_ENV === "development" ? developmentApiUrl : "");
export const AEC_LS_KEY =
    API_URL === developmentApiUrl ? "TarkovGunsmith_AEC_DEV" : "TarkovGunsmith_AEC";