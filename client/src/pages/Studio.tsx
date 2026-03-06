import { STUDIO_MOCK } from '../data/mock';

export const Studio = () => {
  return (
    <div>
      <h1>{STUDIO_MOCK.title}</h1>
      <div>
        {STUDIO_MOCK.features.map((item: { title: string; description: string }) => (
          <div key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studio;
