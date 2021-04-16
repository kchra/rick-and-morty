import { SettingsInterface } from "@types";

const SETTINGS: SettingsInterface = {
  favoritesStoreName: "favoriteCharacters",
  tabs: {
    all: {
      name: "All characters",
      key: "all",
      default: true,
    },
    favorites: {
      name: "Favorites",
      key: "favorites",
      default: false,
    },
    search: {
      name: "Search result for: ",
      key: "search",
      default: false,
    },
  },
  searchBy: {
    episode: "episode",
    id: "id",
    name: "name",
  },
  dropdownOptions: [
    { name: "Name", value: "name" },
    { name: "Identifier", value: "id" },
    { name: "Episode", value: "episode" },
  ],
};

export default SETTINGS;
