import AuthForm from "../components/AuthForm";

const Auth = ({ setUser }) => {
  return (
    <div>
      <h1 className="text-5xl pb-6 pt-4 text-center">Login</h1>
      <AuthForm setUser={setUser} />
    </div>
  );
};
export default Auth;
