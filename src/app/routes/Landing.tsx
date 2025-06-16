import Button from "../../components/ui/Button"; 
import "./Landing.css"
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react"

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:3000/api/google-login"
};
const handleMicrosoftLogin = () => {
  window.location.href = "http://localhost:3000/api/microsoft-login"
}
const Landing = () => {
    return (
      <>
      <section className="landing-page">
        <div className="login-wrapper">
          <TapioLogoDesktop className="logo-landing" />
          <h1 className="sign-up-title">Sign up or
           <br />
            Login to your account</h1>
          <Button 
            buttonText="Login with Google"
            onClick={handleGoogleLogin}
            className="login-btn google" />
            <Button 
            buttonText="Login with Microsoft"
            onClick={handleMicrosoftLogin}
            className="login-btn microsoft" />
        </div>
 
      </section>
        
      </>
    )
}
export default Landing;