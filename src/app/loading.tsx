import Container from "./components/Container";
import Loader from "./components/Loader";

const LoadingState = () => {
  return (
    <Container>
      <div className="h-[60vh] flex flex-col justify-center items-center">
        <Loader />
      </div>
    </Container>
  );
};

export default LoadingState;