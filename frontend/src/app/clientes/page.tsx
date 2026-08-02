"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string | null;
  observacoes: string | null;
  criadoEm: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
  
    const fetchClientes = async (token: string) => {
      try {
        const url = buscaAplicada
          ? `http://localhost:3000/clientes?busca=${encodeURIComponent(buscaAplicada)}`
          : "http://localhost:3000/clientes";

        const resposta = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (resposta.status === 401) {
          localStorage.removeItem("token");
          router.replace("/");
          return;
        }

        if (!resposta.ok) {
          setMensagem("Não foi possível obter a lista de clientes.");
          return;
        }

        const dados = (await resposta.json()) as Cliente[];
        setClientes(dados);

      }catch {
        setMensagem("Não foi possível conectar ao servidor.");
      }
    }
    void fetchClientes(token);
  }, [router, buscaAplicada]);

  const pesquisar = (evento: SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setBuscaAplicada(busca.trim());
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <main className={styles.main}>
        <section className={styles.telaClientes}>
          
          <header className={styles.cabecalho}>
            <h1> 
              <span className={styles.tituloCategoria}>Clientes</span>
            </h1>

            <h2 className={styles.subtitulo}>
              <span className={styles.subtituloCategoria}>Sistema de Gerenciamento de Clientes</span>
            </h2>

            <button type="button" onClick={logout}>Sair</button>
          </header>

          <form onSubmit={pesquisar}>
            <label htmlFor="busca">Buscar cliente por nome</label>

            <input
              id="busca"
              type="search"
              placeholder="Digite o nome do cliente"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}/>

            <button type="submit">Buscar</button>

            <button type="button" onClick={() => {
              setBusca("");
              setBuscaAplicada("");
            }}>Limpar
            </button>
          </form>

          {mensagem && (<p className={styles.mensagemErro}>{mensagem}</p>)}

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Empresa</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={5}>Nenhum cliente cadastrado.</td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.empresa ?? "-"}</td>
                    <td>
                      <button type="button">Editar</button>
                      <button type="button">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </section>
      </main>
  );
}