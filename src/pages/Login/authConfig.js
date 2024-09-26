export const msalConfig = {
  auth: {
    clientId: "4d99dd21-42b9-4b5c-8ec2-73ee6822ffc6",
    authority:
      "https://login.microsoftonline.com/e8f254ca-58a4-4463-a209-75bd0ddb57b4 ",
    redirectUri: "http://localhost:3000/Home",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

