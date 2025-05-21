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

  const onNext = (e: FormEvent) => {
    e.preventDefault();
    if (!isLastStep) return next()
    console.log("Data to submit:", formData)
    //Fetch request to API to store data
    return navigate('/home')
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
