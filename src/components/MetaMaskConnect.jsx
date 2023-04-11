import React from 'react'
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useGlobalContext } from '../context';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageComponent from './ImageComponent';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { BorderAllRounded, BorderOuterRounded } from '@mui/icons-material';
const baseUrl = import.meta.env.VITE_APIURL
const contract = import.meta.env.VITE_CONTRACT

const initialImages = [
  {name:"bird1",value:"images/bird1.png",status:"Unlocked Free"},
  {name:"bird2", value:"images/bird2.png",status:"Unlock at 5 Score", token_id:0},
  {name:"bird3", value:"images/bird3.png",status:"Unlock at 10 Score", token_id:1},
  {name:"bird4", value:"images/bird4.png",status:"Unlock at 20 Score", token_id:2},
  {name:"bird5", value:"images/bird5.png",status:"Unlock at 30 Score", token_id:3},
  {name:"bird6", value:"images/bird6.png",status:"Unlock at 50 Score", token_id:4},
]
const Contract = import.meta.env.VITE_CONTRACT
const MetaMaskConnect = () => {


  const { account, balance, errorMessage,
    showMyNfts, connectHandler,
  } = useGlobalContext();
  const navigate = useNavigate();
  const handleMint = () => {
    navigate('/mint', { replace: true })
  }
  const handlePlayBtn = () => {
    navigate('/play', { replace: true })
  }
  // console.log("here", account);
  const [showAssetsMessage, setShowAssetsMessages] = useState("Show My Assets");
  const [showAssets, setShowAssets] = useState(false);
  const [images, setImages] = useState(initialImages);
  const [userImages, setUserTokens] = useState(initialImages)

  // console.log("contract is : ",Contract)
  useEffect(() => {
    const getAssets = async () => {
      // const getNfts = await axios.get(`${baseUrl}/nft/get-user-nft-cntr/${account}/${contract}`);
      const getNfts = await axios.get(`${baseUrl}/nft/get-user-1155-assets-by-collection/${account}/${contract}`)
      console.log(getNfts.data);
      setUserTokens(getNfts.data);
    };
    if (account) {
      getAssets();
    }
  }, [account]);

  const toggleAssets = (e) => {
    if(!account) return;
    setShowAssets(!showAssets)
    // showAssets === true ? setShowAssets(false) : setShowAssets(true);
    showAssets === true ? setShowAssetsMessages("Hide My Assets") : setShowAssetsMessages("Show My Assets");

  }

  return (

    <>
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  minHeight: '100vh' }}>
        <Stack justifyContent="center" spacing={3} direction="row">
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'transparent' }}>
            <Stack spacing={2}>
              <Typography variant="h6">{account === null ? 'Please Connect To your Wallet' : `Account: ${account}`}</Typography>
              <Typography variant="h6">{balance === null ? '' : `Balance: ${balance} ETH`}</Typography>
            </Stack>
          </Paper>
        </Stack>

        <Stack justifyItems="center" spacing={3} direction="column">
          <Button sx={{ borderRadius: '16px' }} variant="contained" color='primary' onClick={connectHandler}>{account?"Connected":"Connect Wallet"}</Button>
          {errorMessage ? (
            <Typography variant="body1" color="error">
              Error: {errorMessage}
            </Typography>
          ) : null}
          {/* <Button sx={{ borderRadius: '16px' }} variant="contained" color='secondary' onClick={handleMint}>Mint</Button> */}
          {account && 
          <>
          <Button sx={{ borderRadius: '16px' }} variant="contained" color='success' onClick={handlePlayBtn}>{'Play Now'}</Button>
          <Button sx={{ borderRadius: '16px' }} variant="contained" color='success' onClick={toggleAssets}>{showAssets ? 'Hide Assets' : 'Show Assets'}</Button>
          {showAssets ? (
            <Typography variant="body1" color="black">
               {'Unlock Birds by playing game or buy from Marketplace'}
            </Typography>
          ) : null}
          {showAssets &&<Button sx={{ borderRadius: '16px' }} variant="contained" color='success' onClick={()=> {window.open(`https://testnets.gamestoweb3.com/collections/${contract}`, '_block')}}>Buy On Marketplace</Button>}
          </>}
        </Stack>

        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={6}>
            {showAssets && images.length > 0 && <ImageComponent images={images} userTokens={userImages}/>}
          </Grid>
        </Grid>
      </Container >
    </>
  )
}

export default MetaMaskConnect