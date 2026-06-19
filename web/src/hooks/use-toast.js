// "use client" - directiva para indicar que este hook funciona en el cliente
// Inspirado en react-hot-toast library
import * as React from "react"

// Límite máximo de toasts visibles simultáneamente
const TOAST_LIMIT = 1
// Tiempo de espera antes de remover el toast (en milisegundos)
const TOAST_REMOVE_DELAY = 1000000

// Tipos de acciones para el reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
}

// Contador para generar IDs únicos de toasts
let count = 0

// Función para generar ID único de toast
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString();
}

// Mapa para gestionar los timeouts de los toasts
const toastTimeouts = new Map()

// Agrega el toast a la cola de removido
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Reducer: función que maneja el estado de los toasts
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - Esto podría extraerse en una acción dismissToast()
      // pero lo mantenemos aquí para simplicidad
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

// Array de listeners para notificar cambios de estado
const listeners = []

// Estado en memoria (común a todos los listeners)
let memoryState = { toasts: [] }

// Función dispatch: envía acciones al reducer y notifica a los listeners
function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Función toast: crea y muestra una notificación
function toast({
  ...props
}) {
  const id = genId()

  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

// Hook useToast: para usar toasts en componentes funcionales
function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    };
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Exportamos el hook y la función toast
export { useToast, toast }