import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, TextField } from '@mui/material';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Typography } from '@mui/material';

const baseUrl = import.meta.env.VITE_APIURL
const contract = import.meta.env.VITE_CONTRACT
const ApiKey = import.meta.env.VITE_DEV_API
const DevAddress= import.meta.env.VITE_DEV_ADDRESS

const NFTMint = (token_id) => {
   const { account } = useGlobalContext();

   const navigate = useNavigate();

   const handleMint = async (token_id) => {
      const mintObject = {
         wallet_address: DevAddress,
         contract_address: contract,
         token_owner: account,
         token_id:token_id,
         name:'',
         image_uri: '',
         description:'',
         external_uri: '',
         attributes:[]
      };
      // console.log("From UPLOAD FILE", { account, apiKey, mintObject });

      const mintApi = `${baseUrl}/nft/mint-nft`;
      const response = await axios.post(mintApi, mintObject, {
         headers: {
            'Content-Type': 'application/json',
            'X-API-HEADER': ApiKey
         }
      })
      console.log(response);
      navigate("/", { replace: true });

   };


   return (
      <></>
   );
};

export default NFTMint;




