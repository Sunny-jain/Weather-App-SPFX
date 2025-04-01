# SPFx Weather Info Web Part

## Overview
The **SPFx Weather Info Web Part** is a SharePoint Framework (SPFx) solution that fetches real-time weather details for a given location using the OpenWeather API. The UI dynamically adjusts based on the time of day, providing an enhanced user experience.

## Features
- Fetches weather data from OpenWeather API
- Displays temperature, humidity, wind speed, and weather conditions
- Changes card background based on the time of day
- Responsive and visually appealing design
- Configurable API key and location

## Prerequisites
Before running the project, ensure you have the following installed:
- Node.js (LTS recommended)
- Yeoman and SPFx generator
- SharePoint Online or a development environment

## Installation
Follow these steps to set up and run the project:

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd spfx-weather-info
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Update the configuration:**
   - Open `src/webparts/weatherInfo/components/IWeatherInfoProps.ts` and update the API key and default location if needed.
   - Alternatively, configure these values in the property pane in SharePoint.

4. **Run the development server:**
   ```sh
   gulp serve
   ```

   This will open the local workbench where you can test the web part.

## Deployment
To deploy the web part to SharePoint:

1. **Bundle the project:**
   ```sh
   gulp bundle --ship
   ```

2. **Package the solution:**
   ```sh
   gulp package-solution --ship
   ```

3. **Upload the `.sppkg` file** from the `sharepoint/solution` folder to the SharePoint App Catalog.

4. **Add the web part** to a SharePoint page via the modern web part editor.

## Troubleshooting
- **API key issues:** Ensure your OpenWeather API key is valid and has the necessary permissions.
- **Weather data not loading:** Check console logs and verify network requests to OpenWeather API.
- **SPFx build errors:** Try running `npm install` and `gulp clean` before restarting the server.

## License
This project is open-source and available for customization as per your requirements.

