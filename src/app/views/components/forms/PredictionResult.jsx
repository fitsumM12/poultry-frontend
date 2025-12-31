import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card, CardContent, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
// PredictionResult Component
const PredictionResult = ({ data }) => {
    const values = {
        0: 'Newcastle',
        1: 'Normal',
        2: 'Other abnormal'
    };
    const maxIndex = data.indexOf(Math.max(...data));
    const result = values[maxIndex];

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Severity Level
                </Typography>{
                    result == 'Normal' ? (

                        <Typography variant="h7" color="green" sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowForwardIosIcon sx={{ color: 'green', marginRight: 1, height: '20px' }} /> {result}
                        </Typography>
                    ) : (
                        <Typography variant="h7" color="red" sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowForwardIosIcon sx={{ color: 'red', marginRight: 1, height: '20px' }} /> {result}
                        </Typography>)
                }
            </CardContent>
        </Card>
    );
};

// AbnormalityDetection Component
const AbnormalityDetection = ({ data = [0] }) => {
    // console.log("Here", data)
    if (!Array.isArray(data)) {
        console.error("AbnormalityDetection: 'data' prop should be an array.");
        return null;
    }

    const maxIndex = data.indexOf(Math.max(...data));
    const abnormal = maxIndex < 2;

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Abnormality Detection
                </Typography>
                <Typography variant="body1">
                    {abnormal ? (
                        <div style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                            <ReportIcon sx={{ color: 'red', marginRight: 1 }} />
                            Abnormality has been detected.
                        </div>
                    ) : (
                        <div style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                            <ReportIcon sx={{ color: 'green', marginRight: 1 }} />
                            No abnormality detected.
                        </div>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};



export { PredictionResult, AbnormalityDetection };
