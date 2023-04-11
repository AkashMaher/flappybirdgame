import React, { Children } from 'react'

import { GlobalContextProvider } from '../context'

const Mint = (_score) => {

  const scoreToMint = [
    {score:20, token_id:0},
    {score:30, token_id:1},
    {score:40, token_id:2},
    {score:50, token_id:3},
    {score:60, token_id:4}
  ]

  

  const handleMint = async (token_id) => {
      const mintObject = {
         wallet_address: DevAddress,
         contract_address: contract,
         token_owner: account,
         token_id:token_id,
         number_of_tokens:1,
         name:'',
         image_uri: '',
         description:'',
         external_uri: '',
         attributes:[]
      };
      // console.log("From UPLOAD FILE", { account, apiKey, mintObject });

      const mintApi = `${baseUrl}/nft/mint-1155`;
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
   <>sss</>
    
  ) 
}

export default Mint