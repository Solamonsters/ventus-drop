import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { CandyMachineAccount } from './candy-machine';

import { CircularProgress } from '@material-ui/core';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useEffect, useState } from 'react';
import { whitelistSettings, publicSaleSettings, mintPanic } from './userSettings';
import { toDate }  from './utils'


export const CTAButton10 = styled(Button)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(0deg, #00239f 0%, #0030db 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`; // add your styles here

export const MintButton10 = ({
  onMint10,
  candyMachine,
  
  isMinting,
  
  
}: {
  onMint10: () => Promise<void>;
  candyMachine: CandyMachineAccount | undefined;
  
  isMinting: boolean;
 
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);
  const whitelistStartDate = toDate(whitelistSettings.startDate)?.getTime();
  const whitelistEndDate = toDate(whitelistSettings.endDate)?.getTime();
  const publicMintStart = toDate(publicSaleSettings.startDate)?.getTime();
  const publicMintEnd = toDate(publicSaleSettings.endDate)?.getTime();

  function whiteListSaleCheck() {
    if (whitelistSettings.enabled && (whitelistStartDate && whitelistEndDate ) && Date.now() > whitelistStartDate && Date.now() < whitelistEndDate) {
      
      return true
    } else {
      
      return false
    }
  }
  
  let WhitelistMintActive = whiteListSaleCheck()
  console.log('is Whitelist Sale Active? ' + whiteListSaleCheck())

  function publicSaleCheck() {

    if (publicMintStart && publicMintEnd){
      if(Date.now() > publicMintStart && Date.now() < publicMintEnd){
        return true
      } else {
        return false
      }
    }
    else if (publicMintStart) {
      if (Date.now() > publicMintStart){
        return true
      } else {
        return false
      }
    
    }


  }

  let PublicMintActive = publicSaleCheck()

  console.log('is public sale live? '+ publicSaleCheck())
  
  console.log(candyMachine?.state.isSoldOut, isMinting, (WhitelistMintActive || PublicMintActive) ,!candyMachine?.state.isActive)

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      console.log('Minting');
      onMint10();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint10]);
  return (
    <CTAButton10
      className='mint10Button'
      disabled={
        candyMachine?.state.isSoldOut ||
        isMinting ||
        mintPanic.enabled ||
        !(WhitelistMintActive || PublicMintActive)
        

      }
      onClick={async () => {
        setClicked(true);
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
          console.log('gatekeeper active')
          if (gatewayStatus === GatewayStatus.ACTIVE) {
            console.log(gatewayStatus + GatewayStatus.ACTIVE)
            setClicked(true);
          } else {
            console.log('requeting token')
             let token = await requestGatewayToken();
            console.log(token);
          }
        } else {
          await onMint10();
          setClicked(false);
        }
      }}
      variant="contained"
    >
      <div className='mint10-button-text'>
      {candyMachine?.state.isSoldOut ? (
        'SOLD OUT'
      ) : isMinting ? (
        <CircularProgress />
      
      ) : mintPanic.enabled ? (

        'Mint Paused'

      ) :  (
        'MINT 10'
      )}
      </div>
    </CTAButton10>
  );
};