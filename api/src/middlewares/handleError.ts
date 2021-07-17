import { ValidationError } from "../exceptions/ValidationError.js";
import { AuthenticationError } from "../exceptions/AuthenticationError.js";
import { ResourceNotFoundError } from "../exceptions/ResourceNotFoundError.js";
import express from "express";

export async function handleError(error : express.ErrorRequestHandler, 
                                  req : express.Request, 
                                  res : express.Response, 
                                  next : express.NextFunction) : Promise<void> {
  console.log({
    req: {
      url: req.originalUrl,
      parameters: req.params,
      query: req.query,
      body: req.body,
      ip: req.ip
    },
    error
  });

  if(error instanceof ValidationError) {
    res.status(422).send({ error });
  }
  else if(error instanceof AuthenticationError) {
    res.status(401).send({ error });
  }
  else if(error instanceof ResourceNotFoundError) {
    res.status(404).send({ error });
  }
  else {
    res.status(500).send({ error });
  }
}