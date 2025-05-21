import type { ReactElement } from 'react';
import { useState } from 'react';

export function useSetupForm(steps: ReactElement[]) {
  const [currentStep, setCurrentStep] = useState(0)

  function next() {
    setCurrentStep(prevStep => {
      if (prevStep >= steps.length - 1) return prevStep
      return prevStep + 1
    })
  }

  function back() {
    setCurrentStep(prevStep => {
      if (prevStep <= 0) return prevStep
      return prevStep - 1
    })
  }
  
  return {
    currentStep,
    step: steps[currentStep],
    steps,
    isFirstStep: currentStep === 0,
    next,
    back,
    isLastStep: currentStep === steps.length - 1, 
  }
}

