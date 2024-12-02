import React, { useEffect, useState } from 'react';


const PrivacyPolicy = () => {
  const [privacyPolicies, setPrivacyPolicies] = useState([]);

  useEffect(() => {
    const fetchPrivacyPolicies = async () => {
      try {
        const response = await fetch('/api/v1/privacy_policies');
        const data = await response.json();
        console.log("Fetched data:", data);
        setPrivacyPolicies(data.items || []);
      } catch (error) {
        console.error('Error fetching privacy_policies:', error);
      }
    };

    fetchPrivacyPolicies();
  }, []);

  return (
    <div>
      <h1>Privacy Policies</h1>
      {privacyPolicies.map((item) => (
        <p key={item.id}>{item.content}</p>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
 