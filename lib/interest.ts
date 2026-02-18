import { CATEGORIES } from "@/constants";

export function getCategoryInterestScore(selectedIds: string[]) {
  return CATEGORIES.map(cat => {
    const count = cat.subOptions.filter(opt =>
      selectedIds.includes(opt.id)
    ).length

    const total = cat.subOptions.length

    return {
      ...cat,
      interestScore: count,
      interestPercent: total > 0 ? count / total : 0,
    }
  })
}

export function sortCategoriesByInterest(categories: any[]) {
  const hasInterest = categories.some(c => c.interestScore > 0)

  // nếu user chưa chọn gì → giữ nguyên order
  if (!hasInterest) return categories

  return [...categories].sort((a, b) => {
    // luôn pin all lên đầu
    if (a.id === "all") return -1
    if (b.id === "all") return 1

    // sort theo score
    if (b.interestScore !== a.interestScore) {
      return b.interestScore - a.interestScore
    }

    // fallback stable order
    return a.label.localeCompare(b.label)
  })
}
