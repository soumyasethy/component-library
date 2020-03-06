import React, { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { StyleSheet, View, Text, Platform } from "react-native";
import PropTypes from "prop-types";
import { mS, screenHeight, screenWidth } from "../../widgets/ResponsiveScreen";
import { ButtonCard } from "./ButtonCard";
import { shadow } from "../../utils/Shadow";
import { COLORS } from "../index";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid } from "react-native";
import { AnswereStatusCard } from "./AnswereStatusCard";

const ASPECT_RATIO = screenWidth / screenHeight;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0075776;
const LONGITUDE_DELTA = 0.0092744; // LATITUDE_DELTA * ASPECT_RATIO * 0.00522;
const SPACE = 0.01;

const SAMPLE_REGION = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
};

export const MapCard = props => {
  const [currentLocation, setLocation] = useState({});
  const mapView = React.createRef();

  useEffect(() => {
    if (props && !props?.selected) {
      requestGPSPermission(setLocation);
      return;
    }
    let latitude = 0.0;
    longitude = 0.0;
    accuracy = 0;
    props.selected.map(item => {
      if (!item.value) return;
      if (item.text === "latitude") {
        latitude = Number(parseFloat(item.value).toFixed(6));
      }
      if (item.text === "longitude") {
        longitude = Number(parseFloat(item.value).toFixed(6));
      }
      if (item.text === "accuracy") {
        accuracy = Number(parseFloat(item.value).toFixed(6));
      }
    });
    console.warn("Selected Location->", latitude, longitude, accuracy);
    if (latitude && longitude && accuracy) {
      setLocation({ coords: { latitude, longitude, accuracy } });
      // mapView.animateToRegion(
      //   { latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA },
      //   1000
      // );
    }
  }, []);

  useEffect(() => {
    if (!currentLocation?.coords) return;
    let { latitude, longitude, accuracy } =
      !!currentLocation.coords && currentLocation.coords;
    if (latitude && longitude && accuracy) {
      let locationAnswer = [
        { text: "latitude", value: latitude.toFixed(6) },
        { text: "longitude", value: longitude.toFixed(6) },
        { text: "accuracy", value: accuracy }
      ];
      props.onSelect(locationAnswer);
      // mapView.animateToRegion(
      //   { latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA },
      //   1000
      // );
    }
  }, [currentLocation]);

  let { latitude, longitude, accuracy } =
    !!currentLocation.coords && currentLocation.coords;

  const getMapRegion = {
    latitude: latitude || SAMPLE_REGION.latitude,
    longitude: longitude || SAMPLE_REGION.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  };
  return (
    <>
      <AnswereStatusCard
        selected={["current_location"]}
        options={["current_location"]}
        selectLimit={1}
      />
      <View
        style={[
          {
            backgroundColor: COLORS.white,
            padding: mS(16),
            borderRadius: mS(5),
            borderColor: COLORS.blue,
            marginTop: mS(16),
            width: "100%"
            // ...shadow
          }
        ]}
      >
        <MapView
          // provider={PROVIDER_GOOGLE}
          ref={mapView}
          // liteMode
          key={`map_`}
          style={styles.map}
          // customMapStyle={customStyle}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          // onRegionChange={onRegionChange}
          initialRegion={{
            latitude: latitude || SAMPLE_REGION.latitude,
            longitude: longitude || SAMPLE_REGION.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          region={getMapRegion}
        >
          <Marker
            coordinate={{
              latitude: latitude || 0.0 - SPACE,
              longitude: longitude || 0.0 - SPACE
            }}
            // centerOffset={{ x: -42, y: -60 }}
            anchor={{ x: 0.84, y: 1 }}
          >
            <View
              style={{
                backgroundColor: COLORS.blue,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: COLORS.white, fontWeight: "700" }}>
                You are here
              </Text>
            </View>
          </Marker>
        </MapView>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: mS(16),
            marginBottom: mS(16),
            width: screenWidth - mS(16 * 4)
          }}
        >
          <SmallCardWithTitleSubTitle
            title={"Latitude"}
            subTitle={!!latitude && latitude.toFixed(4)}
          />
          <SmallCardWithTitleSubTitle
            title={"Longitude"}
            subTitle={!!longitude && longitude.toFixed(4)}
          />
          <SmallCardWithTitleSubTitle
            title={"Accuracy"}
            subTitle={`${!!accuracy && accuracy} m`}
          />
        </View>
        <SmallCardWithTitleSubTitle
          title={"Area"}
          subTitle={"Bellandure, Bangalore, Karnataka, India"}
        />
        <ButtonCard
          style={{ justifyContent: "center", alignItems: "center" }}
          item={{
            text:
              props.selected && props.selected.length >= 0
                ? "Update Location"
                : "Tag Location"
          }}
          addToSelected={async () => {
            console.warn("clicked");
            await requestGPSPermission(setLocation);
            // console.warn("position->", position);
          }}
          isSelected={false}
        />
      </View>
    </>
  );
};

MapCard.propTypes = {};

const styles = StyleSheet.create({
  map: {
    height: screenWidth * 0.7
  }
});
const SmallCardWithTitleSubTitle = props => {
  return (
    <View>
      <Text style={{ color: COLORS.grey777 }}>{props.title}</Text>
      <Text>{props.subTitle}</Text>
    </View>
  );
};
const getLocation = callBack => {
  console.warn("Getting Location");
  Geolocation.getCurrentPosition(
    position => {
      console.warn("Location->", position);
      callBack(position);
    },
    error => {
      // See error code charts below.
      console.warn(error.code, error.message);
      return error.message;
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};

const requestGPSPermission = async callBack => {
  if (Platform.OS === "ios") {
    return getLocation(callBack);
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "GPS Permission",
        message: "We needs access to your gps.So you can use gps.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === (await PermissionsAndroid.RESULTS.GRANTED)) {
      console.warn("You can use the GPS");
      getLocation(callBack);
    } else {
      console.warn("GPS permission denied");
      return { error: "GPS permission denied" };
    }
  } catch (err) {
    console.warn(err);
    return err;
  }
};

const customStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e"
      }
    ]
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855"
      }
    ]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e"
      }
    ]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c"
      }
    ]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948"
      }
    ]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c"
      }
    ]
  }
];
