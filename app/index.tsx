import { Redirect } from 'expo-router';

/**
 * Ponto de entrada raiz.
 * Sempre redireciona para o splash — garante a experiência completa
 * mesmo quando o app é aberto via QR code ou cold start.
 */
export default function Index() {
  return <Redirect href="/splash" />;
}
