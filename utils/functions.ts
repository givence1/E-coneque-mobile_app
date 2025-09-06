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