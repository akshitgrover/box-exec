export default function (): void {
  if (process.env.PORT === undefined) {
    process.env.PORT = '3004';
  }
}
