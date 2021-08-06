import React, {useContext, useState, useEffect, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { uid } from 'uid';
import {init} from '../utils/initFirebase'
import CharacterContext from '../context/CharacterContext';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import '../styles/diceRoll.css'
init();
const db = firebase.firestore();

const DiceRoll = (props) => {
  const {character} = useContext(CharacterContext);
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [isOpen, setIsOpen] = useState(false)
  const diceRef = useRef(null)

  const roll = async (max, isDm) => {
    const randomValue = Math.floor(Math.random() * max) + 1;
    const rollUid = uid();
    const dataRoll = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userName: !isDm ? character.name : "DM",
      characterId: character.uid,
      value: randomValue,
      campaignId: character.idCampaign,
      uid: rollUid,
      isDmRoll: isDm,
      diceType: max,
      pictureUserSendRoll: user.photoURL,
    }
    console.log('roll');
    await db.collection('dice').doc(rollUid).set(dataRoll).then(res => {
    
    }).catch(e => {
      console.log(e)
    });
  }

  return (
    <div
      ref={diceRef}
      className={`${props.chat === true  ? 'containerRollButtonPhone' : 'containerRollButton'}`}  
    >
      <div className={`${isOpen ? 'open': 'close'}`}>
        <div className='subChoice'>
          <button
            className='subRoll'
            onClick={() => {
              roll(100, user.uid === campaign.idUserDm)
            }}
          >
            <svg version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 29" width="42" height="38" fill="#fff">
              <path id="Layer" fillRule="evenodd" className="shp0" d="M16 13.5L15.5 16.5L8 22L0.5 16.5L0 13.5L8 7.5L16 13.5ZM14.85 13.9L10.15 10.15L12.85 14.65L14.6 15.5L14.85 13.9ZM3.5 15.55L1.95 16.35L7.5 20.35L7.5 17.3L3.5 15.55ZM8.5 20.4L14.05 16.35L12.5 15.55L8.5 17.3L8.5 20.4ZM11.8 14.75L8 8.95L4.2 14.75L8 16.45L11.8 14.75ZM1.4 15.5L3.15 14.65L5.85 10.15L1.15 13.9L1.4 15.5Z" />
              <path id="Layer copy" fillRule="evenodd" className="shp0" d="M32 13.5L31.5 16.5L24 22L16.5 16.5L16 13.5L24 7.5L32 13.5ZM30.85 13.9L26.15 10.15L28.85 14.65L30.6 15.5L30.85 13.9ZM19.5 15.55L17.95 16.35L23.5 20.35L23.5 17.3L19.5 15.55ZM24.5 20.4L30.05 16.35L28.5 15.55L24.5 17.3L24.5 20.4ZM27.8 14.75L24 8.95L20.2 14.75L24 16.45L27.8 14.75ZM17.4 15.5L19.15 14.65L21.85 10.15L17.15 13.9L17.4 15.5Z" />
            </svg>
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(20, user.uid === campaign.idUserDm)
            }}
          >
            <svg className='diceIcon' xmlns="http://www.w3.org/2000/svg" width="28" height="31" fill="#fff"><path d="M14 0L0 7.5v15.2l14 7.5 13-7 1-.6V7.5L14 0zm-2 8.3l-5.9 8.8-3.7-8 9.6-.8zM8 18l6-9.1 6 9.1H8zm13.8-.9L16 8.3l9.5.7-3.7 8.1zM15 2.8l7.4 4-7.4-.6V2.8zm-2 0v3.4l-7.4.6 7.4-4zm-11 10l2.7 6L2 20.4v-7.6zm1 9.3l2.7-1.6 4.4 5.5L3 22.1zM8 20h11l-5 7.5L8 20zm9.9 5.9l4.4-5.5L25 22l-7.1 3.9zm5.6-7l-.2-.1 2.7-6v7.6l-2.5-1.5z"/></svg>
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(12, user.uid === campaign.idUserDm)
            }}
          >
            <svg className='diceIcon' width='30' height='32' fill='#fff' xmlns='http://www.w3.org/2000/svg'><path d='M25 4L15 0 5 4l-5 7v10l6 7 9 4 9-4 6-7V11l-5-7zM2 11.9L6 14l3.7 8.2-3.4 3.4L2 21v-9.1zM12 22l-3.7-7.2L15 9.2l6.7 5.5L18 22h-6zm16-1l-4.3 4.7-3.4-3.4L24 14l4-2.1V21zM16 2.2l7.8 3.6L27 10l-4.5 2.6L16 7.5V2.2zM6.2 5.8L14 2.2v5.2l-6.5 5.1-.5-.1L3 10l3.2-4.2zm2.1 21l3-3h7.5l3 3L15 30l-6.7-3.2z'/></svg>
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(10, user.uid === campaign.idUserDm)
            }}
          >
            <svg className='diceIcon' width='32' height='29' fill='#fff' xmlns='http://www.w3.org/2000/svg'><path d='M16 0L0 12l1 6 15 11 15-11 1-6L16 0zm13.7 12.8l-.5 3.2-3.5-1.7-5.4-9 9.4 7.5zM15 19.6v6.1l-11.1-8L7 16.1l8 3.5zm2 0l8-3.5 3.1 1.6L17 25.8v-6.2zm6.6-5.1L16 17.9l-7.6-3.4L16 2.9l7.6 11.6zM2.3 12.8l9.4-7.5-5.4 9L2.8 16l-.5-3.2z'/></svg>
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(8, user.uid === campaign.idUserDm)
            }}
          >
            <svg className='diceIcon' width='26' height='31' fill='#fff' xmlns='http://www.w3.org/2000/svg'><path d='M13 0L0 8v13l13 10 13-10V8L13 0zm11 15.9L17 4.5 24 9v6.9zM13 2l.1.1L24.2 20H1.8L12.9 2.1 13 2zM9 4.5L2 15.9V9l7-4.5zM3.9 22h18.2L13 28.5 3.9 22z'/></svg>
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(6, user.uid === campaign.idUserDm)
            }}
          >
            <svg className='diceIcon' width='27' height='27' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M1 6.978h17.602M1 6.978L10.444 1H26M1 6.978V26h17.602m0-19.022L26 1m-7.398 5.978V26M26 1v17.391L18.602 26' stroke='#fff' strokeWidth='1.75'/></svg>
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(4, user.uid === campaign.idUserDm)
            }}
          >
            <svg className='diceIcon' width='31' height='27' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14.5 2L2 25.5h22.5M14.5 2l10 23.5M14.5 2l15 11-5 12.5' stroke='#fff' strokeWidth='1.75'/></svg>
          </button>
        </div>
      </div>
      <button
        className={'subRoll mainRoll'}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {!isOpen ? <svg className='diceIcon' xmlns="http://www.w3.org/2000/svg" width="28" height="31" fill="#fff"><path d="M14 0L0 7.5v15.2l14 7.5 13-7 1-.6V7.5L14 0zm-2 8.3l-5.9 8.8-3.7-8 9.6-.8zM8 18l6-9.1 6 9.1H8zm13.8-.9L16 8.3l9.5.7-3.7 8.1zM15 2.8l7.4 4-7.4-.6V2.8zm-2 0v3.4l-7.4.6 7.4-4zm-11 10l2.7 6L2 20.4v-7.6zm1 9.3l2.7-1.6 4.4 5.5L3 22.1zM8 20h11l-5 7.5L8 20zm9.9 5.9l4.4-5.5L25 22l-7.1 3.9zm5.6-7l-.2-.1 2.7-6v7.6l-2.5-1.5z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
      </svg>
      }
      </button>
    </div>
  );
}
export default DiceRoll
