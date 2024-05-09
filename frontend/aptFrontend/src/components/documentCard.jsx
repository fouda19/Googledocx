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
import { useMutation } from "react-query";
import { postRequest } from "../API/API";
import { useNavigate } from "react-router-dom";

function DocsCard({ id, fileName, date, owner, editorList, viewerList }) {
  const [popUp, setPopUp] = useState(false);
  const [sharePop, setSharePop] = useState(false);
  const [newFilename, setNewFilename] = useState('');
  const [error, setError] = useState('');
  const currentUser = "me";
  const isOwner = owner === currentUser;
  const isEditor = editorList.includes(currentUser);
  const isViewer = viewerList.includes(currentUser);
  const flagRename = isOwner || isEditor;
  const flagDelete = isOwner;
  const flagShare = isOwner;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const renameReq = useMutation((data) =>
    postRequest("/backend/documents/rename", data)
  );
  const deleteReq = useMutation((data) =>
    postRequest("/backend/documents/delete", data)
  );
  const navigate = useNavigate()
  const handleClick = (event) => {
    console.log("clicked");
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    console.log("deleting");
    deleteReq.mutate({
      id: id
    }
      ,
      {
        onSuccess: () => { }
      }
    )

    handleClose();
  }

  const handleRename = () => {
    console.log("renaming");
    if (newFilename.trim() === "") {
      // alert("Please enter text before saving.");
      setError("Please enter text before renaming.");
      return;
    }
    renameReq.mutate({
      filename: newFilename,
      id: id
    }
      ,
      {
        onSuccess: () => {
          setPopUp(false)
          setNewFilename('')
        }
      }
    )

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
      onClick={() => navigate(`/texteditor/${id}`)}
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
        <IconButton onClick={(e)=>{ handleClick(e); e.stopPropagation(); }}>
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} onClick={(e) => { e.stopPropagation() }}>
        {flagRename &&
          <MenuItem
            onClick={(e) => {
              setPopUp(true)
              handleClose()
              e.stopPropagation()
            }}>Rename
          </MenuItem>}
        {flagDelete && <MenuItem onClick={(e) => { handleDelete(); e.stopPropagation(); }}>Delete</MenuItem>}
        {flagShare && <MenuItem onClick={(e) => { handleShare(); e.stopPropagation(); }}>Share</MenuItem>}
      </Menu>

      {popUp && (
        <Modal
          open={popUp}
          setOpen={setPopUp}
          type={1}
          message={"Rename the document"}
          error={error}
          handleClick={handleRename}
          handleInputChange={(e) => {
            setNewFilename(e.target.value)
            setError('')
          }}
          input={newFilename}
        />
      )}
      {sharePop && <SharePop open={sharePop} setOpen={setSharePop} />}
    </div>
  );
}

export default DocsCard;
