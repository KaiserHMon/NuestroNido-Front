/**
 * Hook personalizado para autenticación
 * Maneja login, register, logout y gestión de sesión
 */

"use client"

import { useState, useCallback, useEffect } from "react"
import { Usuario, LoginRequest, RegisterRequest, ApiResponse } from "@/lib/types"

interface AuthState {
  usuario: Usuario | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Verificar si hay sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const usuarioStr = localStorage.getItem("usuario")

        if (token && usuarioStr) {
          const usuario = JSON.parse(usuarioStr)
          setState({
            usuario,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } else {
          setState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Error verificando sesión:", error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    checkSession()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulación hasta que el backend esté disponible
      const mockResponse: ApiResponse<{
        token: string
        usuario: Usuario
      }> = {
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

      if (mockResponse.success && mockResponse.data) {
        const { token, usuario } = mockResponse.data

        localStorage.setItem("auth_token", token)
        localStorage.setItem("usuario", JSON.stringify(usuario))

        setState({
          usuario,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión"
      setState({
        usuario: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  }, [])

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulación hasta que el backend esté disponible
      const mockResponse: ApiResponse<{
        token: string
        usuario: Usuario
      }> = {
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

      if (mockResponse.success && mockResponse.data) {
        const { token, usuario } = mockResponse.data

        localStorage.setItem("auth_token", token)
        localStorage.setItem("usuario", JSON.stringify(usuario))

        setState({
          usuario,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrarse"
      setState({
        usuario: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("usuario")
    localStorage.removeItem("familia")

    setState({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
  }
}
