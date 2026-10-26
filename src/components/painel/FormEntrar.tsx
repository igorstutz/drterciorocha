"use client";

import { useActionState, useState } from "react";
import { entrar } from "@/lib/painel/acoes";
import { Icone } from "@/components/painel/Icone";

export function FormEntrar() {
  const [estado, acao, enviando] = useActionState(entrar, null);
  const [ver, setVer] = useState(false);
  /* Controlado: o React limpa o formulário depois de cada envio, e quem errou a senha não precisa redigitar o e-mail. */
  const [email, setEmail] = useState("");

  return (
    <form action={acao} className="mt-8 space-y-5">
      <label className="block">
        <span className="text-[0.85rem] font-medium text-text-strong">E-mail</span>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          autoFocus
          className="painel-campo mt-2"
          placeholder="voce@exemplo.com"
        />
      </label>

      <label className="block">
        <span className="text-[0.85rem] font-medium text-text-strong">Senha</span>
        <span className="relative mt-2 block">
          <input
            name="senha"
            type={ver ? "text" : "password"}
            required
            autoComplete="current-password"
            className="painel-campo pr-12"
          />
          <button
            type="button"
            onClick={() => setVer((v) => !v)}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center text-text-muted hover:text-text-strong"
            aria-label={ver ? "Esconder a senha" : "Mostrar a senha"}
          >
            <Icone nome={ver ? "olhoFechado" : "olho"} className="h-[1.1rem] w-[1.1rem]" />
          </button>
        </span>
      </label>

      {estado?.erro && (
        <p role="alert" className="flex items-start gap-2.5 rounded-lg bg-red-50 px-4 py-3 text-[0.88rem] text-red-800">
          <Icone nome="alerta" className="mt-0.5 h-4 w-4" />
          {estado.erro}
        </p>
      )}

      <button type="submit" disabled={enviando} className="painel-botao painel-botao-primario h-12 w-full text-[0.95rem]">
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
