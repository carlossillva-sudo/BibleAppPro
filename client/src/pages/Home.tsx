import { HOME_MOCK } from '../data/mock';

export const Home = () => {
  const stats = HOME_MOCK.stats.map((stat: { label: string; value: string }) => (
    <div key={stat.label}>
      <span>{stat.value}</span>
      <span>{stat.label}</span>
    </div>
  ));

  return (
    <div>
      <h1>{HOME_MOCK.greeting}</h1>
      <div>{stats}</div>
    </div>
  );
};

export default Home;
