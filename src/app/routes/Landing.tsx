import Button from "../../components/ui/Button";

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:3000/api/google-login"
};
const handleMicrosoftLogin = () => {
  window.location.href = "http://localhost:3000/api/microsoft-login"
};
const Landing = () => {
  return (
    <>
      <Button buttonText="Login with Google"
        onClick={handleGoogleLogin} />
      <Button buttonText="Login with Microsoft"
        onClick={handleMicrosoftLogin} />
    </>
  )
}
export default Landing;
