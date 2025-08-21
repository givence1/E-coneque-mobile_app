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