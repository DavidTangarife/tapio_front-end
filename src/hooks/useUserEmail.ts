import { useMemo, useState } from "react";

const useUserEmail = () => {
  const [me, setMe] = useState(useMemo(async () => {
    const res = await fetch('http://localhost:3000/api/get-me', {
      credentials: 'include'
    })
    const data = await res.json()
    setMe(data)
  }, []))
  return me
}

export default useUserEmail;
