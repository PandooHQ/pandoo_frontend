import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ApiUser } from "../../types/ApiUser";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    currentUsers: ApiUser[] , 
    filteredUsers: ApiUser[], 
    currentPage: number, 
    totalPages: number , 
    setCurrentPage: Dispatch<SetStateAction<number>>
}

const PaginationUsers = ({currentUsers, filteredUsers, currentPage, totalPages, setCurrentPage}: Props) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
        filtrados
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        {/* Números de página */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationUsers;
