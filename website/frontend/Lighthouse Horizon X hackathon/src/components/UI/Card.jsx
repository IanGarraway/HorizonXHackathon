const Card = ({ className, children }) => {
  const classes = `${className} mb-3 bg-white rounded-3xl p-3 shadow-lg`;

  return <div className={classes}>{children}</div>;
};
export default Card;