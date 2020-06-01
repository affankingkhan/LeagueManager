import React,{ Component, useState, useEffect }  from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";


let doctors = [{ uid:3, lat: 49.253818, lng: -122.899193 }];

const PlayersMap = withScriptjs(withGoogleMap((props) =>{
    const {playerMapAddress} = props;

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    useEffect(() => {
        const listener = e => {
          if (e.key === "Escape") {
            setSelectedPlayer(null);
          }
        };
        window.addEventListener("keydown", listener);
    
        return () => {
          window.removeEventListener("keydown", listener);
        };
      }, []);

  return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={ { lat: 49.253818, lng: -122.899193 } }
        >
        {playerMapAddress.map(address => (
          <Marker
            key={address.address}
            position={{
                lat: address.latitude,
                lng: address.longitude
            }}
            onClick={() => {
                setSelectedPlayer(address);
            }}

          />
        ))}


        {selectedPlayer && (
          <InfoWindow
            onCloseClick={() => {
                setSelectedPlayer(null);
            }}
            position={{
              lat: selectedPlayer.latitude,
              lng: selectedPlayer.longitude
            }}
          >
            <div>
              <h4>{selectedPlayer.userId.firstName} {selectedPlayer.userId.lastName}</h4>
              <p>{selectedPlayer.userId.email}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  }
))

export default PlayersMap;