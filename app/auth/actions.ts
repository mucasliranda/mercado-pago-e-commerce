"use server";

import { createClient } from "lib/supabase/server";
import { baseUrl } from "lib/utils";
import { redirect } from "next/navigation";

function createAuthRedirect(pathname: string, message: string, next?: string) {
  const params = new URLSearchParams({ message });

  if (next) {
    params.set("next", next);
  }

  return `${pathname}?${params.toString()}`;
}

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateCredentials(email: string, password: string) {
  const errors: string[] = [];

  if (!email || !email.includes("@")) {
    errors.push("Informe um email valido.");
  }

  if (!password || password.length < 8) {
    errors.push("A senha precisa ter pelo menos 8 caracteres.");
  }

  return errors;
}

export async function login(formData: FormData) {
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const next = getField(formData, "next");
  const errors = validateCredentials(email, password);

  if (errors.length) {
    redirect(createAuthRedirect("/login", errors[0]!, next));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      createAuthRedirect(
        "/login",
        "Nao foi possivel entrar com esses dados.",
        next,
      ),
    );
  }

  redirect(next || "/");
}

export async function signup(formData: FormData) {
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const confirmPassword = getField(formData, "confirmPassword");
  const next = getField(formData, "next");
  const errors = validateCredentials(email, password);

  if (password !== confirmPassword) {
    errors.push("As senhas precisam ser iguais.");
  }

  if (errors.length) {
    redirect(createAuthRedirect("/signup", errors[0]!, next));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/account`,
    },
  });

  if (error) {
    redirect(
      createAuthRedirect(
        "/signup",
        "Nao foi possivel criar a sua conta.",
        next,
      ),
    );
  }

  if (data.user && !data.session) {
    redirect(
      createAuthRedirect(
        "/login",
        "Conta criada. Confira seu email para confirmar o acesso.",
        next,
      ),
    );
  }

  redirect(next || "/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
