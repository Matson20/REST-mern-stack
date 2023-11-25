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
  // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
   console.log("Submit button clicked");
    // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
    await fetch("http://localhost:5000/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     console.log("This is an error section");
     return;
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