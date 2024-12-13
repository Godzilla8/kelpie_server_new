export const setCookieOptions = (env) => {
  if (env === "prod") {
    return {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    };
  }

  if (env === "dev") {
    return {
      httpOnly: true,
      maxAge: 3600000,
    };
  }
};
