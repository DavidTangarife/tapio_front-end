import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export default () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={350}
    />
  )
}