import Card from "./card";
import type { ReactNode } from "react";

interface Item {
  id: number;
  title: string;
  subtitle?: string;
}

interface GridProps {
  items: Item[];
  onItemClick?: (id: number) => void;
  actionText?: string;
  icon?: ReactNode;
}

export default function Grid({
  items,
  onItemClick,
  actionText,
  icon,
}: GridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          icon={icon}
          actionText={actionText}
          onClick={() => onItemClick?.(item.id)}
        />
      ))}
    </div>
  );
}
