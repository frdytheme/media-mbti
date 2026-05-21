export type SelectedOptionScore = {
  categoryId: string;
  scoreDelta: number;
};

export type CategoryScores = Record<string, number>;

export const INITIAL_CATEGORY_SCORE = 100;
export const MIN_CATEGORY_SCORE = 0;

export function calculateCategoryScores(
  selectedOptions: SelectedOptionScore[],
  categoryIds: string[] = [],
): CategoryScores {
  const scores: CategoryScores = {};

  for (const categoryId of categoryIds) {
    scores[categoryId] = INITIAL_CATEGORY_SCORE;
  }

  for (const { categoryId, scoreDelta } of selectedOptions) {
    const currentScore = scores[categoryId] ?? INITIAL_CATEGORY_SCORE;
    scores[categoryId] = Math.max(
      MIN_CATEGORY_SCORE,
      currentScore + scoreDelta,
    );
  }

  return scores;
}
