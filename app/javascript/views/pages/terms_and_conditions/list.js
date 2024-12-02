import React, { useEffect, useState } from 'react';

const TermsAndCondition = () => {
  const [termsAndConditions, setTermsAndConditions] = useState([]);

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const response = await fetch('/api/v1/terms_and_conditions');
        const data = await response.json();
        console.log("Fetched data:", data);
        setTermsAndConditions(data.items || []); // Ensure 'items' property exists and set the default to an empty array
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
      }
    };

    fetchTermsAndConditions();
  }, []);

  return (
    <div>
      <h1>Terms and Conditions</h1>
      {termsAndConditions.map((item) => (
        <p key={item.id}>{item.content}</p>
      ))}
    </div>
  );
};

export default TermsAndCondition;