import Board from '@/components/boards/Board';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="p-3 md:p-5">
      <Header />

      <Board />
    </main>
  );
}
