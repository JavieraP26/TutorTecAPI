/**
 * RequestCard — petición comunitaria con estado y botón de voto.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningRequest, RequestStatus } from '@/hooks/useRequests';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const STATUS_LABEL: Record<RequestStatus, string> = {
  received: 'Recibida',
  in_development: 'En desarrollo',
  available: 'Disponible',
};

const STATUS_COLOR: Record<RequestStatus, string> = {
  received: colors.gray400,
  in_development: colors.warning,
  available: colors.success,
};

interface Props {
  request: LearningRequest;
  onVote: (id: string) => void;
  voting?: boolean;
}

export function RequestCard({ request, onVote, voting = false }: Props) {
  const { id, description, category, votes, status, is_mine, already_voted } = request;
  const statusColor = STATUS_COLOR[status];
  const canVote = !already_voted && !is_mine;

  return (
    <View style={[styles.card, is_mine && styles.cardMine]}>
      <View style={styles.top}>
        {category && (
          <View style={[styles.categoryChip]}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        <View style={[styles.statusChip, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABEL[status]}
          </Text>
        </View>
        {is_mine && (
          <View style={styles.mineChip}>
            <Text style={styles.mineText}>Mía</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.footer}>
        <Text style={styles.voteCount}>
          👍 {votes} voto{votes !== 1 ? 's' : ''}
        </Text>

        <Pressable
          style={[
            styles.voteBtn,
            already_voted && styles.voteBtnActive,
            (!canVote || voting) && styles.voteBtnDisabled,
          ]}
          onPress={() => canVote && !voting && onVote(id)}
          disabled={!canVote || voting}
        >
          <Text style={[styles.voteBtnText, already_voted && styles.voteBtnTextActive]}>
            {already_voted ? '✓ Apoyada' : 'Apoyar'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardMine: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  top: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.gray100,
    borderRadius: radius.full,
  },
  categoryText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statusChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  statusText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
  },
  mineChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
  },
  mineText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: colors.primary,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voteCount: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  voteBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  voteBtnActive: {
    backgroundColor: colors.primaryLight,
  },
  voteBtnDisabled: {
    opacity: 0.5,
  },
  voteBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  voteBtnTextActive: {
    color: colors.primary,
  },
});
