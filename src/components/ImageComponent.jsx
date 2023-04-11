import React from 'react';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { styled } from "@mui/system"; // <--- Add this ✅




const ImageComponent = ({ images, userTokens }) => {
 const {handleImageClick, account}=   useGlobalContext();
console.log("image component",images);
const navigate =useNavigate();

const TokenIds = []
const tokens = userTokens?.filter((a)=> {
  console.log(a?.token_id)
  return TokenIds.push(a?.token_id)
})

const handleClick=(_value)=>{
  const { e, image} = _value
  if(!account) return
  if(image?.name == 'bird1' || TokenIds?.includes(image?.token_id)) {
    console.log('success');
    handleImageClick(image?.value);
    localStorage.setItem('selectedImage',image?.value)
    navigate('/play', { replace: true });
  }
  
}


const classes = styled((theme) => ({
  image: {
    width: '100%',
    height: 'auto',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.2)',
      boxShadow: `0 3px 5px ${theme.palette.primary.main}`,
    },
  },
}));



      return (
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {images.map((image, index) => (
            <ImageListItem key={index} >
              <img
              className={classes}
                src={`${image?.value}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${image?.value}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={image?.name}
                loading="lazy"
                onClick={(e)=>handleClick({e, image})}
                
              />
              <p sx={{justifyContent:"center", textAlign:"center"}} >{TokenIds?.includes(image?.token_id)?"Unlocked":image?.status}</p>
            </ImageListItem>
            
          ))}
        </ImageList>
      );
    }
    

export default ImageComponent;