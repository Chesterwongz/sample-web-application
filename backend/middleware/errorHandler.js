export const errorHandler = (err, req, res, next) => {
  res.json({ msg: err });
};
