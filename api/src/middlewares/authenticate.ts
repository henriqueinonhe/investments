import jwt from "express-jwt";
import jwks from "jwks-rsa";

export const authenticate = jwt(({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-8z6e9jdt.us.auth0.com/.well-known/jwks.json"
  }),
  audience: "Investments API",
  issuer: "https://dev-8z6e9jdt.us.auth0.com/",
  algorithms: ["RS256"]
}));