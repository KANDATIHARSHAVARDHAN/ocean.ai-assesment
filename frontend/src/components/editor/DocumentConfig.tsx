import type { DocumentStructure } from "../../types";

type Props = {
  structures: DocumentStructure[];
  selectedId: number | null;
  onSelect: (structure: DocumentStructure) => void;
};

export function DocumentConfig({ structures, selectedId, onSelect }: Props) {
  return (
    <ul className="structure-list selectable">
      {structures.map((structure) => (
        <li
          key={structure.id}
          className={selectedId === structure.id ? "active" : ""}
          onClick={() => onSelect(structure)}
        >
          <span>
            #{structure.order_index + 1} {structure.title}
          </span>
          <small>{structure.content?.generated_content ? "Draft ready" : "Needs generation"}</small>
        </li>
      ))}
    </ul>
  );
}


