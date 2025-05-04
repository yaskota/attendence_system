import { check, validationResult } from "express-validator";

export const validateLogin = [
  check("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }
    next();
  },
];

export const validateSignup = [
  check("rollNo")
    .isLength({ min: 10, max: 10 })
    .withMessage("rollno is exact 10 characters"),
  check("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  check("phno")
    .isLength({ min: 10, max: 10 })
    .withMessage("phno is exact 10 characters")
    .isNumeric()
    .withMessage("all are numeric characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }
    next();
  },
];

export const validateregister = [
  check("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  check("phno")
    .isLength({ min: 10, max: 10 })
    .withMessage("phno is exact 10 characters")
    .isNumeric()
    .withMessage("all are numeric characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }
    next();
  },
];