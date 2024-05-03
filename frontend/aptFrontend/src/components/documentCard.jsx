// import Button from "@material-tailwind/react/Button";
// import Icon from "@material-tailwind/react/Icon";

import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Icon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Typography from "@mui/material/Typography";

function DocsCard({ id, fileName, date }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    console.log("clicked");
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className="flex items-center py-4 rounded-lg hover:cursor-pointer hover:bg-gray-100 text-gray-700 text-sm"
      //   onClick={() => router.push(`/doc/${id}`)}
    >
      {/* <Icon name="article" size="3xl" color="blue" /> */}
      <p className="flex-grow pl-5 w-10 pr-10 truncate">{fileName}</p>
      <p className="pr-12 text-sm italic">
        {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </p>
      {/* <Button
        color="gray"
        buttonType="link"
        rounded={true}
        iconOnly={true}
        ripple="dark"
        className="w-20 border-0"
      >
        <Icon name="more_vert" size="3xl" /> */}
      {/* </Button> */}
      {/* <button class="focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
          class="h-6 w-6 text-gray-500"
        >
          <path d="M12 12a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0-12a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </button> */}
      <IconButton onClick={handleClick}>
        {/* <Typography variant="body1">Menu</Typography> */}
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default DocsCard;
