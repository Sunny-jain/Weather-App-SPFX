import * as React from "react";
import styles from "./WeatherInfo.module.scss";
import type { IWeatherInfoProps } from "./IWeatherInfoProps";
import { Card } from "@fluentui/react-components";
import { Image, Text, Stack } from "@fluentui/react";
import { escape } from "@microsoft/sp-lodash-subset";

export interface ApiData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ApiError {
  cod: number;
  message: string;
}

const WeatherInfo = ({
  apiKey,
  location,
  unit,
  isDarkTheme,
  environmentMessage,
  hasTeamsContext,
  userDisplayName,
}: IWeatherInfoProps) => {
  const [localTime, setLocalTime] = React.useState<number | null>(null);
  const [data, setData] = React.useState<ApiData | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  // Fetch city time using OpenWeather API
  React.useEffect(() => {
    if (apiKey && location) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
      )
        .then((res) => res.json())
        .then((responseData) => {
          console.log(responseData);

          if (responseData.cod !== 200) {
            // If API returns an error code, handle it as an error
            setError(new Error(responseData.message));
            setData(null); // Ensure data is null on error
            return;
          }

          // ensure data is stored and error is null

          setData(responseData);
          setError(null);
          if (responseData.timezone) {
            const utcTime = Math.floor(Date.now() / 1000);
            const cityTime = utcTime + responseData.timezone;
            setLocalTime(new Date(cityTime * 1000).getHours());
          }
        })
        .catch((err) => {
          setError(err);
          setData(null); // Ensure data is null on error
          console.error("Error fetching data:", err);
        });
    }
  }, [apiKey, location]);

  // Function to determine card background based on city time
  const getCardBackground = () => {
    if (localTime === null)
      return "linear-gradient(135deg, #d3d3d3 0%, #a1a1a1 100%)"; // Default (gray)
    if (localTime >= 6 && localTime < 12)
      return "linear-gradient(135deg, #AEDFF7 0%, #87CEFA 100%)"; // Morning
    if (localTime >= 12 && localTime < 18)
      return "linear-gradient(135deg, #FFE259 0%, #FFA751 100%)"; // Afternoon
    if (localTime >= 18 && localTime < 20)
      return "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)"; // Evening
    return "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)"; // Night
  };

  //icon url for weather icons
  const iconUrl = `https://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`;

  return (
    <div className={styles.weatherInfo}>
      {error !== null ? (
        // display is encountered any error
        <div className={styles.welcome}>
          <h2>Hi, {escape(userDisplayName)}!</h2>
          <p>{environmentMessage}</p>
          <p>{error.message}</p>
        </div>
      ) : data === null ? (
        // displayed for user to add details
        <div className={styles.welcome}>
          <h2>Hi, {escape(userDisplayName)}!</h2>
          <p>{environmentMessage}</p>
          <p>Please Enter Your Details In Configuration Pane.</p>
        </div>
      ) : (
        // adding the weather info card to the SPFX webpart
        <div className={styles.welcome}>
          <h2>Hi, {escape(userDisplayName)}!</h2>
          <p>Here are the weather details for {data.name}:</p>

          {/* initializing the card */}
          <Card
            style={{
              width: "100%",
              maxWidth: "450px",
              textAlign: "center",
              background: getCardBackground(), // Dynamic background
              borderRadius: "15px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              padding: "30px",
              margin: "0 auto",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.3)",
              transition: "background 0.5s ease-in-out",
            }}
          >
            {/* text for city name */}
            <Text variant="xxLarge" block style={{ fontWeight: "bold" }}>
              📍 {data.name}
            </Text>

            {/* text for temprature */}
            <Text
              variant="superLarge"
              block
              style={{ fontWeight: "bold", fontSize: "48px" }}
            >
              🌡️{" "}
              {unit !== "c"
                ? (((data.main.temp - 273.15) * 9) / 5 + 32)
                    .toString()
                    .substring(0, 5) // Convert to Fahrenheit and format
                : (data.main.temp - 273.15).toString().substring(0, 5)}
              °{unit !== "c" ? "F" : "C"}
            </Text>

            {/* Stack for weather description */}
            <Stack
              horizontal
              tokens={{ childrenGap: 10 }}
              horizontalAlign="center"
              verticalAlign="center"
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
              }} // Ensure alignment
            >
              <Image
                src={iconUrl}
                width={40}
                height={40}
                alt={"Weather Icon"}
              />

              <Text
                variant="large"
                block
                style={{
                  fontSize: "20px",
                  opacity: "0.9",
                  textTransform: "capitalize",
                }}
              >
                {data?.weather[0]?.description}
              </Text>
            </Stack>

            {/* Stack for humidity and wind speed */}

            <Stack
              horizontal
              tokens={{ childrenGap: 40 }}
              horizontalAlign="center"
              style={{ marginTop: "15px" }}
            >
              <Stack horizontalAlign="center">
                <Text variant="mediumPlus" style={{ fontSize: "24px" }}>
                  💧 {data?.main?.humidity}%
                </Text>
                <Text variant="small" style={{ opacity: "0.8" }}>
                  Humidity
                </Text>
              </Stack>
              <Stack horizontalAlign="center">
                <Text variant="mediumPlus" style={{ fontSize: "24px" }}>
                  💨 {data?.wind?.speed} km/h
                </Text>
                <Text variant="small" style={{ opacity: "0.8" }}>
                  Wind Speed
                </Text>
              </Stack>
            </Stack>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
