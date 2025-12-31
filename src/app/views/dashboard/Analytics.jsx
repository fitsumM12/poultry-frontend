import { Fragment } from "react";
import { Grid, styled } from "@mui/material";
import StatCards from "./shared/StatCards";
import { SupervisorDoughnut } from "./shared/DoughnutSupervisor";
import MonthlyTrend from "./shared/MonthlyTrend";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));



export default function Analytics() {

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <MonthlyTrend />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <StatCards />
            <SupervisorDoughnut />
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
