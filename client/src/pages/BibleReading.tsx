import { BIBLE_READING_MOCK } from '../data/mock';

interface Verse {
  number: string;
  text: string;
}

interface BibleReadingProps {
  // Add your props here
}

export const BibleReading = ({}: BibleReadingProps) => {
  const verses = BIBLE_READING_MOCK.verses.map((item: Verse) => (
    <span key={item.number}>
      <sup>{item.number}</sup> {item.text}
    </span>
  ));

  return <div>{verses}</div>;
};

export default BibleReading;
