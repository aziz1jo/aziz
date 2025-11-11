// App.tsx

import React, { useState, useEffect } from 'react';
import LoaderScreen from './src/screens/LoaderScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import LevelsScreen from './src/screens/LevelsScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GameScreen from './src/screens/GameScreen';
import AudioManager from './src/utils/audio';
import I18n from './src/utils/i18n';
import Storage from './src/utils/storage';

type Screen = 'loader' | 'menu' | 'game' | 'levels' | 'howto' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loader');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await AudioManager.initialize();
    const lang = await Storage.getLanguage() as 'ar' | 'en';
    setLanguage(lang);
    I18n.setLanguage(lang);
  };

  const handleLanguageChange = async () => {
    const newLang = await Storage.getLanguage() as 'ar' | 'en';
    setLanguage(newLang);
    I18n.setLanguage(newLang);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loader':
        return <LoaderScreen onFinish={() => setCurrentScreen('menu')} />;
      
      case 'menu':
        return (
          <MainMenuScreen
            key={language} 
            onStartGame={() => {
              setSelectedLevel(1);
              setCurrentScreen('game');
            }}
            onShowLevels={() => setCurrentScreen('levels')}
            onShowHowToPlay={() => setCurrentScreen('howto')}
            onShowSettings={() => setCurrentScreen('settings')}
          />
        );
      
      case 'levels':
        return (
          <LevelsScreen
            key={language}
            onSelectLevel={(level) => {
              setSelectedLevel(level);
              setCurrentScreen('game');
            }}
            onBack={() => setCurrentScreen('menu')}
          />
        );
      
      case 'howto':
        return (
          <HowToPlayScreen 
            key={language}
            onBack={() => setCurrentScreen('menu')} 
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen('menu')}
            onLanguageChange={handleLanguageChange}
          />
        );
      
      case 'game':
        return (
          <GameScreen
            key={`${language}-${selectedLevel}`}
            initialLevel={selectedLevel}
            onExit={() => setCurrentScreen('menu')}
          />
        );
      
      default:
        return null;
    }
  };

  return renderScreen();
}