import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const uploadFile = async () => {
    try {
        const formData = new FormData();
        formData.append('document', fs.createReadStream('./package.json')); // using package.json as a dummy document

        const response = await axios.post('http://localhost:3001/api/ngos/upload-document', formData, {
            headers: {
                ...formData.getHeaders(),
                // Authorization: 'Bearer ...' // Skip auth for now to see if the route even hits
            }
        });
        console.log('Upload Success:', response.data);
    } catch (error) {
        console.error('Upload Failed:', error.response?.data || error.message);
    }
};

uploadFile();
