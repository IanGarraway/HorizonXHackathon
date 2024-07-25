const Matrix = () => {
  return (
    <div className="px-5">
      <iframe
        title="Modello-Pharus Matrix"
        src={`./modello_pharus_matrix.html`}
        width="100%"
        height="600px"
        frameBorder="0"
      ></iframe>
      <div className="text-center mx-auto w-3/5 pt-5">
        <h1 className="font-poppins text-2xl pb-3">LightHouse's Rationale</h1>
        <p className="text-left pb-5">
          The scoring methodology for LLMs evaluates their credibility, safety,
          accuracy, and benchmark performance to determine business readiness,
          and assesses their capabilities, success stories, and popularity to
          gauge perceived business value. By averaging these criteria, we
          provide a balanced and comprehensive understanding of each model's
          strengths and potential for real-world applications.
        </p>
      </div>
    </div>
  );
};
export default Matrix;
