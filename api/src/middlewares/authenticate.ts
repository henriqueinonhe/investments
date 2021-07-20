import jwt from "express-jwt";
import jwks from "jwks-rsa";
import { env } from "../env";
import { Request, Response, NextFunction } from "express";

const auth0AuthenticationMiddleware = jwt(({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: env.AUTH0_JWKS_URI
  }),
  audience: env.AUTH0_AUDIENCE,
  issuer: env.AUTH0_ISSUER,
  algorithms: ["RS256"]
}));

export const authenticate = env.MOCKED_USER ? (req : Request, res : Response, next : NextFunction) : void => {
  req.user = {
    sub: env.MOCKED_USER
  };

  next();
} : auth0AuthenticationMiddleware;
