const { body, validationResult } = require("express-validator");

//request JSON Params validation schema
exports.validate = (method) => {
  switch (method) {
    case "userLogin": {
      return [
        body("userName", "UserName Required").exists(),
        body("password", "Password Required").exists(),
      ];
    }

    case "createTask": {
      return [
        body("taskName", "taskName Required").exists(),
        body("taskStatus", "taskStatus Required")
          .exists()
          .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"]),
        body("completionDate").optional(),
      ];
    }

    case "deleteMultipleTask": {
      return [body("taskIds", "taskIds Required").exists()];
    }

    case "deleteTask": {
      return [body("taskIds", "taskIds Required as Array").exists().isArray()];
    }
  }
};

//request JSON validation middleware
exports.isParametersValid = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
