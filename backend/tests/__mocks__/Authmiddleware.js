export default (req, res, next) => {
    req.user = {
      id: "mock-user-id",
      googleId: "mock-google-id",
      email: "mock@example.com",
      name: "Mock User",
    };
    next();
  };
  