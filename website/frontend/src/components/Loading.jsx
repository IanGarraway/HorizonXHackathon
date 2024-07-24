import Spinner from "react-bootstrap/Spinner";

function Loading() {
  return (
    <div className="flex">
      <div className="flex mx-auto pt-5">
        <Spinner animation="border" role="status"></Spinner>
        Loading...
      </div>
    </div>
  );
}

export default Loading;
