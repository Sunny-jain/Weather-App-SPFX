import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "WeatherInfoWebPartStrings";
import WeatherInfo from "./components/WeatherInfo";
import { IWeatherInfoProps } from "./components/IWeatherInfoProps";

export interface IWeatherInfoWebPartProps {
  apiKey: string;
  location: string;
  unit: string;
}

export default class WeatherInfoWebPart extends BaseClientSideWebPart<IWeatherInfoWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";



  public render(): void {

    // calling out the weather info component for the webpart

    const element: React.ReactElement<IWeatherInfoProps> = React.createElement(
      WeatherInfo,
      {
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        apiKey: this.properties.apiKey,
        location: this.properties.location,
        unit: this.properties.unit,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
            case "TeamsModern":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  // Details for configuration Pane

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "User Details" },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("apiKey", {
                  label: "API Key",
                  description: "Enter your weather API key here",
                }),
                PropertyPaneTextField("location", {
                  label: "Location (City or ZIP)",
                  description: "Enter city name or ZIP code",
                }),
                PropertyPaneDropdown("unit", {
                  label: "Temperature Unit",
                  selectedKey: this.properties.unit,
                  options: [
                    { key: "c", text: "Celsius" },
                    { key: "f", text: "Fahrenheit" },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
