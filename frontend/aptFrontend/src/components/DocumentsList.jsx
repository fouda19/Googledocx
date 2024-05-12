import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Icon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DocsCard from "./documentCard";
import Modal from "./popup";
import PopUp from "./popup";
import { Box } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { fetchRequest, postRequest } from "../API/API";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";

function Doclist() {
  const [sortby, setsort] = useState("Owned by me");
  const [sortParam, setSortParam] = useState("me");
  const [open, setOpen] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filename, setFilename] = useState("");
  const [errorMessage, setError] = useState("");
  const postReq = useMutation((data) =>
    postRequest("/backend/documents/newDocument", data)
  );
  const { data, isLoading, isError, isSuccess, refetch } = useQuery(
    ["documents", sortParam],
    () => fetchRequest(`/backend/documents/${sortParam}`)
  );
  console.log(data?.data);

  const handleClick = (event) => {
    console.log("clicked");
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (sortType) => {
    // Update state based on the sortType
    // For example: setSort(sortType);
    setsort(sortType);
    setSortParam(
      sortType === "Owned by me"
        ? "me"
        : sortType === "Owned by others"
        ? "others"
        : "all"
    );
    // Close the menu
    handleClose();
  };
  const handleButtonClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSave = () => {
    if (filename.trim() === "") {
      // alert("Please enter text before saving.");
      setError("Please enter text before saving.");
      return;
    }
    postReq.mutate(filename, {
      onSuccess: () => {
        setPopUp(false);
        setFilename("");
        refetch();
      },
    });
  };
  return (
    <>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => setPopUp(true)}
        >
          Add New Document
        </button>
      </div>
      {popUp && (
        <Modal
          open={popUp}
          setOpen={setPopUp}
          type={0}
          message={"Enter New Document Name"}
          handleClick={handleSave}
          handleInputChange={(e) => {
            setFilename(e.target.value);
            setError("");
          }}
          input={filename}
          error={errorMessage}
        />
      )}
      <section className="bg-white px-10 md:px-0">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5 border-b-2 border-gray-200">
            <h2 className="font-medium">Recent documents</h2>
            {/* <div display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={handleClick}>
                <Typography variant="body1">{sortby}</Typography> ArrowDownwardIcon
              </IconButton>
            </div> */}
            <Box display="flex" alignItems="center">
              <Typography variant="body1">{sortby}</Typography>
              <IconButton onClick={handleClick}>
                <ArrowDownwardIcon />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleMenuItemClick("Owned by me")}>
                Owned by me
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick("Owned by others")}>
                Owned by others
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick("All Docs")}>
                All Docs
              </MenuItem>
            </Menu>
            <Typography variant="body1" sx={{ marginRight: 9 }}>
              Date Created
            </Typography>
            {/* <p className="mr-12">Date created</p> */}
          </div>

          <div>
            {isSuccess &&
              data?.data.map((doc) => (
                <DocsCard
                  key={doc.doc._id}
                  id={doc.doc._id}
                  fileName={doc.doc.name}
                  date={doc.doc.creationDate}
                  owner={doc.doc.owner.firstName + " " + doc.doc.owner.lastName}
                  isOwner={doc.isOwner}
                  isEditor={doc.isEditor}
                  isViewer={doc.isViewer}
                  refetch={refetch}
                />
              ))}
          </div>
          {/* <div>
            {isSuccess &&
              data.data.map((doc) => (
                <DocsCard
                  key={doc._id}
                  id={doc._id}
                  fileName={doc.name}
                  date={doc.creationDate}
                  owner={doc.owner}
                  editorList={doc.editors}
                  viewerList={doc.viewers}
                />
              ))}
          </div> */}
        </div>
      </section>
    </>
  );
}

export default Doclist;
