import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import './App.scss';

import bg0 from './img/bg-main0.jpg';
import bg1 from './img/bg-main1.jpg';
import bg2 from './img/bg-main2.jpg';
import bg3 from './img/bg-main3.jpg';
import bg4 from './img/bg-main4.jpg';
import bg5 from './img/bg-main5.jpg';
import bg6 from './img/bg-main6.jpg';
import bg7 from './img/bg-main7.jpg';

type StarWarsData = {
  name: string;
  gender: string;
  [key: string]: any;
  bgs: [];
};

const App: React.FC = () => {
  const [searchField, setSearchField] = useState("");
  const [data, setData] = useState<StarWarsData[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [genderCount, setGenderCount] = useState<{ [key: string]: number }>({});
  const [bg, setBg] = useState(0);

  const fetchData = async (name: string) => {
    setIsloading(true);
    try {
      const response = await axios.get(
        `https://swapi.dev/api/people/?search=${name}`
      );
      setData(response.data.results);
      setIsloading(false);
      if (error) {
        setError("");
      }
    } catch (e) {
      const errors = e as Error | AxiosError;

      setError(errors.message);

      setIsloading(false);
    }
  };

  useEffect(() => {
    const countGender = () => {
      const genderCounter: { [key: string]: number } = {};
      data.forEach((item) => {
        if (!genderCounter[item.gender]) {
          genderCounter[item.gender] = 1;
        } else {
          genderCounter[item.gender]++;
        }
      });
      setGenderCount(genderCounter);
    };
    countGender();

    
  }, [data]);

  const bgs = [bg0, bg1, bg2, bg3, bg4, bg5, bg6, bg7];

  useEffect (() => {
    setInterval(() => {
      setBg((bg) => (bg === 6 ? 0 : bg + 1));
    }, 10000);
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchData(searchField);
  };

  return (
    <div className="App StarWars" style={{backgroundImage: `url(${bgs[bg]})`}}>
      <header className="StarWars__header">
        <div className="StarWars__logo"></div>
      </header>
      <main className='StarWars__wrapper'>
        <form className='StarWars__form' onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className='StarWars__input' 
            placeholder="Search characters"
            value={searchField}
            onChange={handleSearchChange}
            required
          />
          <button
            type="submit"
            className='StarWars__btn'
            disabled={isLoading}
            // style={{
            //   backgroundColor: isLoading ? "yellow" : "blue",
            // }}
          >
            Search
          </button>
        </form>
        <div className="characters">
          <div className="characters__wrapper">
            <h2 className='characters__title'>Names characters</h2>
            <ul>
              {data.map((item, index) => (
                <li className='characters__descr' key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
          <div className="characters__wrapper">
            <h2 className='characters__title'>Gender Count</h2>
            <ul>
              {Object.entries(genderCount).map(([gender, count], index) => (
                <li className='characters__descr' key={index}>
                  {gender}: {count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
