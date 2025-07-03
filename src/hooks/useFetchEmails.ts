import { useEffect, useState } from "react";

const useFetch = (url: string) => {
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const [activate, setActivate] = useState(false)

  useEffect(() => {
    console.log('In hook')
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error('Unable to fetch data from ' + url)
        }
        const jsonData = await response.json();
        setData(jsonData)
        setActivate(false)
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, [activate])

  return { data, error, setActivate }
}

export default useFetch;
