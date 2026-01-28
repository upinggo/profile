import { useState } from "react";

export default function CommonKnowledge({ 

}: any) {
  const [knowledge, setKnowledge] = useState(false);

  return (
    <div  
      style={{ cursor: 'pointer' }}
    >
        Next.js uses file-system routing, which means the routes in your application are determined by how you structure your files.
    </div>
  );
}