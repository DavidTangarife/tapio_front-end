import Button from "../../components/ui/Button"; 

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:3000/api/google-login"
};
const Landing = () => {
    return (
        <Button buttonText="Login with Google"
                onClick={handleGoogleLogin} />
    )
}
export default Landing;