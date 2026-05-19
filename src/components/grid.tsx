import Card from "./card";

type Item = {
  id: number;
  title: string;
  subtitle?: string;
};

type GridProps = {
  items: Item[];
  onItemClick?: (id: number) => void;
};

export default function Grid({ items, onItemClick }: GridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          onClick={() => onItemClick?.(item.id)}
          key={item.id}
          title={item.title}
        />
      ))}
    </div>
  );
}
