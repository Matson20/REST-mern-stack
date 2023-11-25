import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import { CardContent, CardHeader, Typography, Grid, Box, Paper } from "@mui/material";

const Record = (props) => (
 <tr>
   <td>{props.record.name}</td>
   <td>{props.record.email}</td>
   <td>{props.record.website}</td>
   <td>{props.record.businessID}</td>
   <td>{props.record.clientAddress}</td>
   <td>
     <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteRecord(props.record._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
);

export default function RecordList() {
 const [records, setRecords] = useState([]);

 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/record/`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const records = await response.json();
     setRecords(records);
   }

   getRecords();

   return;
 }, [records.length]);

 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`http://localhost:5000/record/${id}`, {
     method: "DELETE"
   });

   const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }

 // This method will map out the records on the table
 function recordList() {
   return records.map((record) => {
     return (
       <Record
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record._id}
       />
     );
   });
 }

 // This following section will display the table with the records of individuals.
 return (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <Paper>
      <Grid container spacing={3} justifyContent="center">
        {records.map((record) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={record._id} sx={{ margin: '10px' }}>
            <Card
              sx={{
                width: '40vh',
                height: 'auto',
                backgroundColor: '#f8f7ff',
              }}
            >
              <CardHeader title={record.name} />
              <CardContent>
                <Typography>{record.email}</Typography>
                <Typography>{record.website}</Typography>
                <Typography>{record.businessID}</Typography>
                <Typography>{record.clientAddress}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Box>
);
}

/*
    <Card>
      <CardContent>
        <Typography variant="h4">
          Client List
        </Typography>
        <Typography>
        <table className="table table-striped" style={{ marginTop: 20 }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Business ID</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{recordList()}</tbody>
    </table>
        </Typography>
      </CardContent>  
    </Card>
*/