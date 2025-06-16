import { create } from 'zustand'

type Category =
  | 'Wildfires'
  | 'Severe Storms'
  | 'Floods'
  | 'Volcanoes'
  | 'Earthquakes'

type FilterState = {
  activeCategories: Category[]
  toggleCategory: (cat: Category) => void
  isCategoryActive: (cat: Category) => boolean
}

export const useFilterStore = create<FilterState>((set, get) => ({
  activeCategories: ['Wildfires', 'Severe Storms', 'Floods', 'Volcanoes', 'Earthquakes'],
  toggleCategory: (cat) =>
    set((state) => ({
      activeCategories: state.activeCategories.includes(cat)
        ? state.activeCategories.filter((c) => c !== cat)
        : [...state.activeCategories, cat],
    })),
  isCategoryActive: (cat) => get().activeCategories.includes(cat),
}))
