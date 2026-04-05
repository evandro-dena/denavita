import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';

const SECTIONS = [
  {
    title: '1. Informações Coletadas',
    body: 'O DenaVita coleta as seguintes informações para oferecer uma experiência personalizada: dados de identificação (nome, e-mail), dados antropométricos (peso, altura, composição corporal), informações de saúde fornecidas pelo nutricionista responsável e dados de uso do aplicativo.',
  },
  {
    title: '2. Como Utilizamos Suas Informações',
    body: 'Utilizamos seus dados para: personalizar seu plano nutricional, acompanhar sua evolução, melhorar a experiência do aplicativo, enviar notificações relevantes sobre seu plano e garantir a segurança da sua conta.',
  },
  {
    title: '3. Compartilhamento de Dados',
    body: 'Seus dados pessoais e de saúde são compartilhados exclusivamente com o nutricionista responsável pelo seu acompanhamento. Não vendemos, alugamos ou compartilhamos suas informações com terceiros para fins comerciais.',
  },
  {
    title: '4. Armazenamento e Segurança',
    body: 'Todas as informações são armazenadas em servidores com criptografia de ponta a ponta (TLS 1.3). Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.',
  },
  {
    title: '5. Retenção de Dados',
    body: 'Mantemos seus dados enquanto sua conta estiver ativa ou pelo período necessário para cumprir obrigações legais. Após o encerramento da conta, seus dados serão anonimizados ou excluídos em até 90 dias.',
  },
  {
    title: '6. Seus Direitos (LGPD)',
    body: 'Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a: acessar seus dados, corrigir informações incorretas, solicitar a exclusão de seus dados, revogar o consentimento e obter portabilidade das informações.',
  },
  {
    title: '7. Cookies e Rastreamento',
    body: 'O aplicativo utiliza tecnologias de análise de uso (analytics) para compreender como os usuários interagem com as funcionalidades, sempre de forma agregada e anonimizada. Não utilizamos cookies de rastreamento para fins publicitários.',
  },
  {
    title: '8. Alterações nesta Política',
    body: 'Podemos atualizar esta Política de Privacidade periodicamente. Informaremos sobre alterações significativas por meio de notificação no aplicativo. O uso contínuo após a notificação constitui aceitação da política revisada.',
  },
  {
    title: '9. Contato do DPO',
    body: 'Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, entre em contato com nosso Encarregado de Dados: privacidade@denavita.com.br',
  },
];

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color={Colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.lastUpdated}>Última atualização: 01 de abril de 2026</Text>

        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  lastUpdated: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  section: { gap: 6 },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  sectionBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
