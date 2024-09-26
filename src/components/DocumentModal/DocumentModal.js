import React from 'react';
import { Modal, Divider } from '@mui/material';
import styles from './DocumentModal.module.css'; // You'll need to create this CSS module
import deleteIcon from "../../assets/Images/icons8-delete-48.png";
import pdfimg from "../../assets/Images/icons8-pdf-64.png"
import downloadIcon from "../../assets/Images/icons8-download-48.png";

const DocumentModal = ({ 
    open, 
    onClose, 
    selectedFile, 
    handleFileChange, 
    filenameList, 
    deleteDoc 
  }) => {
    return (
        <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        size="xl"
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            margin: "auto",
            minWidth: "40%",
          }}
        >
          <div className={styles.fileuploadbox}>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput" className="file-upload-label">
              Drag and drop your files
            </label>
            {selectedFile && <p>{selectedFile.name}</p>}
          </div>
          <Divider />

          <p style={{ marginTop: "10px", marginBottom: "2px" }}>
          {`Uploaded files (${filenameList.length})`}
          </p>
          {Object.keys(filenameList).map((key) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                border: "2px solid",
                padding: "2px",
                marginBottom: "5px",
                backgroundColor: "#FAF9F6",
                borderColor: "#ccc",
              }}
            >
              <div
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <img
                    src={pdfimg}
                    style={{ width: "50%", height: "32px" }}
                    alt="PDF Icon"
                  />
                  <p style={{ alignSelf: "center" }}>{filenameList[key]}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <img
                    alt=""
                    src={deleteIcon}
                    className={styles.imgH}
                    onClick={() => deleteDoc(filenameList[key])}
                  />
                  <img alt="" src={downloadIcon} className={styles.imgH} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  };
  
  export default DocumentModal;