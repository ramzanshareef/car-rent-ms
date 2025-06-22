import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export const validateUser = (req: Request) => {
  const errors: string[] = [];
  const { firstName, lastName, email, password } = req.body;

  if (!firstName?.trim()) errors.push("First name is required");
  if (!lastName?.trim()) errors.push("Last name is required");
  if (!email?.trim()) errors.push("Email is required");
  if (!password?.trim()) errors.push("Password is required");

  if (firstName && /\s/.test(firstName)) {
    errors.push("Blank spaces are not allowed in first name");
  }

  if (lastName && /\s/.test(lastName)) {
    errors.push("Blank spaces are not allowed in last name");
  }

  if (firstName && !/^[A-Za-z]+$/.test(firstName.trim())) {
    errors.push("Only Latin letters allowed for first name");
  }

  if (lastName && !/^[A-Za-z]+$/.test(lastName.trim())) {
    errors.push("Only Latin letters allowed for last name");
  }

  if (email && /\s/.test(email)) {
    errors.push("Blank spaces are not allowed in email");
  }

  if (email && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$%^*-_])[A-Za-z\d$%^*-_]{8,}$/.test(password)) {
    errors.push("Password must include letters, numbers, special characters, and be at least 8 characters");
  }

  return errors;
};