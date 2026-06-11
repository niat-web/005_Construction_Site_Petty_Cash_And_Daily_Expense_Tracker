import { CATEGORY_BADGE_STYLES } from '../../utils/constants';

export default function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_BADGE_STYLES[category] || 'badge-gray';
  return <span className={style}>{category}</span>;
}
