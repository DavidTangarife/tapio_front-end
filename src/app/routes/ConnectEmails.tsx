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

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response error:", errorText);
        throw new Error(
          `Failed to fetch and save emails: ${res.status} ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Email response:", data);
      console.log("Fetch completed successfully");
    } catch (err) {
      console.error("Error connecting emails:", err);
      // Don't return here - let it continue to finally block
    } finally {
      console.log("Entering finally block...");
      console.log("Navigating to inbox now...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Fixed: resolve instead of res
      console.log("About to navigate...");
      navigate(`/projects/${projectId}/inbox`);
      console.log("Navigate called");
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
