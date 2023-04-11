import React, { useState } from 'react';
import { Button, Modal, Backdrop, Fade, Grid, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import "../styles/gamestyles.css";
import { useGlobalContext } from '../context';
const baseUrl = import.meta.env.VITE_APIURL
const contract = import.meta.env.VITE_CONTRACT
// Create the context

const ImageModal = () => {
  const {account} = useGlobalContext()
  // Create state to track whether the modal is open
  const [open, setOpen] = useState(false);
  // Create state to track which image is selected
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  const handleOpen = async () => {
    const getNfts = await axios.get(`${baseUrl}/nft/get-user-nft-cntr/${account}/${contract}`);
    console.log(getNfts.data);
    setImages(getNfts.data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    console.log(image);
  };

  const handleImageHover = (event) => {
    event.target.classList.add('highlighted');
  };

  const handleImageUnhover = (event) => {
    event.target.classList.remove('highlighted');
  };

  return (
<>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', maxWidth: '90%' }}>
            <Grid container spacing={2}>
              {images.map((image) => (
                <Grid item xs={4} key={image._id}>
                  <img
                    src={image.meta_data.image}
                    alt={`Image ${image._id}`}
                    onClick={() => handleImageClick(image)}
                    onMouseOver={handleImageHover}
                    onMouseOut={handleImageUnhover}
                    style={{ cursor: 'pointer' }}
                  />
                </Grid>
              ))}
            </Grid>
            <IconButton style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }} onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </Fade>
      </Modal>
      </>
  );
};

export default ImageModal;