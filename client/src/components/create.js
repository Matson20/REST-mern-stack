import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {

 const [form, setForm] = useState({
   name: "",
   email: "",
   website: "",
   businessID: ""
 });
 const navigate = useNavigate();
 
  // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 const retrieveToken = async () => {
  try {
      const token = await localStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };


  const retrieveRole = async () => {
    try {
      const userData = await localStorage.getItem('user');
      const user = JSON.parse(userData);
      const role = user.role;
      console.log(user);
      console.log(role);
      return role;
    } catch (error) {
      console.error('Error retrieving role:', error);
      return null;
    }
  };

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    console.log("Submit button clicked");
  
    // When a post request is sent to the create URL, we'll add a new record to the database.
    const newPerson = { ...form };
  
    // Retrieve the token and user role
    const token = await retrieveToken();
    const userRole = await retrieveRole();
    
    // Include the user role in the headers
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-User-Role": userRole, // Add this line to include the user's role
    };
  
    await fetch("http://localhost:5000/record/add", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(newPerson),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Handle success, if needed
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error, if needed
      });
  
    setForm({ name: "", email: "", website: "", businessID: "" });
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Record</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="email">Email</label>
         <input
           type="text"
           className="form-control"
           id="position"
           value={form.email}
           onChange={(e) => updateForm({ email: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="website">Website</label>
         <input
           type="text"
           className="form-control"
           id="position"
           value={form.website}
           onChange={(e) => updateForm({ website: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="position">Business ID</label>
         <input
           type="text"
           className="form-control"
           id="position"
           value={form.businessID}
           onChange={(e) => updateForm({ businessID: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Create client"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}