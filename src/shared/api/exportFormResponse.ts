import api from "@/shared/api/api"

export const exportFormResponse = async (id: number) => {
  try {
    const resp = await api.get(`form_responses/${id}/export`)

    if (resp.data?.url) {
      const { url } = resp.data

      window.open(url, "_blank")
    } else {
      throw new Error("No se recibió una URL de exportación válida")
    }
  } catch (error) {
    console.error("Error exportando el PDF:", error)
    alert("Hubo un error generando el PDF. Intenta nuevamente.")
  }
}
