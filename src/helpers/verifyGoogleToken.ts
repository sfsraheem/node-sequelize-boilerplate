import { OAuth2Client } from "google-auth-library";
import { config } from "../configs";

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const email = payload.email;
  const firstName = payload.given_name;
  const lastName = payload.family_name ? payload.family_name : null;
  const password = payload.sub;

  return {
    email,
    firstName,
    lastName,
    password,
  };
};

export default verifyGoogleToken