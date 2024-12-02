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
  deliveryPartner,
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

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const updateMenus = (accessorKey) => {
    if (accessorKey === "delivery_partner" && deliveryPartner && deliveryPartner.items) {
      return deliveryPartner.items.map((state) => (
        <MenuItem key={state.id} value={state.email}>
          {state.email}
        </MenuItem>
      ));
    } else if (accessorKey === "status") {
      return ["ORDER_ASSIGNED"].map((state) => (
        <MenuItem key={state} value={state}>
          {state}
        </MenuItem>
      ));
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Assign User</DialogTitle>
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
              column.accessorKey === "delivery_partner" ||
              column.accessorKey === "status" ? (
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
                  disabled
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
          Assign User
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateNewOrder;
