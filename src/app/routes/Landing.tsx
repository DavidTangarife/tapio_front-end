import { useLoaderData, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useEffect } from "react";

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:3000/api/google-login"
};
const handleMicrosoftLogin = () => {
  window.location.href = "http://localhost:3000/api/microsoft-login"
};
const Landing = () => {
  const data = useLoaderData()
  const navigate = useNavigate()
  useEffect(() => {
    if (data.user === true) {
      navigate('/home')
    }
  }, [data, navigate])
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
