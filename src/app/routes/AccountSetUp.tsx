import { FormInput } from "../../components/ui/SetupForm";
import { useSetupForm } from "../../hooks/useSetupForm";
import { useFormData } from "../../hooks/useFormData";
import "./AccountSetUp.css";
import { useLocation, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";

const SetupForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateProject = location.state?.mode === "createProject";
  const { formData, updateFormData } = useFormData();

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
      const payload1 = {
        name: formData.projectName,
        startDate: new Date(formData.searchDate).toISOString(),
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
      const data = await res1.json();
      const projectId = data._id;
      console.log("Data successfully submitted");
      navigate(`/projects/${projectId}/connect`);
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  const onNext = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      next();
    } else {
      console.log("submmitting final form");
      handleSubmit();
    }
  };

  return (
    <>
      <section className="form-container">
        <h1 className="logo">Tapio</h1>
        <form className="setup-form " onSubmit={onNext}>
          <p className="setup-step-count">
            {currentStep + 1} / {formSteps.length}
          </p>
          {step}

          <div className="setup-btn-container">
            {!isFirstStep && (
              <button className="setup-btn" type="button" onClick={back}>
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
