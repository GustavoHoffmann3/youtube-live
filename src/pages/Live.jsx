
import { useParams } from "react-router-dom";
import { lives } from "../data/lives";

function Live() {
  const { id } = useParams();

  const live = lives.find((item) => item.id === Number(id));

  if (!live) {
    return <h1>Transmissão não encontrada!</h1>;
  }

  return (
    <div>
      <h1>{live.titulo}</h1>
      <h2>{live.canal}</h2>
      <p>{live.espectadores} espectadores assistindo</p>
    </div>
  );
}

export default Live;
