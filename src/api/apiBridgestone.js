import axios from "axios";

const bridgestone = axios.create({
  baseURL: "/api",
});

export const authentication = (data) => {
  return bridgestone.post(
    `/auth/realms/webfleet/protocol/openid-connect/token`,
    {
      params: {
        grant_type: "password",
        client_id: "tire-service-app",
        username: "Peach_Test1@peachsdev31testacc5002",
        password: "Peach@12",
      },
    }
  );
};
