import axios from "axios";
import React, { useState } from "react";

const importBook = async (file, userToken) => {
 const formData = new FormData();
  formData.append('zip_file', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${userToken.headers.Authorization}`,
    }
  };

  return axios
    .post("/api/v1/upload_zip_file", formData, config)
    .then(async (uploadResponse) => {
      console.log("Upload response", uploadResponse);

      if (uploadResponse.status === 200) {
        alert("Imported to the server successfully");

        try {
          const processResponse = await axios
            .post("/api/v1/process_uploaded_zip_file", { zip_file_name: file.name }, config);
          console.log("Processing response", processResponse);
          if (processResponse.status === 200) {

            if (processResponse.data.mismatched_data && processResponse.data.mismatched_data.length > 0) {
              const mismatchedDataString = processResponse.data.mismatched_data.map(row => JSON.stringify(row)).join('\n');
              alert(`Some data could not be processed:\n${mismatchedDataString}`);
               window.location.reload(true);
            } else {
              alert("Data added to the database successfully");
               window.location.reload(true);
            }
          }
        } catch (processError) {
          console.error("Processing error", processError);
        }
      }
    })
    .catch((uploadError) => {
      console.error("Upload error", uploadError);
    });
};

const exportBook = async (userToken) => {
  return axios
    .get("/api/v1/books", userToken)
    .then((response) => {
      const fileName = "exportedbooks";
      const exportType = "csv"; 
      const mappedData = [];
      response.data.items.forEach(function (item) {
        const mappedItem = {
          id: item.id,
          name: item.name,
          category_id: item.category.id,
          subcategory_id: item.subcategory.id,
          author_id: item.author.id,
          publisher_id: item.publisher.id,
          category_name: item.category.name,
          subcategory_name: item.subcategory.name,
          publisher_name: item.publisher.name,
          author_name: item.author.name,
          isbn_number: item.isbn_number,
          image_name: item.image_name,
        };

        mappedData.push(mappedItem);
      });

      return { data: mappedData, fileName, exportType };
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
export { importBook, exportBook};
