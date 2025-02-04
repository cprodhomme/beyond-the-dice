import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { uid } from 'uid';
import Character from './Character';
import NewCharacterForm from '../components/NewCharacterForm';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import CharacterContext from '../context/CharacterContext';
import {init} from '../utils/initFirebase'
import '../styles/characters.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18next from 'i18next';
init();
const db = firebase.firestore();

const Characters = (props) => {
  let match = useRouteMatch();
  let { campaignIdUrl } = useParams();
  const [characters, setCharacters] = useState([])
  const [character, setCharacter] = useState({
      name: '',
      uid: undefined,
      idCampaign: undefined,
      idUser: undefined,
      currentHp: undefined,
      maxHp: undefined,
      description: '',
      skills: [],
      characteristics: [],
  })
  const {user} = useContext(UserContext)
  const {campaign, updateCampaign} = useContext(CampaignContext)
  const campaignIdUsed = campaign.uid || campaignIdUrl;
  const [playersOnThisCampaign, setPlayersOnThisCampaign] = useState();
  const [campaignRolls, setCampaignRolls] = useState();
  
  const contextValue = {
    character,
    updateCharacter: setCharacter
  }

  useEffect( () => {
    if(user.uid){
      if(!campaign.uid) {
        getCampaign();
      }
      else if(campaignIdUrl && user) {
        getCharactersVisibleForUser(campaign);
      }
      getCharacterForUser();
      getDiceForThisCampaign();
    }
  }, [user]);


  const getCharactersVisibleForUser = async (currentCampaign) => {
    try {
      const listCharacters = [];
      if (currentCampaign.idUserDm !== user.uid) {
        console.log('getCharactersVisibleForUser, 1');
        db.collection('characters').where('idUser', '==', user.uid).where('idCampaign', '==', campaignIdUsed).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              listCharacters.push(doc.data())
            });
            setCharacters(listCharacters);
          })
          .catch(err => {
            console.log(err.messsage)
          })
      } else {
        console.log('getCharactersVisibleForUser, 2');
        db.collection('characters').where('idCampaign', '==', campaignIdUsed).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              listCharacters.push(doc.data())
            });
            setCharacters(listCharacters);
          })
          .catch(err => {
            console.log(err.messsage)
          })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getDiceForThisCampaign = async () => {
    console.log('getDiceForThisCampaign');
    db.collection('dice').where('campaignId', '==', campaign.uid).get()
    .then(querySnapshot => {
      setCampaignRolls(querySnapshot.size || 0);
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const getCampaign = async () => {
    console.log('getCampaign');
    db.collection('campaigns').doc(campaignIdUsed).get()
      .then(doc => {
        updateCampaign(doc.data());
        getCharactersVisibleForUser(doc.data());
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const createCharacter = async (characterData) => {
    const characterUid = uid();
    const data = {
      name: characterData.name,
      uid: characterUid,
      idCampaign: campaignIdUsed,
      idUser: user.uid,
      currentHp: characterData.hp,
      maxHp: characterData.hp,
      description: characterData.description,
    };
    console.log('createCharacter');
    await db.collection('characters').doc(characterUid).set(data).then(res => {
      createCharacteristics(characterData.characteristics, characterUid)
      createSkills(characterData.skills, characterUid)
      getCharactersVisibleForUser(campaignIdUsed);

      toast.success(`${characterData.name} ${i18next.t('was created with success')}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(e => {
      console.log(e)
    });
  }

  const getCharacterForUser = async () => {
    const listUser = [];
    console.log('getCharacterForUser');
    db.collection('characters').where('idCampaign', '==', campaign.uid).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if(listUser.indexOf(doc.data().idUser) === -1) {
            listUser.push(doc.data().idUser);
          }
      });
      setPlayersOnThisCampaign(listUser.length || 0);
    })
    .catch(err => {
      console.log(err.message)
    })
  }
  
  const createCharacteristics = async (characteristics, characterUid) => {
    for(let i=0; i < characteristics.length; i+=1) {
      const uidChara = uid();
      const dataChara = {
        uid: uidChara,
        name: characteristics[i].label,
        value: characteristics[i].value,
        characterId: characterUid
      }
      console.log('createCharacteristics');
      await db.collection('characteristics').doc(uidChara).set(dataChara).then(res => {
      }).catch(e => {
        console.log(e)
      });
    }
  }

  const createSkills = async (skills, characterUid) => {
    for(let i=0; i < skills.length; i+=1) {
      const uidSkill = uid();
      const dataSkill = {
        uid: uidSkill,
        name: skills[i].label,
        value: skills[i].value,
        characterId: characterUid,
        isCustom: false,
      }
      console.log('createSkills');
      await db.collection('skills').doc(uidSkill).set(dataSkill).then(res => {
      }).catch(e => {
        console.log(e)
      });
    }
  }

  return (
    <div className='containerCharacters'>
      <CharacterContext.Provider value={contextValue}>
        <Switch>
          <Route path={`${match.url}/:characterIdUrl`}>
            <Character character={character}/>
          </Route>
          <Route path={match.path}>
            <div className="compactPage">
              <div className='listCharacters'>
                <h3>{i18next.t('campaign information')}</h3>
                <div>
                  <p>
                    {`${i18next.t('name')} : ${campaign.name}`}
                  </p>
                  <p>
                    {`${i18next.t('invitation code')} : ${campaign.invitationCode}`}
                  </p>
                  {campaign.createdAt && (
                    <p>
                      {`${i18next.t('created at')} : ${campaign.createdAt.toDate().toLocaleDateString()}`}
                    </p>
                  )}
                  <p>
                    {`${i18next.t('number of dice roll')} : ${campaignRolls || 0}`}
                  </p>
                  <p>
                    {`${i18next.t('number of user')} : ${playersOnThisCampaign || 0}`}
                  </p>
                  {user.uid === campaign.idUserDm && (
                    <p>
                      {i18next.t('character generation type')}
                      <select
                        value={campaign.characterGenerationClassic}
                        onChange={(e) => {
                          const campaignUpdate = {
                            ...campaign,
                            characterGenerationClassic: JSON.parse(e.target.value),
                          }
                          db.collection('campaigns').doc(campaign.uid).set(campaignUpdate).then(res => {
                            updateCampaign(campaignUpdate);
                          }).catch(e => {
                            console.log(e)
                          });
                        }}
                      >
                        <option value={true}>
                          {i18next.t('classique')}
                        </option>
                        <option value={false}>
                          {i18next.t('custom')}
                        </option>
                      </select>
                    </p>
                  )}
                </div>
                <h3>{i18next.t('my characters')}</h3>
                <ul className='list'>
                  {characters.map((character, i) => (
                    <li key={i}>
                      <Link
                        className='link'
                        key={character.uid}
                        onClick={() => {
                          setCharacter(character)
                        }}
                        to={`${match.url}/${character.uid}`}
                      >
                        {character.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <NewCharacterForm
                className='newCharacterForm'
                createCharacter={(character) => {createCharacter(character)}}
              />
            </div>
          </Route>
        </Switch>
      </CharacterContext.Provider>
    </div>
  );
}

export default Characters