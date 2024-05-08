import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Box } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { postRequest } from "../API/API";
import { useMutation } from "react-query";

export default function SharePop({ open, setOpen, id }) {
  // const [open, setOpen] = React.useState(true);
  const [userType, setType] = useState("Viewer");
  const [inputText, setInputText] = React.useState("");
  const [error, setError] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const shareReq = useMutation((data) => postRequest("/backend/documents/share", data));
  const handleInputChange = (event) => {
    setInputText(event.target.value);
    setError("");
  };

  const handleMenuItemClick = (sortType) => {
    // Update state based on the sortType
    // For example: setSort(sortType);
    setType(sortType);
    // Close the menu
    handleClose();
  };

  const handleSubmit = () => {
    // TODO handle type
    if (inputText.trim() === "") {
      // alert("Please enter text before saving.");
      setError("Please enter a username before sharing.");
      return;
    }
    shareReq.mutate({ email: inputText, type: userType, id: id }, { onSuccess: () => { setOpen(false); } })
  };

  const handleClose = () => {
    // setOpen(false);
    setAnchorEl(null);
  };
  const handleCloza = () => {
    setOpen(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
        <DialogTitle>Share</DialogTitle>
        <DialogContent>
          <DialogContentText>{error || ""}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={inputText}
            onChange={handleInputChange}
          />
          <Box display="flex" alignItems="center">
            <Typography variant="body1">{userType}</Typography>
            <IconButton onClick={handleClick}>
              <ArrowDownwardIcon />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleMenuItemClick("Viewer")}>
              Viewer
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Editor")}>
              Editor
            </MenuItem>
          </Menu>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Share
          </Button>
          <Button onClick={handleCloza} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
