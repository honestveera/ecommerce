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
const CreateNewOrder = ({
  open,
  columns,
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
    if (!values.order_type) {
      newErrors.order_type = "Order Type is required.";
    }
    if (!values.date) {
      newErrors.date = "Date is required.";
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
    // if (accessorKey === "publisher_name") {
    //   return publishers.map((state) => (
    //     <MenuItem key={state.id} value={state.id}>
    //       {state.name}
    //     </MenuItem>
    //   ));
    // } else if (accessorKey === "author_name") {
    //   return authors.map((state) => (
    //     <MenuItem key={state.id} value={state.id}>
    //       {state.name}
    //     </MenuItem>
    //   ));
    // } else if (accessorKey === "category_name") {
    //   return categories.map((state) => (
    //     <MenuItem key={state.id} value={state.id}>
    //       {state.name}
    //     </MenuItem>
    //   ));
    // } else {
    //   return subcategories.map((state) => (
    //     <MenuItem key={state.id} value={state.id}>
    //       {state.name}
    //     </MenuItem>
    //   ));
    // }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Order</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => (
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
          Create New Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateNewOrder;
