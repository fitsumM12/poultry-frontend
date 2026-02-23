// // import { Card, Grid, useTheme } from "@mui/material";
// // import DoughnutChart from "./Doughnut";
// // import { useEffect } from "react";
// // import { genderCount, getBroilersCount, newandreturning } from "app/apis/broiler_api";
// // import { useState } from "react";

// // export const SupervisorDoughnut = () => {
// //   const [newBroiler, setNewBroiler] = useState(0);
// //   // const [returningBroiler, setReturningBroiler] = useState(0);
// //   const [normalCount, setNormalCount] = useState(0);
// //   const [abnormalCount, setAbnormalCount] = useState(0);

// //   // useEffect(() => {
// //   //   const fetchBroilers = async () => {
// //   //     try {
// //   //       const broilerData = await newandreturning();
// //   //       setNewBroiler(broilerData.new_broilers)
// //   //       setReturningBroiler(broilerData.returning_broilers)
// //   //       // console.log(broilerData)
// //   //     } catch (error) {
// //   //       console.error("Error fetching broilers:", error);
// //   //     }
// //   //   };
// //   //   fetchBroilers()
// //   // }, [])


// //   useEffect(() => {
// //     const fetchCount = async () => {
// //       try {
// //         const response = await getBroilersCount();
// //         setNormalCount(response.normal_broilers_count)
// //         setAbnormalCount(response.abnormal_broilers_count)
// //       }
// //       catch (error) {
// //         // console.log(error)
// //       }
// //     }
// //     fetchCount()
// //   }, []);


// //   const resultDistribution = {
// //     Normal: normalCount,
// //     Abnormal: abnormalCount,
// //   };

// //   // const broilerDistribution = {
// //   //   New: newBroiler,
// //   //   Returning: returningBroiler
// //   // }


// //   return (
// //     // <>
// //     //   <Grid container spacing={2}>
// //     //     <Grid item lg={6} md={6} sm={6} xs={12}>
// //     //       <Card sx={{
// //     //         px: 2, py: 2, mb: 2, textAlign: "center",
// //     //         border: '1px solid rgba(95, 96, 164, 0.5)',
// //     //       }}>
// //     //         <DoughnutChart
// //     //           title="Broilers  Summary"
// //     //           record={broilerDistribution}
// //     //           height="230px"
// //     //           color={[
// //     //             '#fa931d',
// //     //             '#181b62',
// //     //           ]}
// //     //         />
// //     //       </Card>
// //     //     </Grid>

// //     <Grid item lg={6} md={6} sm={6} xs={12}>
// //       <Card sx={{
// //         px: 2, py: 2, mb: 2, textAlign: "center",
// //         border: '1px solid rgba(95, 96, 164, 0.5)',
// //       }}>
// //         <DoughnutChart
// //           title="Result Summary"
// //           record={resultDistribution}
// //           height="230px"
// //           color={[
// //             '#fa931d',
// //             '#181b62',
// //           ]}
// //         />
// //       </Card>
// //     </Grid>
// //   </Grid >

// //   );
// // };
// import React from 'react';
// import Chart from 'react-apexcharts';
// import { Card, Grid, styled, useTheme } from '@mui/material';

// const Title = styled('span')(() => ({
//   fontSize: '1rem',
//   fontWeight: '500',
//   textTransform: 'capitalize',
// }));

// // We use "default" export here to match Fix #1
// const DoughnutSupervisor = () => {
//   const { palette } = useTheme();

//   const options = {
//     labels: ['Normal', 'Abnormal'],
//     colors: [palette.primary.main, palette.secondary.main],
//     legend: { show: true, position: 'bottom' },
//   };

//   const series = [15, 13];

//   return (
//     <Grid container spacing={3}>
//       <Grid item xs={12}>
//         <Card sx={{ px: 3, py: 2, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <Title>Result Summary</Title>
//           <Chart options={options} series={series} type="donut" height={220} />
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default DoughnutSupervisor;

import React, { useEffect, useState } from 'react'; // Added useEffect and useState
import Chart from 'react-apexcharts';
import { Card, Grid, styled, useTheme } from '@mui/material';
import { getBroilersCount } from "app/apis/broiler_api"; // Import your API

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
}));

const DoughnutSupervisor = () => {
  const { palette } = useTheme();

  // 1. Create states to hold the dynamic data
  const [normalCount, setNormalCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);

  // 2. Fetch the actual data when the component loads
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await getBroilersCount();
        setNormalCount(response.normal_broilers_count || 0);
        setAbnormalCount(response.abnormal_broilers_count || 0);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchCount();
  }, []);

  const options = {
    labels: ['Normal', 'Abnormal'],
    colors: [palette.primary.main, palette.secondary.main],
    legend: { show: true, position: 'bottom' },
  };

  // 3. Link the series to your state variables
  const series = [normalCount, abnormalCount];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ px: 3, py: 2, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Title>Result Summary</Title>
          {/* The chart will now update when the data arrives */}
          <Chart options={options} series={series} type="donut" height={220} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default DoughnutSupervisor;