import React from 'react';
import { ChirmoVirtualTutorStudio } from './ChirmoVirtualTutorStudio';
import { CEFRLevel } from '../../types';

export interface SimpleSearchHomeProps {
  onSearch?: (queryOrUrl: string) => void;
  onNavigateToLearn?: () => void;
  onNavigateToKids?: () => void;
  onNavigateToGames?: () => void;
  onNavigateToSpeak?: () => void;
  onNavigateToTasks?: () => void;
  onOpenInstallModal?: () => void;
  userLevel?: CEFRLevel;
  pendingTaskCount?: number;
}

/**
 * SimpleSearchHome
 * Projenin ana merkezinde artık geleneksel arama motoru yerine
 * Chirmo Sanal Yapay Zekâ Dil Öğretmeni Stüdyosu yer almaktadır.
 */
export const SimpleSearchHome: React.FC<SimpleSearchHomeProps> = (props) => {
  return <ChirmoVirtualTutorStudio {...props} />;
};

export default SimpleSearchHome;
