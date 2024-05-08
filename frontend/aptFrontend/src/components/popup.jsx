import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// eslint-disable-next-line react/prop-types
export default function PopUp({ open, setOpen, message, handleClick, handleInputChange, input, error }) {
  // const [open, setOpen] = React.useState(true);
  // const [inputText, setInputText] = React.useState("");
  // const [error, setError] = React.useState("");
  // const handleInputChange = (event) => {
  //   setInputText(event.target.value);
  //   setError("");
  // };

  // const handleSubmit = () => {
  //   // TODO handle type


  //   setOpen(false);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
        <DialogTitle>{message}</DialogTitle>
        <DialogContent>
          <DialogContentText>{error || ""}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Text"
            type="text"
            fullWidth
            variant="standard"
            value={input}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
