/**
 * SimulatorShell — envuelve cada simulador con:
 * - Barra superior con nombre, "Salir" y módulo
 * - Banner amarillo "SIMULADOR – Datos no reales"
 * - SafeArea correcta
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface Props {
  title: string;
  module: string;
  accentColor?: string;
  children: React.ReactNode;
}

export function SimulatorShell({ title, module: mod, accentColor = colors.primary, children }: Props) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* Barra superior */}
      <View style={[styles.topBar, { backgroundColor: accentColor }]}>
        <Pressable onPress={() => router.back()} style={styles.exitBtn}>
          <Text style={styles.exitText}>Salir</Text>
        </Pressable>
        <View style={styles.topCenter}>
          <Text style={styles.topTitle}>{title}</Text>
          <Text style={styles.topModule}>Módulo: {mod}</Text>
        </View>
        <View style={styles.exitBtn} />
      </View>

      {/* Banner de seguridad */}
      <View style={styles.safeBanner}>
        <Text style={styles.safeText}>SIMULADOR — Datos no reales</Text>
      </View>

      {/* Contenido del simulador */}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  exitBtn: {
    width: 56,
    alignItems: 'center',
  },
  exitText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.white,
  },
  topCenter: { flex: 1, alignItems: 'center' },
  topTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.white,
  },
  topModule: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.white,
    opacity: 0.85,
  },
  safeBanner: {
    backgroundColor: '#fff9c4',
    paddingVertical: 6,
    alignItems: 'center',
  },
  safeText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: '#5d4037',
    letterSpacing: 0.5,
  },
  content: { flex: 1 },
});
