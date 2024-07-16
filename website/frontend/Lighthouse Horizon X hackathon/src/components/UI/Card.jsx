const Card = ({ className, children }) => {
  const classes = `${className} mb-3 bg-white rounded-lg p-3 shadow-md`;

  return <div className={classes}>{children}</div>;
};
export default Card;
