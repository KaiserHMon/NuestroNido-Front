/**
 * Servicio de Autenticación
 * Gestiona las llamadas a la API (o simuladas) para login y registro.
 */

import { Usuario, ApiResponse } from "@/lib/types"

// Simular retraso de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const AuthService = {
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; usuario: Usuario }>> {
    // TODO: Reemplazar con llamada real a API
    await delay(800) // Simular latencia

    // Simulación de éxito
    return {
      success: true,
      data: {
        token: "mock-token-" + Date.now(),
        usuario: {
          id: "user-" + Date.now(),
          nombre: email.split("@")[0],
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }
  },

  async register(nombre: string, email: string, password: string): Promise<ApiResponse<{ token: string; usuario: Usuario }>> {
    // TODO: Reemplazar con llamada real a API
    await delay(800)

    return {
      success: true,
      data: {
        token: "mock-token-" + Date.now(),
        usuario: {
          id: "user-" + Date.now(),
          nombre,
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }
  }
}
