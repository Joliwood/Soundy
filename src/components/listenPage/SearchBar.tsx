import React, { useState, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../svg';
import { FilterRadio } from '../customElements';
import { ChosenDisplay } from '../../types';
import { ListenPageAlbumsQuery, SearchAlbumsQuery, SearchSongsQuery } from '../../requests/queries';
import {
  type ListenPageAlbumsQueryQuery,
  type ListenPageSongsQueryQuery,
  ReleaseYear,
  DurationRange,
} from '../../types/__generated_schemas__/graphql';

interface Props {
  chosenDisplay: 'songs' | 'albums';
  setChosenDisplay: React.Dispatch<React.SetStateAction<ChosenDisplay>>;
  setAlbums: React.Dispatch<React.SetStateAction<ListenPageAlbumsQueryQuery['albums']>>;
  setSongs: React.Dispatch<React.SetStateAction<ListenPageSongsQueryQuery['songs']>>;
  setYearFilter: React.Dispatch<React.SetStateAction<ReleaseYear | undefined>>;
  setDurationFilter: React.Dispatch<React.SetStateAction<DurationRange | undefined>>;
  yearFilter?: ReleaseYear;
  durationFilter?: DurationRange;
  resetFilters: () => void;
}

function SearchBar({
  chosenDisplay,
  setChosenDisplay,
  setAlbums,
  setSongs,
  setDurationFilter,
  setYearFilter,
  yearFilter,
  durationFilter,
  resetFilters,
}: Props): JSX.Element {
  const { t } = useTranslation('common');
  const [nameFilter, setNameFilter] = useState<string>('');

  const [getAlbums] = useLazyQuery(ListenPageAlbumsQuery, {
    variables: { limit: 15 },
    onCompleted: (data) => {
      if (data.albums) {
        setAlbums(data.albums);
        setChosenDisplay('albums');
      }
    },
  });

  const [getFilteredAlbums] = useLazyQuery(SearchAlbumsQuery, {
    onCompleted: (data) => {
      if (data.albums) {
        setAlbums(data.albums);
        setChosenDisplay('albums');
      }
    },
  });

  const [getFilteredSongs] = useLazyQuery(SearchSongsQuery, {
    onCompleted: (data) => {
      if (data.songs) {
        setSongs(data.songs);
        setChosenDisplay('songs');
      }
    },
  });

  const handleSearch = () => {
    if (chosenDisplay === 'albums') {
      getFilteredAlbums({
        variables: {
          limit: 15,
          filter: { name: nameFilter, release_year: yearFilter },
        },
      });
    }
    if (chosenDisplay === 'songs') {
      getFilteredSongs({
        variables: {
          limit: 30,
          filter: { name: nameFilter, duration_filter: durationFilter },
        },
      });
    }
  };

  // Function to change the display between songs and albums and reload the data without filters
  const handleDisplayChanges = (display: ChosenDisplay) => {
    resetFilters();
    setChosenDisplay(display);
    setNameFilter('');
    if (display === 'albums') {
      getAlbums({ variables: { limit: 15 } });
    }
    if (display === 'songs') {
      getFilteredSongs({ variables: { limit: 30 } });
    }
  };

  const songDuration = useMemo(() => {
    if (chosenDisplay === 'albums') {
      return (
        <div className="flex flex-col gap-4">
          <div className="font-semibold text-sm pl-3 min-[540px]:text-base">{t('SEARCH_BAR_FILTER_RELEASE_TEXT')}</div>
          <div className="flex gap-4 flex-wrap justify-center">
            <FilterRadio inputId="release-album-all" labelText={t('SEARCH_RADIO_INPUT_TEXT')} setFilter={setYearFilter} yearFilter={yearFilter} />
            <FilterRadio inputId="release-album-min" labelText="70's" value={ReleaseYear.Year_70} setFilter={setYearFilter} yearFilter={yearFilter} />
            <FilterRadio inputId="release-album-mid" labelText="80's" value={ReleaseYear.Year_80} setFilter={setYearFilter} yearFilter={yearFilter} />
            <FilterRadio inputId="release-album-max" labelText="90's" value={ReleaseYear.Year_90} setFilter={setYearFilter} yearFilter={yearFilter} />
            <FilterRadio inputId="release-album-mid" labelText="2000's" value={ReleaseYear.Year_2000} setFilter={setYearFilter} yearFilter={yearFilter} />
            <FilterRadio inputId="release-album-max" labelText="2010's" value={ReleaseYear.Year_2010} setFilter={setYearFilter} yearFilter={yearFilter} />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-sm pl-3 min-[540px]:text-base">{t('SEARCH_BAR_FILTER_DURATION_TEXT')}</div>
        <div className="flex gap-4 flex-wrap justify-center">
          <FilterRadio inputId="duration-song-all" labelText={t('SEARCH_RADIO_INPUT_TEXT')} setFilter={setDurationFilter} durationFilter={durationFilter} />
          <FilterRadio inputId="duration-song-min" labelText="- 1mn" value={DurationRange.OneMinute} setFilter={setDurationFilter} durationFilter={durationFilter} />
          <FilterRadio inputId="duration-song-mid" labelText="1 - 3 mn" value={DurationRange.OneToThreeMinutes} setFilter={setDurationFilter} durationFilter={durationFilter} />
          <FilterRadio inputId="duration-song-mid" labelText="3 - 5 mn" value={DurationRange.ThreeToFiveMinutes} setFilter={setDurationFilter} durationFilter={durationFilter} />
          <FilterRadio inputId="duration-song-max" labelText="+ 5 mn" value={DurationRange.MoreThanFiveMinutes} setFilter={setDurationFilter} durationFilter={durationFilter} />
        </div>
      </div>
    );
  }, [chosenDisplay, t, setDurationFilter, durationFilter, setYearFilter, yearFilter]);

  return (
    <div className="min-[540px]:w-1/2 pt-32 text-center">
      <div className="flex flex-col items-center gap-4 pb-8">
        <div className="w-16 h-16 min-[540px]:w-20 min-[540px]:h-20 rounded-full flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl min-[540px]:text-4xl font-bold">{t('MENU_APP_NAME')}</h1>
        <p className="text-md font-semibold min-[540px]:text-lg">{t('SEARCH_BAR_TEXT')}</p>
      </div>
      <div className="flex flex-col items-center">

        {/* Search input => Filter on the request */}
        <div className="join w-full px-2">
          <input
            className="w-full input input-md input-bordered join-item bg-base-200"
            placeholder={t('SEARCH_BAR_PLACEHOLDER')}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-md join-item border border-stone-700"
            onClick={handleSearch}
          >
            {t('SEARCH_BAR_BTN')}
          </button>
        </div>

        {/* Duration input => Filter on the request */}
        <div className="flex flex-col gap-4 pt-6 items-start min-[860px]:flex-row min-[860px]:items-center">
          {/* Radio Input Components changing on isAlbum value change */}
          {songDuration}
        </div>

        {/* Song or Album filter => Filter on the front */}
        <div>
          <button
            type="button"
            onClick={() => handleDisplayChanges('songs')}
            className={`btn btn-sm mx-4 py-3 min-[540px]:btn-md ${chosenDisplay === 'songs' ? 'border-primary my-5 border-2' : 'border-stone-700 my-6 border'}`}
          >
            {t('SEARCH_BAR_FILTER_SONG')}
          </button>
          <button
            type="button"
            onClick={() => handleDisplayChanges('albums')}
            className={`btn btn-sm mx-4 py-3 min-[540px]:btn-md ${chosenDisplay === 'albums' ? 'border-primary my-5 border-2' : 'border-stone-700 my-6 border'}`}
          >
            {t('SEARCH_BAR_FILTER_ALBUM')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
