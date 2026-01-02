// export { PredictionResult, AbnormalityDetection };
import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card, CardContent, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';

// const values = {
//     0: 'Newcastle',
//     1: 'Normal',
//     2: 'Other abnormal'
// };

// // PredictionResult
// const PredictionResult = ({ data }) => {
//     // const maxIndex = data.indexOf(Math.max(...data));
//     const probs = Array.isArray(data[0]) ? data[0] : data; // unwrap [[...]]
//     const maxIndex = probs.indexOf(Math.max(...probs));
//     const result = values[maxIndex];

//     const isNormal = result === 'Normal';

//     return (
//         <Card variant="outlined" sx={{ margin: 2 }}>
//             <CardContent>
//                 <Typography variant="h6">Severity Level</Typography>

//                 <Typography
//                     variant="body1"
//                     sx={{ display: 'flex', alignItems: 'center', color: isNormal ? 'green' : 'red' }}
//                 >
//                     <ArrowForwardIosIcon sx={{ marginRight: 1 }} />
//                     {result}
//                 </Typography>
//             </CardContent>
//         </Card>
//     );
// };

// // AbnormalityDetection
// const AbnormalityDetection = ({ data = [0] }) => {
//     if (!Array.isArray(data)) {
//         console.error("AbnormalityDetection: 'data' prop should be an array.");
//         return null;
//     }

//     // const maxIndex = data.indexOf(Math.max(...data));
//     const probs = Array.isArray(data[0]) ? data[0] : data; // unwrap [[...]]
//     const maxIndex = probs.indexOf(Math.max(...probs));
//     const result = values[maxIndex];

//     const abnormal = result !== 'Normal';

//     return (
//         <Card variant="outlined" sx={{ margin: 2 }}>
//             <CardContent>
//                 <Typography variant="h6">Abnormality Detection</Typography>

//                 {abnormal ? (
//                     <Typography sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
//                         <ReportIcon sx={{ marginRight: 1 }} />
//                         Abnormality has been detected.
//                     </Typography>
//                 ) : (
//                     <Typography sx={{ color: 'green', display: 'flex', alignItems: 'center' }}>
//                         <ReportIcon sx={{ marginRight: 1 }} />
//                         No abnormality detected.
//                     </Typography>
//                 )}
//             </CardContent>
//         </Card>
//     );
// };

// export { PredictionResult, AbnormalityDetection };
const values = {
    0: 'Newcastle',
    1: 'Normal',
    2: 'Other abnormal'
};

const getResult = (data) => {
    const probs = Array.isArray(data[0]) ? data[0] : data; // unwrap [[...]]
    const maxIndex = probs.reduce(
        (best, v, i) => (v > probs[best] ? i : best),
        0
    );
    return values[maxIndex];
};

// PredictionResult
const PredictionResult = ({ data }) => {
    const result = getResult(data);
    const isNormal = result === 'Normal';

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6">Severity Level</Typography>

                <Typography
                    variant="body1"
                    sx={{ display: 'flex', alignItems: 'center', color: isNormal ? 'green' : 'red' }}
                >
                    <ArrowForwardIosIcon sx={{ marginRight: 1 }} />
                    {result}
                </Typography>
            </CardContent>
        </Card>
    );
};

// AbnormalityDetection
const AbnormalityDetection = ({ data = [0] }) => {
    if (!Array.isArray(data)) {
        console.error("AbnormalityDetection: 'data' prop should be an array.");
        return null;
    }

    const result = getResult(data);
    const abnormal = result !== 'Normal';

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6">Abnormality Detection</Typography>

                {abnormal ? (
                    <Typography sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                        <ReportIcon sx={{ marginRight: 1 }} />
                        Abnormality has been detected.
                    </Typography>
                ) : (
                    <Typography sx={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                        <ReportIcon sx={{ marginRight: 1 }} />
                        No abnormality detected.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export { PredictionResult, AbnormalityDetection };

