import 'dotenv/config';

export default (): { port: number } => ({
  port: parseInt(process.env.PORT ?? '3000'),
});
