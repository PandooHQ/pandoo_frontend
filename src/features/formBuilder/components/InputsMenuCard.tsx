import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { options } from "../InputsOptions";
import { ClonableItem } from "./Items/ClonableItem";

export default function InputsMenuCard({ menuKey }: { menuKey: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Campos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* {options.map(({ label, type, icon }) => (
            <ClonableItem
              key={type}
              id={type}
              label={label}
              icon={icon}
              type={type}
            />
          ))} */}

          {options.map((opt, i) => {
            const id = `${opt.type}-${menuKey}-${i}`; // unico mientras menuKey no cambie
            return (
              <ClonableItem
                key={id}
                id={id}
                label={opt.label}
                type={opt.type}
                icon={opt.icon}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}