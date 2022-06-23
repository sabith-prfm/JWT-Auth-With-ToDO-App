const express = require("express");
const router = express.Router();
const AuthService = require("../contoller/auth");
const TaskService = require("../contoller/task");
const Validations = require("../middleware/requestValidation");
const TokenService = require("../middleware/tokenServices");

let routes = (app) => {
  router.post(
    "/publicApi/auth/login",
    Validations.validate("userLogin"),
    Validations.isParametersValid,
    AuthService.login
  );

  router.post(
    "/secureApi/create-task",
    TokenService.verifyToken,            //middleware for verifyToken
    Validations.validate("createTask"), //middleware for validation Schema for JSON request Params
    Validations.isParametersValid,      //validation middleware for requestParams
    TaskService.createTask              //controller for the API
  );

  // router.post(
  //   "/secureApi/delete-multiple-task",
  //   TokenService.verifyToken,
  //   Validations.validate("deleteMultipleTask"),
  //   Validations.isParametersValid,
  //   TaskService.deleteMultipleTask
  // );

  router.post(
    "/secureApi/delete-task",
    TokenService.verifyToken,
    Validations.validate("deleteTask"),
    Validations.isParametersValid,
    TaskService.deleteTask
  );

  app.use(router);
};

module.exports = routes;
