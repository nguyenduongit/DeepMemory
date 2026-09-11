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
  | 'communication'
  | 'body'
  | 'clothes'
  | 'transport'
  | 'work-study'
  | 'shopping'
  | 'health'
  | 'weather'
  | 'feelings'
  | 'technology'
  | 'daily-objects';

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
  level: 'A1' | 'A2';
  imagePath: string;
  imageUrl?: string;
  sortOrder: number;
}
