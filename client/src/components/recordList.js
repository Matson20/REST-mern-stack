import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import { CardContent, CardHeader, Typography, Grid, Box, Paper, Button } from "@mui/material";


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

 // This following section will display the table with the records of individuals.
 return (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <Paper>
      <Grid container spacing={3} justifyContent="center">
        {records.map((record) => (
          <Grid item xs={12} sm={12} md={12} lg={12} key={record._id} sx={{ margin: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card
              sx={{
                width: '40vh',
                height: 'auto',
                backgroundColor: '#f8f7ff',
              }}
            >
              <CardHeader title={record.name} />
              <Button 
                class="btn btn-link"
                variant='contained'
                size="small"
                onClick={()=>deleteRecord(record._id)}>
                Delete
              </Button> |
              <Link className="btn btn-link" to={`/edit/${record._id}`}>Edit</Link> 
              <CardContent>
                <Typography><u>Email:</u><br/> {record.email}</Typography>
                <Typography><u>Website:</u><br/>  {record.website}</Typography>
                <Typography><u>Business ID:</u><br/>  {record.businessID}</Typography>
                <Typography><u>Address:</u><br/>  {record.clientAddress}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Box>
);
}
