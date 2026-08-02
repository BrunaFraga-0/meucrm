"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const router = useRouter();

  const handleSubmit = async (evento: SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setMensagem("");

    try {
      const resposta = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = (await resposta.json()) as {
        access_token?: string;
      };

      if (!resposta.ok || !dados.access_token) {
        setMensagem("E-mail ou senha inválidos.");
        return;
      }

      localStorage.setItem("token", dados.access_token);
      router.push("/clientes");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
};

  return (
      <main className={styles.main}>
        <section className={styles.telaDeLogin}>
          <header className={styles.cabecalho}>
            <h1> 
              <span className={styles.tituloCategoria}>MeuCRM</span>
            </h1>

            <h2 className={styles.subtitulo}>
              <span className={styles.subtituloCategoria}>Sistema de Gerenciamento de Clientes</span>
            </h2>
          </header>

          <p className={styles.paragrafo}>
            Faça login para acessar o sistema.
          </p>

          <p className={styles.mensagemErro}>{mensagem}</p>

          <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.formEmail}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@meucrm.com"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}  
                required
              />
            </div>

            <div className={styles.formSenha}>
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="••••••"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                required
              />
            </div>

            <button className={styles.botaoEntrar} type="submit">Entrar</button>

            <p className={styles.paragrafoMensagem}>
              <span className={styles.paragrafoMensagemSpan}>Acesso para demonstração</span> 
                {" "}E-mail:
              <span className={styles.paragrafoMensagemSpanEmail}>
                admin@meucrm.com | 
              </span>
              {" "}Senha:{" "}
              <span className={styles.paragrafoMensagemSpanSenha}>
                123456
              </span>
            </p>

            
          </form>

          <footer className={styles.rodape}>
            Desenvolvido por Bruna Caroline Fraga
          </footer>

        </section>
      </main>
  );
}