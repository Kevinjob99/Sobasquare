import React, { Component } from "react";
import styled from "styled-components";
import { render } from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ReactComponent as Close } from "../images/close.svg";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this);
  }

  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options
    );
    this.props.onMapLoad(map);
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://maps.google.com/maps/api/js?key=${
        process.env.REACT_APP_NOW_G_API_KEY
      }`;
      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      s.addEventListener("load", e => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  render() {
    return (
      <>
        <Ovarlay />
        <Link to="/">
          <h1 style={{ transform: `translateY(-80px)` }}>CLOSE</h1>
        </Link>
        <div
          style={{
            // backgroundColor: "transparent",
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "70%",
            opacity: "1",
            zIndex: "99"
          }}
          id={this.props.id}
        />
      </>
    );
  }
}

const Ovarlay = styled.div`
  position: absolute;
  opacity: 0.7;
  background-color: lightblue;
  width: 100%;
  height: 100%;
`;

const InfoWindow = props => {
  const id = props.id;
  const { en, jp } = props.name;
  const neighborhood = props.neighborhood;
  return (
    <InfoWindowWrap>
      <h2>{en}</h2>
      <h4>{jp}</h4>
      <div>{neighborhood}</div>
      <a href={`/sobaya/${id}`}>Learn More</a>
      {/* <Link to={`/`}>top</Link> */}
    </InfoWindowWrap>
  );
};

const InfoWindowWrap = styled.div`
  padding: 5px 10px;
`;

class GoogleMaps extends Component {
  render() {
    const { sobayasInfo } = this.props;
    return (
      <Map
        id="myMap"
        options={{
          center: { lat: 35.673569558713105, lng: 139.71011635849277 },
          zoom: 11.5
        }}
        onMapLoad={map => {
          const infoWindow = new window.google.maps.InfoWindow();
          sobayasInfo.coords.forEach((point, idx) => {
            var marker = new window.google.maps.Marker({
              position: point,
              map: map,
              title: "Sobaya's Info"
            });

            window.google.maps.event.addListener(marker, "click", function(e) {
              infoWindow.close(); // Close previously opened infowindow
              infoWindow.setContent(`<div id='infoWindow'></div>`);
              infoWindow.addListener("domready", e => {
                render(
                  <InfoWindow
                    id={sobayasInfo.id[idx]}
                    name={sobayasInfo.name[idx]}
                    neighborhood={sobayasInfo.neighborhood[idx]}
                  />,
                  document.getElementById("infoWindow")
                );
              });
              infoWindow.open(map, marker);
            });
          });
        }}
      />
    );
  }
}

const mapStateToProps = ({ sobayas }) => {
  return {
    sobayasInfo: {
      id: sobayas.map(s => s.id),
      name: sobayas.map(s => s.name),
      neighborhood: sobayas.map(s => s.neighborhood),
      coords: sobayas.map(s => s.coords)
    }
  };
};

export default connect(mapStateToProps)(GoogleMaps);
