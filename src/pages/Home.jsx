import { lives } from "../data/lives";
import LiveCard from "../components/LiveCard";

function Home() {
  return (
    <div className="lives-grid">
      {lives.map((live) => (
        <LiveCard key={live.id} live={live} />
      ))}
    </div>
  );
}

export default Home;