interface CharactersInterface {
  id: string;
  name: string;
  species: string;
  gender: string;
  image: string;
  episode: [];
}

interface SettingsTabsInterface {
  name: string;
  key: string;
  default: boolean;
}

interface SettingsTabsItemsInterface {
  all: SettingsTabsInterface;
  favorites: SettingsTabsInterface;
}

interface SettingsSearchByInterface {
  id: string;
  episode: string;
  name: string;
}

interface SettingsDropdownOptionsInterface {
  [index: number]: { name: string; value: string };
}

interface SettingsInterface {
  favoritesStoreName: string;
  tabs: SettingsTabsItemsInterface;
  searchBy: SettingsSearchByInterface;
  dropdownOptions: SettingsDropdownOptionsInterface;
}

interface SearchByNameInterface {
  page?: number | string;
  name?: string;
}

interface SearchByIDsInterface {
  ids?: string;
}

interface searchByEpisodeInterface {
  episode?: string;
  name?: string;
}

interface ResultsInterface {
  query: Record<string, unknown>;
  characters: Record<string, unknown>;
  pagesTotal: number;
  pagesInfo?: Record<string, unknown>;
}

export {
  CharactersInterface,
  SettingsInterface,
  SearchByNameInterface,
  SearchByIDsInterface,
  searchByEpisodeInterface,
  ResultsInterface,
};
