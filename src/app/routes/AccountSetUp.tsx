import { FormInput } from "../../components/ui/SetupForm";
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react";
import { useSetupForm } from "../../hooks/useSetupForm";
import { useFormData } from "../../hooks/useFormData";
import "./AccountSetUp.css";
import { useLocation, useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";

const SetupForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateProject = location.state?.mode === "createProject";
  const { formData, updateFormData } = useFormData();
  const [animateClass, setAnimateClass] = useState("");

  const steps = isCreateProject
    ? [
      <FormInput
        label="Enter a Project Name"
        type="text"
        name="projectName"
        value={formData.projectName}
        onChange={updateFormData}
        placeholder="E.g. My Job Hunt"
      />,
      <FormInput
        label="When did you start your search?"
        type="date"
        name="searchDate"
        value={formData.searchDate}
        onChange={updateFormData}
      />,
    ]
    : [
      <FormInput
        label="What's your full name?"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={updateFormData}
      />,

      <FormInput
        label="Enter a Project Name"
        type="text"
        name="projectName"
        value={formData.projectName}
        onChange={updateFormData}
        placeholder="E.g. My Job Hunt"
      />,
      <FormInput
        label="When did you start your search?"
        type="date"
        name="searchDate"
        value={formData.searchDate}
        onChange={updateFormData}
      />,
    ];

  const {
    steps: formSteps,
    currentStep,
    isFirstStep,
    back,
    next,
    step,
    isLastStep,
  } = useSetupForm(steps);

  const handleSubmit = async () => {
    try {
      // send project name and start date to create a new project for the user
      console.log("Sending data...");
      const time =
        new Date(formData.searchDate).getTime() +
        new Date().getTimezoneOffset() * 60 * 1000;
      const payload1 = {
        name: formData.projectName,
        startDate: new Date(time).toISOString(), //"2025-10-05T14:48:00.000Z"
      };

      const res1 = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload1),
      });
      if (!res1.ok) {
        throw new Error("Failed to submit project data");
      }

      // send user fullName and userId to update user's name in database
      if (!isCreateProject) {
        const payload2 = {
          fullName: formData.fullName,
        };
        const res2 = await fetch("http://localhost:3000/api/update-name", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload2),
        });

        if (!res2.ok) {
          throw new Error("Failed to submit user data");
        }
      }
      navigate("/home");
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  const onNext = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      next();
      setAnimateClass("animate");
      // remove class after animation complete
      setTimeout(() => {
        setAnimateClass("");
      }, 200);
    } else {
      console.log("submmitting final form");
      handleSubmit();
    }
  };

  const onBack = () => {
    back();
    setAnimateClass("animate-back");
    // remove class after animation complete
    setTimeout(() => {
      setAnimateClass("");
    }, 200);
  };

  return (
    <>
      <section className="form-container">
        <TapioLogoDesktop className="logo-setup" />
        <form className={`setup-form ${animateClass}`} onSubmit={onNext}>
          <p className="setup-step-count">
            {currentStep + 1} / {formSteps.length}
          </p>
          {step}
          <div className="setup-btn-container">
            {!isFirstStep && (
              <button className="setup-btn" type="button" onClick={onBack}>
                Back
              </button>
            )}
            <button
              type="submit"
              className={isLastStep ? "setup-btn setup-btn-final" : "setup-btn"}
            >
              {isLastStep ? "Let's go" : "Next"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default SetupForm;
