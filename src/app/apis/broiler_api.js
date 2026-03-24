// import api from "./axios";
// // Base URL for your API
// const API_BROILER_URL = `${process.env.REACT_APP_SERVER_IP_ADDRESS}/api/broilers/`;
// const token = localStorage.getItem('token');



// // MAKE THE PREDICTION API
// export const predictImage = async (image,broiler_id) => {
//   const formData = new FormData();
//   formData.append('image', image); 
//   formData.append('broiler_id', broiler_id);
//   try {
//     const response = await api.post(`${API_BROILER_URL}predict_image/`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     return response.data; 
//   } catch (error) {
//     console.error('Error predicting image:', error.response ? error.response.data : error.message);
//     throw error; 
//   }
// };

// // TO ADD THE DATAFORM PLUGIN
// export const submitFormData = async (formData) => {
//   try {
//     const response = await api.post(`${API_BROILER_URL}add/`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error submitting form data:', error);
//     throw error;
//   }
// };



// // ADDING AN IMAGE AND PREDICTIONS
// // export const submitImageAndPrediction = async (formData) => {
// //   try {
// //     const response = await api.post(`${API_BROILER_URL}add_image_predictions/`, formData, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error adding predictions:', error);
// //     throw error;
// //   }
// // };
// export const submitImageAndPrediction = async ({ broiler_id, image, image_prediction }) => {
//   const formData = new FormData();
//   formData.append('broiler_id', broiler_id);

//   if (image) {
//     // ensure it’s a File object
//     if (!(image instanceof File)) {
//       image = new File([image], "image.jpg", { type: "image/jpeg" });
//     }
//     formData.append('image', image);
//   }

//   if (image_prediction) {
//     formData.append('image_prediction', image_prediction);
//   }

//   try {
//     const response = await api.post(`${API_BROILER_URL}add_image_predictions/`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error adding predictions:', error.response?.data || error.message);
//     throw error;
//   }
// };

// export const submitPhysicianDecision = async (formData) => {
//   try {
//     const response = await api.post(`${API_BROILER_URL}addphysiciandecision/`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error adding predictions:', error);
//     throw error;
//   }
// };

// export const fetchBroilerForSupervisor = async (in_id) => {
//   try {
//     const response = await api.get(`${API_BROILER_URL}?farm/${in_id}/`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching broilers for supervisor:', error);
//     throw error;
//   }
// };



// // FETCH INDIVIDUAL BROILER API
// export const fetchBroiler = async (b_id) => {
//   try {
//     const response = await api.get(`${API_BROILER_URL}${b_id}/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching broiler:', error);
//     throw error;
//   }
// };


// // UPDATE BROILER FUNCTION IN API CALLS
// export const updateBroilerInAPI = async (id, formData) => {
//   try {
//     const response = await api.put(`${API_BROILER_URL}update/${id}/`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating breed:', error);
//     throw error;
//   }
// };
// export const fetchBroilerById = async (id) => {
//   // Ensure this points exactly to your Django server
//   const BASE_URL = process.env.REACT_APP_SERVER_IP_ADDRESS || 'http://localhost:8000';
//   const token = localStorage.getItem('token'); 

//   try {
//     // We use the full URL to prevent the 'Broiler-app' prefix error
//     const response = await api.get(`${BASE_URL}/api/getprediction/${id}/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Error:", error.response ? error.response.data : error.message);
//     throw error;
//   }
// };
// export const getBroilersCount = async () => {
//   try {
//     const response = await api.get(`${API_BROILER_URL}count_broilers_json/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching broiler by ID:', error);
//     throw error;
//   }
// };

// export const breedCount = async () => {
//   try {
//     const response = await api.get(`${API_BROILER_URL}breed_count/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching broiler by ID:', error);
//     throw error;
//   }
// };

