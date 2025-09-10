
import { Alert, Linking } from "react-native";
import { protocol, RootApi, tenant } from "./config";


export const decodeUrlID = (urlID: string) => {
    try {
        const base64DecodedString = decodeURIComponent(urlID); // Decodes %3D%3D to ==
        const decoded = atob(base64DecodedString);
        return decoded.split(":")[1];
    } catch (error) {
        console.error("Error decoding ID:", error);
        return null;
    }

    // const id = Buffer.from(base64DecodedString, 'base64').toString('utf-8'); // Decoding from base64
    // return id.split(":")[1]
}

export const capitalizeFirstLetter = (str: string) => {
    if (!str) return ''; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



export const removeEmptyFields = (obj: any) => {
  const newObj: any = {};
  for (const key in obj) {
    // Keep File objects and non-empty values
    if (obj[key] instanceof File || 
        (obj[key] !== null && obj[key] !== undefined && obj[key] !== '')) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};


export const validateDate = (dateString: string): { isValid: boolean; error?: string } => {
  if (!dateString || dateString.length !== 10) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  const currentYear = new Date().getFullYear();
  
  if (year < currentYear) {
    return { isValid: false, error: 'Year cannot be in the past' };
  }
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 01-12' };
  }
  
  if (day < 1 || day > 31) {
    return { isValid: false, error: 'Day must be between 01-31' };
  }
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return { isValid: false, error: `Invalid day for ${month}/${year}` };
  }
  
  return { isValid: true };
};




export const handleSupport = () => {
  const phoneNumber = "237673351854";
  const message = "Hello, I need help resetting my password.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
};





export const errorLog = (err: any, show?: boolean) => {
  let mes = "An unknown error occurred";

  if (typeof err === "string") {
    mes = err;
  }

  // GraphQL Errors
  else if (err?.graphQLErrors?.length > 0) {
    console.error("GraphQL Errors:", err.graphQLErrors);
    mes = err.graphQLErrors.map((e: any) => e.message).join('\n');
  }

  // Network Errors (Apollo network error with result.errors[])
  else if (err?.networkError) {
    if ("result" in err.networkError) {
      if (err?.networkError?.result?.errors?.length > 0) {
        console.log("Network Error -> GraphQL errors:", err?.networkError?.result?.errors);
        mes = err.networkError.result.errors.map((e: any) => e.message).join('\n');
      }
      else if (err?.networkError?.message) {
        console.log("Network Error:", err.networkError.message);
        mes = err.networkError.message;
      }
      else {
        console.error("Apollo Network Error:", err.networkError);
      }
    }
  }

  // Extra Info fallback
  else if (err?.extraInfo) {
    console.error("Extra Info:", err.extraInfo);
    mes = String(err.extraInfo);
  }

  // Plain error message
  else if (err?.message) {
    mes = err.message;
  }

  // Unknown error fallback
  else {
    console.error("Unhandled error:", err);
  }

  // SweetAlert show option
  if (show) {
    // Swal.fire({
    //   title: mes,
    //   icon: 'error',
    //   timer: 3000,
    //   timerProgressBar: true,
    //   showConfirmButton: false,
    // });
  }

  return mes;
};


export const actionSubmit = async (data: any, url: string) => {
  console.log(data);
  console.log(url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);

    if (result?.errors) {
      Alert.alert("Error", JSON.stringify(result.errors));
      return;
    }

    if (result?.email?.length) {
      Alert.alert("Error", result.email[0]);
      return;
    }

    if (result?.error) {
      if (JSON.stringify(result.error).includes("(535, b'Incorrect authentication data')")) {
        return "An Error Occurred";
      }
      return JSON.stringify(result?.error);
    }
    return result

  } catch (err: any) {
    return err;
  }
};



