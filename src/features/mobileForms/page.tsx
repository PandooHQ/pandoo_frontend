import { MobileFormInputs } from "./components/MobileFormInputs"
import MobileFormList from "./components/MobileFormList"
import { MobileFormsProvider } from "./hooks/MobileFormsProvider"
import { useMobileFormsContext } from "./hooks/useMobileFormsContext"

const Content = () => {
  const { filteredForms } = useMobileFormsContext()
  return (
    <>
      <MobileFormInputs />
      <MobileFormList mobileForms={filteredForms} />
    </>
  )
}

const MobileFormsPage = () => {
  return (
    <MobileFormsProvider>
      <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
        <h1 className="font-bold text-2xl">Historial</h1>
        <Content />
      </div>
    </MobileFormsProvider>
  )
}

export default MobileFormsPage
