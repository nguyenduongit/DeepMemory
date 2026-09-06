export type ContentType = 'text' | 'image';

export interface TextContent {
  type: 'text';
  value: string;
}

export interface ImageContent {
  type: 'image';
  src: string;
  alt?: string;
}

export type QuestionContent = TextContent | ImageContent;
export type AnswerContent = TextContent | ImageContent;
