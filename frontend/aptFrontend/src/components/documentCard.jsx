// import Button from "@material-tailwind/react/Button";
// import Icon from "@material-tailwind/react/Icon";

import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Icon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import { useState } from "react";
import Modal from "./popup";
import SharePop from "./sharePop";

function DocsCard({ id, fileName, date, owner, editorList, viewerList }) {
  const [popUp, setPopUp] = useState(false);
  const [sharePop, setSharePop] = useState(false);
  const currentUser = "me";
  const isOwner = owner === currentUser;
  const isEditor = editorList.includes(currentUser);
  const isViewer = viewerList.includes(currentUser);
  const flagRename = isOwner || isEditor;
  const flagDelete = isOwner;
  const flagShare = isOwner;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    console.log("clicked");
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRename = () => {
    setPopUp(true);
    handleClose();
  };

  const handleShare = () => {
    setSharePop(true);
    handleClose();
  };
  return (
    <div
      className="flex items-center py-4 rounded-lg hover:cursor-pointer hover:bg-gray-100 text-gray-700 text-sm"
      //   onClick={() => router.push(`/doc/${id}`)}
    >
      {/* <Icon name="article" size="3xl" color="blue" /> */}
      <ArticleIcon color="primary" />
      <p className="flex-grow pl-5 w-10 pr-10 truncate">{fileName}</p>
      <p className="flex-grow pl-5 w-10 pr-10 truncate">{owner}</p>
      <p className="pr-12 text-sm italic">
        {date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      {isViewer ? (
        <IconButton style={{ pointerEvents: "none" }}>
          <MoreVertIcon
            style={{ visibility: "hidden", pointerEvents: "none" }}
          />
        </IconButton>
      ) : (
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {flagRename && <MenuItem onClick={handleRename}>Rename</MenuItem>}
        {flagDelete && <MenuItem onClick={handleClose}>Delete</MenuItem>}
        {flagShare && <MenuItem onClick={handleShare}>Share</MenuItem>}
      </Menu>

      {popUp && (
        <Modal
          open={popUp}
          setOpen={setPopUp}
          type={1}
          message={"Rename the document"}
        />
      )}
      {sharePop && <SharePop open={sharePop} setOpen={setSharePop} />}
    </div>
  );
}

export default DocsCard;
