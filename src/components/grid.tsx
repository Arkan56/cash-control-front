import Card from "./card";

type Item = {
  id: number;
  title: string;
  subtitle?: string;
};

type GridProps = {
  items: Item[];
};

export default function Grid({ items }: GridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} title={item.title} />
      ))}
    </div>
  );
}
