module.exports.ISODateWithoutTime = () => {
  return new Date(ISODateWithoutTimeString());
};

module.exports.ISODateWithoutTimeString = () => {
  return removeTimeFromDate(new Date());
};

module.exports.removeTimeFromDate = (date) => {
  return date.toISOString().split("T")[0];
};
