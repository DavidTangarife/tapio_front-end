import { FormInput } from "../../components/ui/SetupForm";
import { useSetupForm } from "../../hooks/useSetupForm";
import { useFormData } from "../../hooks/useFormData"

import { useNavigate } from "react-router-dom"
import type { FormEvent } from "react"


const SetupForm = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormData();

  const { steps, currentStep, isFirstStep, back, next, step, isLastStep } = useSetupForm([
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
    />
  ])

  const handleSubmit = async () => {
    try {
      // send project name and start date to create a new project for the user 
      const payload1 = {
        name: formData.projectName,
        startDate: new Date(formData.searchDate).toISOString(),
        userId: '682fb45267b8dbc61daf3ff5',
      };
      const res1 = await fetch ("http://localhost:3000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload1),
    });
    if (!res1.ok) {
      throw new Error("Failed to submit project data");
    }
    // send user fullName and userId to update user's name in database
    const payload2 = {
      userId: '682fb45267b8dbc61daf3ff5',
      fullName: formData.fullName
    };
    const res2 = await fetch("http://localhost:3000/api/update-name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload2),
    });

    if (!res2.ok) {
      throw new Error("Failed to submit user data");
    }
    console.log("Data successfully submitted");
    navigate("/home");
  } catch (err) {
    console.error("Error submitting data:", err);
  }

  }
  const onNext = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      next();
    } else {
      handleSubmit();
    }
  }

  return (
    <>
      <form onSubmit={ onNext }>
        <p>{ currentStep + 1} / { steps.length }</p>
        { step }
        { !isFirstStep && <button type="button" onClick={ back }>Back</button> }
        <button type="submit">{ isLastStep ? "Let's go" : "Next"}</button>
      </form>
    </>
  )
  }

export default SetupForm;
