import type { MobileForm } from "../types/MobileFormType";
import MobileFormCard from "./MobileFormCard";

interface Props {
  mobileForms: MobileForm[];
}

const MobileFormList = ({ mobileForms }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
      {mobileForms.length > 0 ? (
        mobileForms.map((form) => (
          <MobileFormCard key={form.id} mobileForm={form} />
        ))
      ) : (
        <p>No hay</p>
      )}
    </div>
  );
};

export default MobileFormList;
