import { useState } from "react";
import Header from "../../components/ui/Header";
import Welcome from "../../components/ui/Welcome";
// import EmailSection from "../../components/ui/EmailSection";
import "./ConnectEmails.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../../assets/Spinner.svg?react";
const ConnectEmails = () => {
  const [showEmailSection, setShowEmailSection] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleConnectEmails = async () => {
    console.log("Starting handleConnectEmails function");
    setShowEmailSection(true);

    if (!projectId) {
      console.error("No projectId found");
      return;
    }

    try {
      console.log("Making fetch request...");
      const res = await fetch("http://localhost:3000/api/google-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) throw new Error("Failed to fetch and save emails");
    } catch (err) {
      console.log("Error Connecting email ", err);
    } finally {
      navigate(`/projects/${projectId}/inbox`);
    }
  };

  return (
    <main>
      <Header />
      {!showEmailSection ? (
        <Welcome onConnectEmails={handleConnectEmails} />
      ) : (
        <>
          <h2 className="loader-title">Loading emails</h2>
          <Loader className="spin-loader" />
        </>
      )}
    </main>
  );
};
export default ConnectEmails;
