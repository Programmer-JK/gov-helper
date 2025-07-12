import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ERROR_MESSAGE } from "@/util/const/error-message";
import { SignInFormData } from "@/util/type/application";
import { apiFetch } from "@/util/function/api";

// 인증 스토어 상태 타입
interface AuthState {
  // 상태
  token: string | null;
  refreshToken: string | null;
  savedId: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // 액션
  login: (formData: SignInFormData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setSavedId: (email: string) => void;
  removeSavedId: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      token: null,
      refreshToken: null,
      savedId: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // 로그인 액션
      login: async (formData: SignInFormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiFetch(`api/login`, {
            method: "POST",
            body: JSON.stringify(formData),
          });

          if (response.success) {
            set({
              token: response.data.token,
              refreshToken: response.data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            const errorMessage =
              ERROR_MESSAGE[response.errorCode as keyof typeof ERROR_MESSAGE] ||
              "로그인에 실패했습니다.";
            set({ error: errorMessage, isLoading: false });
            return false;
          }
        } catch (err) {
          const errorMessage =
            ERROR_MESSAGE[err as keyof typeof ERROR_MESSAGE] ||
            "로그인에 실패했습니다.";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // 로그아웃 액션
      logout: () => {
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // 에러 초기화
      clearError: () => set({ error: null }),

      // ID 저장
      setSavedId: (email: string) => set({ savedId: email }),

      // ID 제거
      removeSavedId: () => set({ savedId: null }),

      // 로딩 상태 설정
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),

    {
      name: "govhelper-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        savedId: state.savedId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
