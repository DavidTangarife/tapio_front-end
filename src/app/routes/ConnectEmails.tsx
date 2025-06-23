import { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import Welcome from "../../components/ui/Welcome";
import "./ConnectEmails.css";
import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../../assets/Spinner.svg?react";
import Inbox from "./Inbox";


const ConnectEmails = () => {
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const initialData = useLoaderData()
  const [data, setData] = useState(initialData);

  // If user not validated or other error, Redirect to login
  useEffect(() => {
    if (data) {
      if (data['error'] == "Unauthorized access: Please login") {
        navigate('/')
      } else if (data['error'] == "No Project Found") {
        navigate('/setup')
      }
    }
    console.log(data)
    console.log('DATA IS HERE ')
    if (data.emails) {
      if (data.emails.length !== 0) {
        setShowEmailSection(true)
      }
    }
  }, [data, loading, navigate])


  const handleConnectEmails = async () => {
    setShowEmailSection(true);
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3000/api/direct-emails", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const resData = await res.json()
      console.log(resData)
      setData(resData)
      if (!res.ok) throw new Error("Failed to fetch and save emails");
    } catch (err) {
      console.log("Error Connecting email ", err);
    }
    setLoading(false)
  };

  return (
    <main>
      <>
        <Header />
        {!showEmailSection ? (
          <Welcome onConnectEmails={handleConnectEmails} />
        ) : (
          <>
            {loading ? (
              <>
                <h2 className="loader-title">Loading emails</h2>
                <Loader className="spin-loader" />
              </>
            ) : (
              <Inbox emails={data.emails} />
            )}
          </>
        )}
      </>
    </main>
  );
};
export default ConnectEmails;
