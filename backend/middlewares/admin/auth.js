const logIP = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`IP Address: ${ip}`);
    next();
  };