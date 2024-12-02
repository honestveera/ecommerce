import React, { useState } from "react";
import FormData from 'form-data';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import tokenHeader from "helpers/tokenHelper";

//example of creating a mui dialog modal for creating new rows
const CreateNewBook = ({
  open,
  columns,
  authors,
  publishers,
  categories,
  subcategories,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const userToken = tokenHeader();
  console.log("userToken:", userToken);

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.publisher_name) {
      newErrors.publisher_name = "Publisher name is required.";
    }
    if (!values.name) {
      newErrors.name = "name is required.";
    }
    if (!values.isbn_number) {
      newErrors.isbn_number = "ISBN  number is required.";
    }
    if (!values.author_name) {
      newErrors.author_name = "Author name is required.";
    }

    if (!values.category_name) {
      newErrors.category_name = "Category name is required.";
    }

    if (!values.subcategory_name) {
      newErrors.subcategory_name = "Subcategory name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file);
    if (file) {
      setValues((prevValues) => ({
        ...prevValues,
        image: file, 
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", values.image);
    console.log("userToken:", userToken);

    try {
      const response = await fetch("/api/v1/books/upload", {
        method: "POST",
        body: formData,
        ...userToken, 
      });
      if (response.ok) {
        const data = await response.json();
        const imagePath = data.filePath;

        const updatedFormData = { ...values, image_name: imagePath || "/uploads/noimage.png" };
        if (validateForm(updatedFormData)) {
           onSubmit(updatedFormData);
          setValues([]);
          onClose();
        }
      } else {
        console.error('Error uploading image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const updateMenus = (accessorKey) => {
    if (accessorKey === "publisher_name") {
      return publishers.map((state) => (
        <MenuItem key={state.id} value={state.id}>
          {state.name}
        </MenuItem>
      ));
    } else if (accessorKey === "author_name") {
      return authors.map((state) => (
        <MenuItem key={state.id} value={state.id}>
          {state.name}
        </MenuItem>
      ));
    } else if (accessorKey === "category_name") {
      return categories.map((state) => (
        <MenuItem key={state.id} value={state.id}>
          {state.name}
        </MenuItem>
      ));
    } else {
      return subcategories.map((state) => (
        <MenuItem key={state.id} value={state.id}>
          {state.name}
        </MenuItem>
      ));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Book</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) =>
              column.accessorKey === "publisher_name" ||
              column.accessorKey === "subcategory_name" ||
              column.accessorKey === "author_name" ||
              column.accessorKey === "category_name" ? (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  select={true}
                  error={errors[column.accessorKey]}
                  helperText={errors[column.accessorKey]}
                  onChange={(e) => handleChange(e)}
                >
                  {updateMenus(column.accessorKey)}
                </TextField>
              ) : column.accessorKey === "image_name" ? (
                <FormControl fullWidth key={column.accessorKey} style={{ marginTop: "1rem" }}>
                  <InputLabel>{column.header}</InputLabel>
                  <Input
                    type="file"
                    name={column.accessorKey}
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </FormControl>
              ) : (
                <FormControl fullWidth key={column.accessorKey} style={{ marginTop: "1rem" }}>
                  <InputLabel>{column.header}</InputLabel>
                  <Input
                    type="text"
                    name={column.accessorKey}
                    onChange={handleChange}
                  />
                </FormControl>
              )
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Book
        </Button>
      </DialogActions>
    </Dialog>
  );
  };
export default CreateNewBook;