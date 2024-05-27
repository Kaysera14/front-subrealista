export function Main({ children }) {
  return (
    <main className={`flex flex-col flex-grow items-center justify-center`}>
      {children}
    </main>
  );
}
