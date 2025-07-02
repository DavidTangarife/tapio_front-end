import React, { useEffect, useRef, useState } from 'react';
/*
const Flash = () => {
  const [visibility, setVisibility] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const innerRef = useRef(null);

  useEffect(() => {
    const div = innerRef.current;

    div.on("flash", handleFlash);
    return () => {
      div.off("flash", handleFlash)
    };
  }, []);

  const handleFlash = (e: any) => {
    console.log('Message is ' + e.message)
    console.log('Type is ' + e.type)
    console.log('Duration is ' + e.duration)
  }

  return (
    <div ref={innerRef}>I'm Flashy</div>
  )
}

export default Flash */
