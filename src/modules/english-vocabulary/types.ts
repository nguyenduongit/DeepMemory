export type VocabularyTopicId =
  | 'actions'
  | 'people'
  | 'home'
  | 'food'
  | 'nature'
  | 'places'
  | 'time'
  | 'descriptions'
  | 'common-verbs'
  | 'communication';

export type VocabularyPartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun';

export interface EnglishVocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: VocabularyPartOfSpeech;
  vietnameseMeaning: string;
  example: string;
  exampleTranslation: string;
  topicId: VocabularyTopicId;
  level: 'A1';
  imagePath: string;
  imageUrl?: string;
  sortOrder: number;
}
