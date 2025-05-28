import "./Welcome.css";

interface WelcomeProps {
  onConnectEmails: () => void;
}

const Welcome = (props: WelcomeProps) => {
  return (
    <div className="welcome-container">
      <h2 className="welcome-title">Welcome to Tapio</h2>
      <p className="welcome-msg bold">To get started</p>
      <p className="welcome-msg">
        Connect your email acccount to start filtering and organising your
        emails related to this project
      </p>
      <button
        className="welcome-connect-emails-btn"
        onClick={props.onConnectEmails}
      >
        Connect Emails
      </button>
    </div>
  );
};
export default Welcome;
