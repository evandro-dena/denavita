import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';

const SECTIONS = [
  {
    title: '1. Aceitação dos Termos',
    body: 'Ao utilizar o aplicativo DenaVita, você concorda com os presentes Termos de Uso. Caso não concorde com qualquer disposição aqui prevista, pedimos que não utilize o aplicativo.',
  },
  {
    title: '2. Descrição do Serviço',
    body: 'O DenaVita é um aplicativo de acompanhamento nutricional destinado a pacientes de nutricionistas cadastrados na plataforma. O conteúdo nutricional fornecido é elaborado por profissionais habilitados e personalizado para cada usuário.',
  },
  {
    title: '3. Cadastro e Acesso',
    body: 'O acesso ao aplicativo é concedido exclusivamente por meio de credenciais fornecidas pelo seu nutricionista responsável. Você é responsável pela confidencialidade de seus dados de acesso e por todas as atividades realizadas com sua conta.',
  },
  {
    title: '4. Uso Adequado',
    body: 'O aplicativo deve ser utilizado apenas para fins pessoais e não comerciais. É proibido compartilhar, reproduzir ou distribuir qualquer conteúdo do aplicativo sem autorização prévia e expressa da DenaVita.',
  },
  {
    title: '5. Isenção de Responsabilidade Médica',
    body: 'O conteúdo do aplicativo tem caráter informativo e nutricional, não substituindo consultas médicas ou diagnósticos clínicos. A DenaVita não se responsabiliza por decisões tomadas exclusivamente com base nas informações do aplicativo sem orientação profissional.',
  },
  {
    title: '6. Propriedade Intelectual',
    body: 'Todo o conteúdo disponível no DenaVita — incluindo textos, imagens, logotipos, ícones e receitas — é de propriedade da DenaVita ou de seus respectivos titulares e está protegido pelas leis de propriedade intelectual.',
  },
  {
    title: '7. Alterações nos Termos',
    body: 'A DenaVita reserva-se o direito de modificar estes Termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no aplicativo. O uso contínuo após a publicação das alterações constitui aceitação dos novos termos.',
  },
  {
    title: '8. Contato',
    body: 'Em caso de dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: suporte@denavita.com.br',
  },
];

export default function TermsScreen() {
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
        <Text style={styles.headerTitle}>Termos de Uso</Text>
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
