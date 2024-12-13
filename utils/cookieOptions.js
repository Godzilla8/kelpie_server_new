export const setCookieOptions = (env) => {
  if (env === "prod") {
    return {
      httpOnly: true,
      secure: true,
      maxAge: 14400000,
    };
  }

  if (env === "dev") {
    return {
      httpOnly: true,
      maxAge: 14400000,
    };
  }
};
