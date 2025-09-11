export default function Banner() {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-40 h-40 md:w-20 md:h-20 rounded-lg flex items-center justify-center"> 
            <img src="/LogoPandoo.png" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Bienvenido a Pandoo
          </h1>
          <p className="text-lg text-muted-foreground">
            Digitalizacion de datos
          </p>
        </div>
      </div>
      <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
        Optimiza tus procesos de recolección de datos con formularios potentes,
        análisis en tiempo real y herramientas integrales de gestión de
        personal.
      </p>
    </div>
  );
}
