const roleAuthorization = (expectedUser) => {
  return (req, res, next) => {
    try {
      const { accountType } = req.user;
      if (!accountType || accountType !== expectedUser) {
        return res.json({ success: false, message: "unauthorized user" });
      }

      next();
    } catch (e) {
      return res.json({
        success: false,
        message: e.message,
      });
    }
  };
};

const isLearner = roleAuthorization("Learner");
const isInstructor = roleAuthorization("Instructor");
const isAdmin = roleAuthorization("Admin");

export { isLearner, isInstructor, isAdmin };