// export const newandreturning = async () => {
//   try {
//     const response = await api.get(`${API_BROILER_URL}new_vs_returning_broilers/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching new and returning broilers:', error);
//     throw error;
//   }
// }


// export const monthlyBroilerCount = async (year) => {
//   try {
//     const response = await api.get(`${API_BROILER_URL}monthly_broiler_count/${year}/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching monthly broiler trend', error);
//     throw error;
//   }
// };

// export const monthlyPredictionCount = async (year) => {
//   try {
//     const response = await api.get(`${API_BROILER_URL}predictions_by_month/${year}/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching monthly broiler trend', error);
//     throw error;
//   }
// };
import api from "./axios";

// Base URL for your API
const API_BROILER_URL = `${process.env.REACT_APP_SERVER_IP_ADDRESS}/api/broilers/`;

// Always read the latest token at request time
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// MAKE THE PREDICTION API
export const predictImage = async (image, broiler_id) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("broiler_id", broiler_id);

  try {
    const response = await api.post(`${API_BROILER_URL}predict_image/`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error predicting image:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// TO ADD THE DATAFORM PLUGIN
export const submitFormData = async (formData) => {
  try {
    const response = await api.post(`${API_BROILER_URL}add/`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting form data:", error);
    throw error;
  }
};

// ADDING AN IMAGE AND PREDICTIONS
export const submitImageAndPrediction = async ({ broiler_id, image, image_prediction }) => {
  const formData = new FormData();
  formData.append("broiler_id", broiler_id);

  if (image) {
    if (!(image instanceof File)) {
      image = new File([image], "image.jpg", { type: "image/jpeg" });
    }
    formData.append("image", image);
  }

  if (image_prediction) {
    formData.append("image_prediction", image_prediction);
  }

  try {
    const response = await api.post(`${API_BROILER_URL}add_image_predictions/`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding predictions:", error.response?.data || error.message);
    throw error;
  }
};

export const submitPhysicianDecision = async (formData) => {
  try {
    const response = await api.post(`${API_BROILER_URL}addphysiciandecision/`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding predictions:", error);
    throw error;
  }
};

export const fetchBroilerForSupervisor = async (in_id) => {
  try {
    const response = await api.get(`${API_BROILER_URL}farm/${in_id}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching broilers for supervisor:", error);
    throw error;
  }
};

// FETCH INDIVIDUAL BROILER API
export const fetchBroiler = async (b_id) => {
  try {
    const response = await api.get(`${API_BROILER_URL}${b_id}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching broiler:", error);
    throw error;
  }
};

// UPDATE BROILER FUNCTION IN API CALLS
export const updateBroilerInAPI = async (id, formData) => {
  try {
    const response = await api.put(`${API_BROILER_URL}update/${id}/`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating breed:", error);
    throw error;
  }
};

export const fetchBroilerById = async (id) => {
  const BASE_URL = process.env.REACT_APP_SERVER_IP_ADDRESS || "http://localhost:8000";

  try {
    const response = await api.get(`${BASE_URL}/api/getprediction/${id}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getBroilersCount = async () => {
  try {
    const response = await api.get(`${API_BROILER_URL}count_broilers_json/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching broiler count:", error);
    throw error;
  }
};

export const breedCount = async () => {
  try {
    const response = await api.get(`${API_BROILER_URL}breed_count/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching breed count:", error);
    throw error;
  }
};

export const newandreturning = async () => {
  try {
    const response = await api.get(`${API_BROILER_URL}new_vs_returning_broilers/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching new and returning broilers:", error);
    throw error;
  }
};

export const monthlyBroilerCount = async (year) => {
  try {
    const response = await api.get(`${API_BROILER_URL}monthly_broiler_count/${year}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly broiler trend", error);
    throw error;
  }
};

export const monthlyPredictionCount = async (year) => {
  try {
    const response = await api.get(`${API_BROILER_URL}predictions_by_month/${year}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly prediction trend", error);
    throw error;
  }
};
