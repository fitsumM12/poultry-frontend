import { Card, Grid, useTheme } from "@mui/material";
import DoughnutChart from "./Doughnut";
import { useEffect } from "react";
import { genderCount, getBroilersCount, newandreturning } from "app/apis/broiler_api";
import { useState } from "react";

export const SupervisorDoughnut = () => {
  const [newBroiler, setNewBroiler] = useState(0);
  const [returningBroiler, setReturningBroiler] = useState(0);
  const [normalCount, setNormalCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);

  useEffect(() => {
    const fetchBroilers = async () => {
      try {
        const broilerData = await newandreturning();
        setNewBroiler(broilerData.new_broilers)
        setReturningBroiler(broilerData.returning_broilers)
        // console.log(broilerData)
      } catch (error) {
        console.error("Error fetching broilers:", error);
      }
    };
    fetchBroilers()
  }, [])


  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await getBroilersCount();
        setNormalCount(response.normal_broilers_count)
        setAbnormalCount(response.abnormal_broilers_count)
      }
      catch (error) {
        // console.log(error)
      }
    }
    fetchCount()
  }, []);


  const resultDistribution = {
    Normal: normalCount,
    Abnormal: abnormalCount,
  };

  const broilerDistribution = {
    New: newBroiler,
    Returning: returningBroiler
  }


  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Card sx={{
            px: 2, py: 2, mb: 2, textAlign: "center",
            border: '1px solid rgba(95, 96, 164, 0.5)',
          }}>
            <DoughnutChart
              title="Broilers  Summary"
              record={broilerDistribution}
              height="230px"
              color={[
                '#fa931d',
                '#181b62',
              ]}
            />
          </Card>
        </Grid>

        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Card sx={{
            px: 2, py: 2, mb: 2, textAlign: "center",
            border: '1px solid rgba(95, 96, 164, 0.5)',
          }}>
            <DoughnutChart
              title="Result Summary"
              record={resultDistribution}
              height="230px"
              color={[
                '#fa931d',
                '#181b62',
              ]}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
