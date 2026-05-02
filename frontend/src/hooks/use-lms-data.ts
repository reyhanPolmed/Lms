"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { lmsClient } from "@/lib/api/client";
import {
  PasswordPayload,
  ProfilePayload,
  QuizSubmitPayload,
  TrackDurationPayload
} from "@/lib/types";

const queryKeys = {
  dashboard: ["dashboard"] as const,
  modules: ["modules"] as const,
  moduleDetail: (id: string) => ["modules", id] as const,
  lessonDetail: (id: string) => ["lessons", id] as const,
  quizDetail: (id: string) => ["quizzes", id] as const,
  taskDetail: (id: string) => ["tasks", id] as const,
  profile: ["profile"] as const
};

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => lmsClient.getDashboard()
  });
}

export function useModulesQuery() {
  return useQuery({
    queryKey: queryKeys.modules,
    queryFn: () => lmsClient.getModules()
  });
}

export function useModuleDetailQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.moduleDetail(id),
    queryFn: () => lmsClient.getModuleById(id)
  });
}

export function useLessonDetailQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.lessonDetail(id),
    queryFn: () => lmsClient.getLessonById(id),
    enabled: enabled && Boolean(id)
  });
}

export function useQuizDetailQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.quizDetail(id),
    queryFn: () => lmsClient.getQuizById(id),
    enabled: enabled && Boolean(id)
  });
}

export function useTaskDetailQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.taskDetail(id),
    queryFn: () => lmsClient.getTaskById(id),
    enabled: enabled && Boolean(id)
  });
}

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => lmsClient.getProfile()
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lmsClient.login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    }
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => lmsClient.logout(),
    onSuccess: () => {
      queryClient.clear();
    }
  });
}

export function useLessonDurationMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TrackDurationPayload) => lmsClient.trackLessonDuration(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.lessonDetail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      void queryClient.invalidateQueries({ queryKey: queryKeys.modules });
    }
  });
}

export function useLessonCompleteMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => lmsClient.completeLesson(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.lessonDetail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      void queryClient.invalidateQueries({ queryKey: queryKeys.modules });
    }
  });
}

export function useQuizStartMutation(id: string) {
  return useMutation({
    mutationFn: () => lmsClient.startQuiz(id)
  });
}

export function useQuizSubmitMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuizSubmitPayload) => lmsClient.submitQuiz(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.quizDetail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    }
  });
}

export function useTaskSubmitMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionLink }: { submissionLink: string }) =>
      lmsClient.submitTask(id, submissionLink),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.taskDetail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    }
  });
}

export function useProfileUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfilePayload) => lmsClient.updateProfile(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    }
  });
}

export function usePasswordChangeMutation() {
  return useMutation({
    mutationFn: (payload: PasswordPayload) => lmsClient.changePassword(payload)
  });
}
