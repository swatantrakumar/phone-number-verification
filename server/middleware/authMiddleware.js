module.exports = function(req, res, next) {
    if (req.is('text/*')) {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => {
        req.body = data
        next();
      });
    } else {
      next();
    }
};