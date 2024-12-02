import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

//example of creating a mui dialog modal for creating new rows
const CreateNewCorporate = ({
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

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.name) {
      newErrors.name = "Name is required.";
    }
    if (!values.validity) {
      newErrors.validity = "Validity is required.";
    }
    if (!values.address) {
      newErrors.address = "Address is required.";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm(values)) {
      onSubmit(values);
      setValues([]);
      onClose();
    }
  };

  const updateMenus = (accessorKey) => {
    if (accessorKey === "active") {
      return ['ACTIVE', 'INACTIVE'].map((state) => (
        <MenuItem key={state} value={state}>
          {state}
        </MenuItem>
      ));
    } 
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Corporate</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) =>
              column.accessorKey === "active" ? (
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
              ) : (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  error={errors[column.accessorKey]}
                  helperText={errors[column.accessorKey]}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                ></TextField>
              )
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Corporate
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateNewCorporate;
