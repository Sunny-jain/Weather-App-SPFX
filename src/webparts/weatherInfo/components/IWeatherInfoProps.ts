//props for the weatherInfo

export interface IWeatherInfoProps {
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  apiKey: string;
  location: string;
  unit: string;
}
